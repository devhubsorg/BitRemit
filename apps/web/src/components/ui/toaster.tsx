"use client";

import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 360,
        width: "calc(100vw - 32px)",
        pointerEvents: "none",
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toastItem) => {
        const destructive = toastItem.variant === "destructive";
        return (
          <div
            key={toastItem.id}
            style={{
              pointerEvents: "auto",
              background: destructive ? "#3a1515" : "#1f232b",
              border: destructive
                ? "1px solid rgba(239,68,68,0.5)"
                : "1px solid #30363d",
              borderRadius: 10,
              padding: "12px 14px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              color: "#f0f6fc",
            }}
            role="status"
          >
            <div
              style={{
                display: "flex",
                alignItems: "start",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: destructive ? "#fca5a5" : "#f0f6fc",
                  }}
                >
                  {toastItem.title}
                </p>
                {toastItem.description ? (
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 13,
                      color: destructive ? "#fecaca" : "#9ca3af",
                    }}
                  >
                    {toastItem.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toastItem.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: 1,
                }}
                aria-label="Dismiss notification"
              >
                x
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
