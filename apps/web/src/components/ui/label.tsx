import type { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ style, ...props }: LabelProps) {
  return <label {...props} style={{ display: "block", ...style }} />;
}
