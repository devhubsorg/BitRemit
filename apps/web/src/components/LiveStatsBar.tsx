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

  const items: StatItem[] = [
    {
      label: "Total Sent",
      value: stats ? formatUSD(stats.totalSentUSD) : "$0",
    },
    {
      label: "Total Transfers",
      value: stats ? stats.totalTransactions.toLocaleString() : "0",
    },
    {
      label: "Average Fee",
      value: stats ? `${stats.averageFeePercent}%` : "1%",
    },
  ];

  return (
    <section
      className="border-y border-white/6 bg-white/2"
      aria-label="Live protocol statistics"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 divide-y divide-white/6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center py-6 sm:py-0"
            >
              <span
                className="text-3xl font-extrabold tabular-nums tracking-tight"
                style={{ color: "#F7931A" }}
              >
                {item.value}
              </span>
              <span className="mt-1 text-sm font-medium text-zinc-500">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
