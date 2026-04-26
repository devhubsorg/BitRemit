type Rail = {
  name: string;
  countries: string;
  description: string;
  icon: string;
  color: string;
};

const RAILS: Rail[] = [
  {
    name: "M-Pesa",
    countries: "Kenya · Tanzania · Uganda",
    description:
      "Africa's largest mobile money network. Recipients receive KES, TZS, or UGX directly to their M-Pesa wallet — no bank account needed.",
    icon: "📱",
    color: "#00A650",
  },
  {
    name: "GCash",
    countries: "Philippines",
    description:
      "The Philippines' leading e-wallet. Funds arrive instantly in PHP to any GCash number, covering over 94 million registered users.",
    icon: "💙",
    color: "#0070E0",
  },
  {
    name: "MTN MoMo",
    countries: "20+ African countries",
    description:
      "MTN Mobile Money spans West, East, and Central Africa. Your recipient gets local currency on their phone within minutes.",
    icon: "💛",
    color: "#FFCB00",
  },
];

export function PaymentRailCards() {
  return (
    <section
      id="rails"
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mb-14 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Money moves where your family is
        </h2>
        <p className="mt-4 text-base text-zinc-400">
          We send directly to the apps they already use — no crypto wallet, no
          bank account.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {RAILS.map((rail) => (
          <div
            key={rail.name}
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/6"
          >
            {/* Top glow on hover */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `linear-gradient(90deg, transparent, ${rail.color}80, transparent)`,
              }}
            />

            {/* Icon + color dot */}
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
                style={{ backgroundColor: `${rail.color}18` }}
              >
                {rail.icon}
              </span>
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: rail.color }}
              />
            </div>

            <h3 className="text-lg font-bold text-white">{rail.name}</h3>
            <p
              className="mt-1 text-xs font-medium"
              style={{ color: rail.color }}
            >
              {rail.countries}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {rail.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
