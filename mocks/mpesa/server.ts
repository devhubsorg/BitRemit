import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import twilio from "twilio";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Cryptographically-random hex ID (no external deps). */
function randomId(): string {
  return Array.from({ length: 20 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
}

/** Resolve after `ms` milliseconds. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Random integer between min and max (inclusive). */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------------------------------------------------------------------------
// Twilio client (optional — gracefully skipped if env vars are absent)
// ---------------------------------------------------------------------------

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID ?? "";
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN ?? "";
const twilioFrom = process.env.TWILIO_PHONE_NUMBER ?? "";

const twilioReady =
  twilioAccountSid.length > 0 &&
  twilioAuthToken.length > 0 &&
  twilioFrom.length > 0;

const twilioClient = twilioReady
  ? twilio(twilioAccountSid, twilioAuthToken)
  : null;

async function sendSms(to: string, body: string): Promise<void> {
  if (!twilioClient) {
    console.log(
      `[SMS SKIPPED — Twilio not configured] To: ${to} | Body: ${body}`,
    );
    return;
  }
  try {
    const message = await twilioClient.messages.create({
      body,
      from: twilioFrom,
      to,
    });
    console.log(`[SMS SENT] SID: ${message.sid} | To: ${to}`);
  } catch (err) {
    console.error("[SMS ERROR]", err);
  }
}

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ---------------------------------------------------------------------------
// POST /api/pay
// ---------------------------------------------------------------------------

interface PayBody {
  amount: number;
  phoneNumber: string;
  reference: string;
}

app.post(
  "/api/pay",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { amount, phoneNumber, reference } = req.body as Partial<PayBody>;

      // --- Validation ---
      if (
        amount === undefined ||
        amount === null ||
        typeof phoneNumber !== "string" ||
        !phoneNumber.trim() ||
        typeof reference !== "string" ||
        !reference.trim()
      ) {
        res.status(400).json({
          ResponseCode: "400",
          ResponseDescription: "Bad Request",
          errorMessage:
            "Missing or invalid fields: amount (number), phoneNumber (string), reference (string) are all required.",
        });
        return;
      }

      if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
        res.status(400).json({
          ResponseCode: "400",
          ResponseDescription: "Bad Request",
          errorMessage: "amount must be a positive number.",
        });
        return;
      }

      // --- Simulate processing delay (3–6 s) ---
      const processingDelay = randomBetween(3000, 6000);
      await delay(processingDelay);

      // --- 5 % random failure ---
      const failed = Math.random() < 0.05;

      if (failed) {
        res.status(200).json({
          ResponseCode: "1",
          ResponseDescription: "Failed",
          errorMessage: "Insufficient funds",
        });
        return;
      }

      // --- 95 % success ---
      const checkoutRequestId = `ws_CO_${randomId()}`;
      const merchantRequestId = randomId();

      res.status(200).json({
        ResponseCode: "0",
        ResponseDescription: "Success",
        CheckoutRequestID: checkoutRequestId,
        MerchantRequestID: merchantRequestId,
      });

      // --- Fire-and-forget: send SMS after additional 2 s ---
      (async () => {
        await delay(2000);
        const kesAmount = (amount * 130).toFixed(2);
        const smsBody = `You have received KES ${kesAmount}. Ref: ${reference}. Check your M-Pesa.`;
        await sendSms(phoneNumber.trim(), smsBody);
      })().catch((err) => console.error("[POST-PAYMENT SMS ERROR]", err));
    } catch (err) {
      next(err);
    }
  },
);

// ---------------------------------------------------------------------------
// GET /health
// ---------------------------------------------------------------------------

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "mpesa-mock",
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[UNHANDLED ERROR]", err);
  res.status(500).json({
    ResponseCode: "500",
    ResponseDescription: "Internal Server Error",
    errorMessage: "An unexpected error occurred.",
  });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const PORT = process.env.PORT ?? "3001";

app.listen(Number(PORT), () => {
  console.log(`M-Pesa mock server running on port ${PORT}`);
  console.log(
    `Twilio SMS: ${twilioReady ? "enabled" : "disabled (env vars missing)"}`,
  );
});

export default app;
