type Rail = {
  name: string;
  countries: string;
  description: string;
  icon: string;
  topColor: string;
  iconBg: string;
  countriesBg: string;
  countriesColor: string;
};

const RAILS: Rail[] = [
  {
    name: "M-Pesa",
    countries: "Kenya · Tanzania · Uganda",
    description:
      "Instant delivery to 32M M-Pesa users across East Africa. Recipients get an SMS the moment funds land.",
    icon: "📱",
    topColor: "#22C55E",
    iconBg: "rgba(34,197,94,0.12)",
    countriesBg: "rgba(34,197,94,0.12)",
    countriesColor: "#22C55E",
  },
  {
    name: "GCash",
    countries: "Philippines",
    description:
      "Send to 94M GCash accounts. The Philippines\u2019 leading mobile wallet \u2014 no bank account required.",
    icon: "💳",
    topColor: "#3B82F6",
    iconBg: "rgba(59,130,246,0.12)",
    countriesBg: "rgba(59,130,246,0.12)",
    countriesColor: "#3B82F6",
  },
  {
    name: "MTN MoMo",
    countries: "20+ African countries",
    description:
      "70M MTN MoMo users across Africa. From Ghana to C\u00f4te d\u2019Ivoire to Cameroon.",
    icon: "🌍",
    topColor: "#A855F7",
    iconBg: "rgba(168,85,247,0.12)",
    countriesBg: "rgba(168,85,247,0.12)",
    countriesColor: "#A855F7",
  },
];

export function PaymentRailCards() {
  return (
    <section
      id="rails"
      className="px-[5%] py-24"
      style={{ background: "#161B22" }}
    >
      <div className="mx-auto max-w-300">
        {/* Section label */}
        <div
          className="mb-4 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.12em]"
          style={{ color: "#F7931A" }}
        >
          <span className="block h-px w-6" style={{ background: "#F7931A" }} />
          Payment Rails
        </div>

        <h2
          className="mb-4 leading-tight tracking-tight text-white"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(32px, 4vw, 48px)",
            letterSpacing: "-0.02em",
          }}
        >
          Send money via
          <br />
          the rails your family already uses.
        </h2>
        <p
          className="mb-14 max-w-120 text-[17px] font-light"
          style={{ color: "#8B949E" }}
        >
          No new accounts. No crypto wallets. Money arrives in local currency,
          instantly.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RAILS.map((rail) => (
            <div
              key={rail.name}
              className="relative overflow-hidden rounded-xl border p-8 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
              style={{
                background: "#0D1117",
                borderColor: "#30363D",
                borderTop: `3px solid ${rail.topColor}`,
              }}
            >
              {/* Icon */}
              <div
                className="mb-5 flex h-13 w-13 items-center justify-center rounded-xl text-2xl"
                style={{ background: rail.iconBg }}
              >
                {rail.icon}
              </div>

              <h3
                className="mb-1 text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {rail.name}
              </h3>

              <span
                className="mb-4 inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium"
                style={{
                  background: rail.countriesBg,
                  color: rail.countriesColor,
                }}
              >
                {rail.countries}
              </span>

              <p
                className="text-sm leading-relaxed"
                style={{ color: "#8B949E" }}
              >
                {rail.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
