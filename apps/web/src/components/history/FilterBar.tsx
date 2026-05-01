"use client";

import type { HistoryFilters, TxStatus, PaymentRail } from "@/types/history";

interface FilterBarProps {
  filters: HistoryFilters;
  onChange: (partial: Partial<HistoryFilters>) => void;
  onExport: () => void;
  isExporting: boolean;
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        minWidth: "130px",
      }}
    >
      <label
        style={{
          color: "#555",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        style={{
          background: "#242424",
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "9px 12px",
          color: "#fff",
          fontSize: "13px",
          outline: "none",
          cursor: "pointer",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none'%3E%3Cpolyline points='6 9 12 15 18 9' stroke='%23666' stroke-width='2.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
          paddingRight: "30px",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        minWidth: "130px",
      }}
    >
      <label
        style={{
          color: "#555",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "#242424",
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "9px 12px",
          color: value ? "#fff" : "#555",
          fontSize: "13px",
          outline: "none",
          colorScheme: "dark",
        }}
      />
    </div>
  );
}

export function FilterBar({
  filters,
  onChange,
  onExport,
  isExporting,
}: FilterBarProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#111",
        borderBottom: "1px solid #222",
        padding: "16px clamp(16px,4vw,32px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "flex-end",
        }}
      >
        {/* Search */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            flex: "1 1 180px",
            minWidth: "160px",
          }}
        >
          <label
            style={{
              color: "#555",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Search Recipient
          </label>
          <div style={{ position: "relative" }}>
            <svg
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: 0.4,
              }}
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Recipient name…"
              value={filters.searchQuery}
              onChange={(e) =>
                onChange({ searchQuery: e.target.value, page: 1 })
              }
              style={{
                width: "100%",
                background: "#242424",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "9px 12px 9px 32px",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Status */}
        <SelectField<TxStatus | "ALL">
          label="Status"
          value={filters.status}
          onChange={(v) => onChange({ status: v, page: 1 })}
          options={[
            { value: "ALL", label: "All Status" },
            { value: "PENDING", label: "Pending" },
            { value: "OFFRAMP_PROCESSING", label: "Processing" },
            { value: "COMPLETED", label: "Completed" },
            { value: "FAILED", label: "Failed" },
          ]}
        />

        {/* Rail */}
        <SelectField<PaymentRail | "ALL">
          label="Payment Rail"
          value={filters.railType}
          onChange={(v) => onChange({ railType: v, page: 1 })}
          options={[
            { value: "ALL", label: "All Rails" },
            { value: "MPESA", label: "M-Pesa" },
            { value: "GCASH", label: "GCash" },
            { value: "MTNMOMO", label: "MTN MoMo" },
          ]}
        />

        {/* Date from */}
        <DateField
          label="From"
          value={filters.startDate}
          onChange={(v) => onChange({ startDate: v, page: 1 })}
        />

        {/* Date to */}
        <DateField
          label="To"
          value={filters.endDate}
          onChange={(v) => onChange({ endDate: v, page: 1 })}
        />

        {/* Clear + Export */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "flex-end",
            paddingBottom: "0",
          }}
        >
          {(filters.status !== "ALL" ||
            filters.railType !== "ALL" ||
            filters.startDate ||
            filters.endDate ||
            filters.searchQuery) && (
            <button
              onClick={() =>
                onChange({
                  status: "ALL",
                  railType: "ALL",
                  startDate: "",
                  endDate: "",
                  searchQuery: "",
                  page: 1,
                })
              }
              style={{
                background: "transparent",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "9px 14px",
                color: "#888",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Clear
            </button>
          )}
          <button
            onClick={onExport}
            disabled={isExporting}
            style={{
              background: isExporting ? "#2a2a2a" : "#F7931A",
              border: "none",
              borderRadius: "8px",
              padding: "9px 16px",
              color: isExporting ? "#555" : "#000",
              fontSize: "12px",
              fontWeight: 700,
              cursor: isExporting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {isExporting ? "Exporting…" : "Export CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}
