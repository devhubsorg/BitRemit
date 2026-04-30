import React from "react";

type Step = {
  number: string;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: "1",
    title: "Lock BTC",
    description:
      "Deposit your Bitcoin as collateral in the BitRemit vault on Mezo. Your BTC stays yours — you're just borrowing against it.",
  },
  {
    number: "2",
    title: "Borrow MUSD",
    description:
      "Borrow Mezo's stablecoin at a fixed 1% rate. Keep your Bitcoin. No selling, no tax events, no waiting.",
  },
  {
    number: "3",
    title: "Send",
    description:
      "Choose a recipient by phone number. They receive cash in seconds via M-Pesa, GCash, or MTN MoMo. They never see crypto.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-[5%] py-24"
      style={{ background: "#0D1117" }}
    >
      <div className="mx-auto max-w-300">
        {/* Section label */}
        <div
          className="mb-4 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.12em]"
          style={{ color: "#F7931A" }}
        >
          <span className="block h-px w-6" style={{ background: "#F7931A" }} />
          The Process
        </div>

        <h2
          className="mb-16 leading-tight tracking-tight text-white"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(32px, 4vw, 48px)",
            letterSpacing: "-0.02em",
          }}
        >
          Three steps.
          <br />
          Under 60 seconds.
        </h2>

        {/* Steps row */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-0">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-1 flex-col lg:pr-10">
                {/* Number circle */}
                <div
                  className="mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 text-[22px] font-extrabold"
                  style={{
                    background: "rgba(247,147,26,0.12)",
                    borderColor: "#F7931A",
                    color: "#F7931A",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {step.number}
                </div>
                <h3
                  className="mb-2.5 text-[22px] font-bold tracking-tight text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[15px] leading-relaxed"
                  style={{ color: "#8B949E" }}
                >
                  {step.description}
                </p>
              </div>

              {/* Arrow connector (desktop only, not after last step) */}
              {idx < STEPS.length - 1 && (
                <div
                  className="hidden w-15 shrink-0 items-start pt-7 lg:flex"
                  aria-hidden="true"
                >
                  <div
                    className="relative w-full"
                    style={{
                      height: "2px",
                      background:
                        "linear-gradient(90deg, #F7931A, rgba(247,147,26,0.3))",
                    }}
                  >
                    <span
                      className="absolute -right-1 top-1/2 -translate-y-1/2 text-sm leading-none"
                      style={{ color: "rgba(247,147,26,0.5)" }}
                    >
                      ▶
                    </span>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
