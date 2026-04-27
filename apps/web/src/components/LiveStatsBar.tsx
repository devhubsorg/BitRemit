type StatsPayload = {
  totalSentUSD: string;
  totalTransactions: number;
  averageFeePercent: string;
  activeSenders: number;
};

function getApiBaseUrl(): string {
  const internal = process.env.INTERNAL_API_BASE_URL?.trim();
  if (internal) return internal.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://127.0.0.1:3000";
}

async function getStats(): Promise<StatsPayload | null> {
  const baseUrl = getApiBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/stats`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!res.ok) return null;
    return res.json() as Promise<StatsPayload>;
  } catch {
    return null;
  }
}

function formatUSD(raw: string): string {
  const n = parseFloat(raw);
  if (isNaN(n)) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

type StatItem = {
  label: string;
  value: string;
};

export async function LiveStatsBar() {
  const stats = await getStats();

  const items: (StatItem | null)[] = [
    {
      label: "Total Sent",
      value: stats ? formatUSD(stats.totalSentUSD) : "$0",
    },
    null, // divider
    {
      label: "Total Transfers",
      value: stats ? stats.totalTransactions.toLocaleString() : "0",
    },
    null, // divider
    {
      label: "Average Fee",
      value: stats ? `${stats.averageFeePercent}%` : "1%",
    },
  ];

  return (
    <section
      id="stats"
      className="border-y px-[5%] py-16"
      style={{
        background: "#161B22",
        borderColor: "#30363D",
      }}
      aria-label="Live protocol statistics"
    >
      <div
        className="mx-auto grid max-w-225 items-center"
        style={{
          gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
        }}
      >
        {items.map((item, idx) =>
          item === null ? (
            <div
              key={`div-${idx}`}
              style={{
                width: "1px",
                height: "60px",
                background: "#30363D",
                margin: "auto",
              }}
            />
          ) : (
            <div
              key={item.label}
              className="flex flex-col items-center px-10 py-6"
            >
              <span
                className="mb-2 tabular-nums leading-none tracking-tight text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(32px, 5vw, 48px)",
                  letterSpacing: "-0.03em",
                }}
              >
                {item.label === "Average Fee" ? (
                  <span style={{ color: "#22C55E" }}>{item.value}</span>
                ) : (
                  <span style={{ color: "#F7931A" }}>{item.value}</span>
                )}
              </span>
              <span
                className="text-[12px] font-medium uppercase tracking-[0.08em]"
                style={{ color: "#8B949E" }}
              >
                {item.label}
              </span>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
