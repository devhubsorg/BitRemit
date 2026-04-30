import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ style, ...props }: InputProps) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        borderRadius: "8px",
        padding: "10px 12px",
        border: "1px solid #3a3a3a",
        background: "#1a1a1a",
        color: "#fff",
        fontSize: "14px",
        outline: "none",
        ...style,
      }}
    />
  );
}
