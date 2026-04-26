// Shared logic for chatbots

/**
 * Validates formatting of an E.164 phone number.
 * E.g., +254XXXXXXXXX, +63XXXXXXXXX
 */
export function validatePhoneNumber(phone: string): { valid: boolean; e164: string; error?: string } {
    const cleaned = phone.replace(/\s+/g, '');
    const phoneRegex = /^\+[1-9]\d{9,14}$/;

    if (!phoneRegex.test(cleaned)) {
        return { 
            valid: false, 
            e164: '', 
            error: "Invalid format. Phone number must include the country code and start with '+', e.g., +254712345678." 
        };
    }
    return { valid: true, e164: cleaned };
}

/**
 * Estimates the local fiat received based on payment rail and amount in MUSD.
 */
export function estimateFiatAmount(musdAmount: number, railType: string): { fiatAmount: number; rate: number; currency: string } {
    const rates: Record<string, { rate: number; currency: string }> = {
        'MPESA': { rate: 130, currency: 'KES' },
        'GCASH': { rate: 56, currency: 'PHP' },
        'MTNMOMO': { rate: 13, currency: 'GHS' },
    };

    const rail = railType.toUpperCase();
    const config = rates[rail] || { rate: 1, currency: 'USD' };
    
    return {
        fiatAmount: musdAmount * config.rate,
        rate: config.rate,
        currency: config.currency,
    };
}

/**
 * Builds the summary text shown during the SEND conversation confirmation step.
 */
export function buildSendSummary(recipient: string, amountMUSD: number, railType: string): string {
    const feeMUSD = amountMUSD * 0.01;
    const totalDeducted = amountMUSD + feeMUSD;
    const { fiatAmount, currency } = estimateFiatAmount(amountMUSD, railType);

    return `*Transfer Summary*\n\n` +
           `👤 *Recipient:* ${recipient}\n` +
           `🚊 *Rail:* ${railType.toUpperCase()}\n` +
           `💸 *Amount:* ${amountMUSD.toFixed(2)} MUSD\n` +
           `🏦 *Fee:* ${feeMUSD.toFixed(2)} MUSD\n` +
           `📉 *Total Deducted:* ${totalDeducted.toFixed(2)} MUSD\n` +
           `\n*Recipient gets:* ~${fiatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${currency}`;
}
