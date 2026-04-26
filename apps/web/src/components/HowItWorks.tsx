type Step = {
  number: string;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "Lock BTC as collateral",
    description:
      "Connect your Bitcoin wallet and deposit BTC into the BitRemit vault on Mezo Testnet. Your Bitcoin stays yours — it's collateral, not a sale.",
  },
  {
    number: "02",
    title: "Borrow MUSD at 1%",
    description:
      "Instantly borrow MUSD (Mezo USD) against your BTC at a flat 1% fee. No credit checks, no KYC for the sender. Just fast, transparent lending.",
  },
  {
    number: "03",
    title: "Family gets local cash",
    description:
      "Enter the recipient's phone number and choose M-Pesa, GCash, or MTN MoMo. They receive local currency to their mobile wallet in minutes.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mb-14 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          How it works
        </h2>
        <p className="mt-4 text-base text-zinc-400">
          Three steps. No crypto jargon for your recipient. No bank fees.
        </p>
      </div>

      <div className="relative">
        {/* Connector line (desktop only) */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px lg:block"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #F7931A40 20%, #F7931A40 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div className="grid gap-10 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="relative flex flex-col gap-5">
              {/* Number circle */}
              <div className="flex items-center gap-4">
                <div
                  className="relative z-10 flex h-18 w-18 shrink-0 items-center justify-center rounded-full border-2 text-lg font-black text-black"
                  style={{
                    backgroundColor: "#F7931A",
                    borderColor: "#F7931A",
                  }}
                >
                  {step.number}
                </div>
                {/* Arrow connector (mobile/tablet — between items) */}
                <div className="flex-1 lg:hidden" aria-hidden="true" />
              </div>

              {/* Content */}
              <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
