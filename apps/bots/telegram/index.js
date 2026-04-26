import { Bot, session, InlineKeyboard } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { Redis } from "@upstash/redis";
import { prisma } from '@bitremit/database';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { buildSendSummary, validatePhoneNumber } from '../shared/flows.js';
dotenv.config({ path: '../../.env.local' });
const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
function generateUserToken(address, userId) {
    return jwt.sign({ address, sub: userId }, JWT_SECRET, { expiresIn: '1h' });
}
// 1. Setup Grammy Bot
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token)
    throw new Error("Missing TELEGRAM_BOT_TOKEN");
const bot = new Bot(token);
// 2. Setup Upstash Redis for sessions and rate limits
const upstashRedis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
});
// Create inline storage adapter for Redis
class RedisAdapter {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async read(key) {
        const data = await this.redis.get(key);
        return data ? (typeof data === 'string' ? JSON.parse(data) : data) : undefined;
    }
    async write(key, data) {
        await this.redis.set(key, JSON.stringify(data));
    }
    async delete(key) {
        await this.redis.del(key);
    }
}
// Session setup
bot.use(session({
    initial: () => ({}),
    storage: new RedisAdapter(upstashRedis),
}));
// Install conversations
bot.use(conversations());
// Rate limit middleware
bot.use(async (ctx, next) => {
    if (!ctx.chat)
        return next();
    // Allow callbacks to bypass rate limit checks smoothly during convos, or limit everything?
    // Limiting everything by chat id:
    const key = `telegram:ratelimit:${ctx.chat.id}`;
    const count = await upstashRedis.incr(key);
    if (count === 1) {
        await upstashRedis.expire(key, 60);
    }
    if (count > 5) {
        if (count === 6) { // Only warn once per spam burst
            await ctx.reply("⏳ Rate limit exceeded (5 msgs/min). Please wait.");
        }
        return;
    }
    await next();
});
// Helpers to identify User
async function getConnectedUser(telegramChatId) {
    // Note: We need a way to link Telegram IDs to the User.
    // For this simulation, we'll assume the user registered their telegramChatId somewhere,
    // OR we lookup a user by some mechanism.
    // To mirror the WhatsApp bot securely without a full Telegram linking flow out of scope,
    // we fetch the FIRST valid user for testing just to simulate the API interactions.
    const user = await prisma.user.findFirst({
        where: {}
    });
    return user;
}
// --- CONVERSATION: SEND ---
async function sendFlow(conversation, ctx) {
    const user = await conversation.external(async () => await getConnectedUser(ctx.chat.id.toString()));
    if (!user) {
        await ctx.reply("Connect your wallet first: https://bitremit.vercel.app");
        return;
    }
    const token = generateUserToken(user.address, user.id);
    // Step 1: Who to send to? We fetch recent recipients locally
    const recipients = await conversation.external(async () => {
        return prisma.recipient.findMany({
            // Assuming Recipient has a userId field tying it to the User model.
            // If they are not directly tied, we fall back to a broad match for demo.
            take: 5
        });
    });
    const keyboard = new InlineKeyboard();
    recipients.forEach((r) => {
        keyboard.text(`👤 ${r.name || r.phoneNumber} (${r.paymentRail})`, `recip_${r.id}`).row();
    });
    keyboard.text("➕ New recipient", "recip_new").row();
    keyboard.text("❌ Cancel", "cancel");
    await ctx.reply("Who do you want to send to?", { reply_markup: keyboard });
    const btnCtx = await conversation.waitForCallbackQuery(/recip_.+|cancel/);
    await btnCtx.answerCallbackQuery();
    if (btnCtx.callbackQuery.data === "cancel") {
        await ctx.reply("Transfer cancelled.");
        return;
    }
    let recipientId = '';
    let recipientPhone = '';
    let railType = '';
    if (btnCtx.callbackQuery.data === "recip_new") {
        await ctx.reply("Enter their phone number (e.g. +2348031234567):");
        const phoneCtx = await conversation.waitFor("message:text");
        const validation = validatePhoneNumber(phoneCtx.message?.text || "");
        if (!validation.valid) {
            await ctx.reply("Invalid phone format. Let's start over. Type /send");
            return;
        }
        recipientPhone = validation.e164;
        const railKeyboard = new InlineKeyboard()
            .text("M-Pesa", "rail_MPESA").row()
            .text("GCash", "rail_GCASH").row()
            .text("MTN MoMo", "rail_MTNMOMO").row()
            .text("Cancel", "cancel");
        await ctx.reply("Which payment rail?", { reply_markup: railKeyboard });
        const railCtx = await conversation.waitForCallbackQuery(/rail_.+|cancel/);
        await railCtx.answerCallbackQuery();
        if (railCtx.callbackQuery.data === "cancel") {
            await ctx.reply("Cancelled.");
            return;
        }
        railType = railCtx.callbackQuery.data.replace("rail_", "");
        const createdRecip = await conversation.external(async () => {
            const apiRes = await fetch(`${API_URL}/api/recipients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name: `New Contact`, phoneNumber: recipientPhone, paymentRail: railType })
            });
            if (apiRes.ok)
                return await apiRes.json();
            return null;
        });
        if (createdRecip) {
            recipientId = createdRecip.id;
        }
        else {
            await ctx.reply("Failed to register recipient. Please use the web app.");
            return;
        }
    }
    else {
        recipientId = btnCtx.callbackQuery.data.replace("recip_", "");
        const existing = recipients.find((r) => r.id === recipientId);
        if (existing) {
            recipientPhone = existing.phoneNumber;
            railType = existing.paymentRail;
        }
    }
    // Step 2: Amount
    await ctx.reply("How much USD do you want to send?");
    const amountCtx = await conversation.waitFor("message:text");
    const amount = parseFloat(amountCtx.message?.text || "0");
    if (isNaN(amount) || amount <= 0) {
        await ctx.reply("Invalid amount. Let's start over with /send");
        return;
    }
    // Step 3: Summary
    const summary = buildSendSummary(recipientPhone, amount, railType);
    const confirmKeyboard = new InlineKeyboard()
        .text("✅ Confirm", "confirm_send")
        .text("❌ Cancel", "cancel");
    await ctx.reply(summary, { reply_markup: confirmKeyboard, parse_mode: "Markdown" });
    const confirmCtx = await conversation.waitForCallbackQuery(["confirm_send", "cancel"]);
    await confirmCtx.answerCallbackQuery();
    if (confirmCtx.callbackQuery.data === "cancel") {
        await ctx.reply("Transfer cancelled.");
        return;
    }
    // Step 4: POST /api/remittance
    const response = await conversation.external(async () => {
        const payload = { recipientId, amount: amount.toString(), railType };
        const apiRes = await fetch(`${API_URL}/api/remittance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        if (apiRes.ok)
            return await apiRes.json();
        const err = await apiRes.json().catch(() => ({}));
        return { error: err.error || "Server error" };
    });
    if (response.error) {
        await ctx.reply(`❌ Transfer failed: ${response.error}`);
    }
    else {
        const ref = response.txHash ? response.txHash.slice(0, 10) : response.transactionId || 'N/A';
        await ctx.reply(`✅ Transfer sent!\nRef: ${ref}\nTrack: bitremit.vercel.app/history`);
    }
}
// @ts-ignore
bot.use(createConversation(sendFlow));
// --- COMMAND HANDLERS ---
bot.command("start", async (ctx) => {
    const text = `🌍 *Welcome to BitRemit Telegram Bot!*\n\n` +
        `Available commands:\n` +
        `🏦 /balance - Check your vault state\n` +
        `💸 /send - Send cross-border payouts\n` +
        `🔍 /status {ref} - Check transfer status\n` +
        `❓ /help - Complete help menu`;
    await ctx.reply(text, { parse_mode: "Markdown" });
});
bot.command("help", async (ctx) => {
    await ctx.reply("BitRemit Commands:\n/balance - Check balances\n/send - Send funds\n/status <ref> - Track payouts");
});
bot.command("balance", async (ctx) => {
    const user = await getConnectedUser(ctx.chat.id.toString());
    if (!user)
        return ctx.reply("Connect your wallet first: https://bitremit.vercel.app");
    const token = generateUserToken(user.address, user.id);
    const apiRes = await fetch(`${API_URL}/api/vault`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (apiRes.ok) {
        const data = await apiRes.json();
        const btc = parseFloat(data.collateralAmount || "0").toFixed(4);
        const musd = parseFloat(data.borrowedMUSD || "0").toFixed(2);
        const ratio = parseFloat(data.collateralRatio || "0") * 100;
        await ctx.reply(`*Your MUSD Balance:* ${musd} MUSD\n*BTC Locked:* ${btc} BTC\n*Ratio:* ${ratio.toFixed(0)}%`, { parse_mode: "Markdown" });
    }
    else {
        await ctx.reply("Sorry, couldn't fetch your balance right now.");
    }
});
bot.command("status", async (ctx) => {
    const params = ctx.match;
    if (!params)
        return ctx.reply("Please provide a reference ID. E.g. '/status 123'");
    const user = await getConnectedUser(ctx.chat.id.toString());
    if (!user)
        return ctx.reply("Connect your wallet first.");
    const token = generateUserToken(user.address, user.id);
    const apiRes = await fetch(`${API_URL}/api/remittance/${params}`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (apiRes.ok) {
        const data = await apiRes.json();
        await ctx.reply(`Transfer ${params}: ${data.status} — ${data.recipient.phoneNumber} ${data.fiatAmount} ${data.fiatCurrency}`);
    }
    else {
        await ctx.reply(`Transfer ${params} not found or error occurred.`);
    }
});
bot.command("send", async (ctx) => {
    await ctx.conversation.enter("sendFlow");
});
// Start the bot using Long Polling for development
bot.start({
    onStart: (botInfo) => {
        console.log(`[Telegram Bot] Listening as @${botInfo.username}`);
    }
});
