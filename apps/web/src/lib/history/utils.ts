import type { TransactionRow } from "@/types/history";

export function exportToCSV(transactions: TransactionRow[]): void {
  const headers = [
    "Date",
    "Recipient",
    "Phone",
    "Rail",
    "MUSD Amount",
    "Fiat Amount",
    "Currency",
    "Status",
    "Reference",
  ];

  const rows = transactions.map((t) => [
    t.createdAt,
    t.recipient.name,
    t.recipient.phoneNumber,
    t.railType,
    t.musdAmount,
    t.fiatAmount,
    t.fiatCurrency,
    t.status,
    t.railReference ?? "",
  ]);

  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bitremit-transactions.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildQueryString(
  params: Record<string, string | number>,
): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== "" && v !== "ALL") qs.set(k, String(v));
  });
  return qs.toString() ? `?${qs.toString()}` : "";
}
