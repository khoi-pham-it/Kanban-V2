import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

const variantClass: Record<Variant, string> = {
  primary: "bg-primary text-white hover:opacity-90",
  secondary:
    "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300",
  danger:
    "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({ variant = "secondary", className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${variantClass[variant]} ${className}`}
    />
  );
}

