import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";

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

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CALLBACK_URL = process.env.CALLBACK_URL ?? "";
const CALLBACK_SECRET = process.env.CALLBACK_SECRET ?? "";

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ---------------------------------------------------------------------------
// POST /v1/payments
// ---------------------------------------------------------------------------

interface PaymentBody {
  amount: number;
  mobileNumber: string;
  referenceId: string;
}

app.post(
  "/v1/payments",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { amount, mobileNumber, referenceId } =
        req.body as Partial<PaymentBody>;

      // --- Validation ---
      if (
        amount === undefined ||
        amount === null ||
        typeof mobileNumber !== "string" ||
        !mobileNumber.trim() ||
        typeof referenceId !== "string" ||
        !referenceId.trim()
      ) {
        res.status(400).json({
          code: "INVALID_REQUEST",
          message:
            "Missing or invalid fields: amount (number), mobileNumber (string), referenceId (string) are required.",
        });
        return;
      }

      if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
        res.status(400).json({
          code: "INVALID_AMOUNT",
          message: "amount must be a positive number.",
        });
        return;
      }

      const paymentId = `GC-${randomId()}`;

      // --- Respond immediately with PENDING ---
      res.status(202).json({
        status: "PENDING",
        paymentId,
        referenceId,
        timestamp: new Date().toISOString(),
      });

      // --- Fire-and-forget: deliver callback after 3 s ---
      (async () => {
        await delay(3000);

        const failed = Math.random() < 0.05;

        const payload = failed
          ? {
              rail: "gcash",
              status: "FAILED",
              paymentId,
              referenceId,
              errorCode: "INSUFFICIENT_BALANCE",
            }
          : {
              rail: "gcash",
              status: "SUCCESS",
              paymentId,
              referenceId,
              amount,
              mobileNumber,
            };

        if (!CALLBACK_URL) {
          console.warn(
            "[GCash Mock] CALLBACK_URL not set — skipping callback.",
          );
          return;
        }

        try {
          const callbackRes = await fetch(
            `${CALLBACK_URL}/api/offramp/callback`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(CALLBACK_SECRET
                  ? { "X-Callback-Secret": CALLBACK_SECRET }
                  : {}),
              },
              body: JSON.stringify(payload),
            },
          );
          console.log(
            `[GCash Mock] Callback delivered — paymentId: ${paymentId} | status: ${payload.status} | HTTP: ${callbackRes.status}`,
          );
        } catch (err) {
          console.error("[GCash Mock] Callback delivery failed:", err);
        }
      })().catch((err) =>
        console.error("[GCash Mock] Async callback error:", err),
      );
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
    service: "gcash-mock",
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[UNHANDLED ERROR]", err);
  res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred.",
  });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const PORT = process.env.PORT ?? "3002";

app.listen(Number(PORT), () => {
  console.log(`GCash mock server running on port ${PORT}`);
  console.log(
    `Callbacks: ${
      CALLBACK_URL
        ? `${CALLBACK_URL}/api/offramp/callback`
        : "DISABLED — set CALLBACK_URL"
    }`,
  );
  console.log(
    `Callback secret: ${
      CALLBACK_SECRET
        ? "configured"
        : "not set (X-Callback-Secret header will be omitted)"
    }`,
  );
});

export default app;
