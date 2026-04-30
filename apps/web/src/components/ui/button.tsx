import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "default" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "default", style, ...props }: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.6 : 1,
  };

  const variantStyle: React.CSSProperties =
    variant === "outline"
      ? {
          border: "1px solid #3a3a3a",
          background: "transparent",
          color: "#e5e7eb",
        }
      : {
          border: "none",
          background: "#F7931A",
          color: "#111827",
        };

  return (
    <button {...props} style={{ ...baseStyle, ...variantStyle, ...style }} />
  );
}
