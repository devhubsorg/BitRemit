import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env.local" });

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3003;
const CALLBACK_URL = (
  process.env.CALLBACK_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000"
).replace(/\/api\/offramp\/callback$/, "");

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "mtnmomo-mock",
    timestamp: new Date().toISOString(),
  });
});

app.post("/v1_0/transfer", (req: Request, res: Response) => {
  const body = req.body;
  const { amount, currency, externalId, payee } = body;

  console.log(
    `[MTN Mock] Received transfer request: ${amount} ${currency} to ${payee?.partyId}`,
  );

  const financialTransactionId =
    "MTN-" + Math.random().toString(36).slice(2, 10).toUpperCase();

  res.status(202).json({
    status: "PENDING",
    financialTransactionId,
  });

  const delay = 4000 + Math.random() * 3000;

  setTimeout(async () => {
    const isFailure = Math.random() < 0.05;

    const payload = isFailure
      ? {
          status: "FAILED",
          reason: "PAYER_LIMIT_REACHED",
          financialTransactionId,
          externalId,
          amount,
          currency,
          payee,
        }
      : {
          status: "SUCCESSFUL",
          financialTransactionId,
          externalId,
          amount,
          currency,
          payee,
          payerMessage: "BitRemit transfer",
        };

    console.log(
      `[MTN Mock] Sending async callback for ${externalId} (Outcome: ${payload.status})`,
    );

    try {
      const callbackRes = await fetch(`${CALLBACK_URL}/api/offramp/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(
        `[MTN Mock] Callback delivered. Status: ${callbackRes.status}`,
      );
    } catch (error) {
      console.error(`[MTN Mock] Failed to deliver callback:`, error);
    }
  }, delay);
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`[MTN Mock] Service is live at http://0.0.0.0:${PORT}`);
  console.log(
    `[MTN Mock] Payout callbacks targeting: ${CALLBACK_URL}/api/offramp/callback`,
  );
});
