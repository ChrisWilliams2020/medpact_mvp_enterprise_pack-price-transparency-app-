import * as React from "react";
import clsx from "clsx";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("mx-auto w-full max-w-6xl px-6", className)} {...props} />;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles =
    variant === "primary"
  ? "bg-gradient-to-br from-medpact-green to-medpact-blue text-white hover:opacity-95 focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(var(--medpact-blue)/0.2)]"
    : variant === "secondary"
  ? "bg-white text-medpact-blue ring-1 ring-[rgba(var(--medpact-blue)/0.12)] hover:ring-[rgba(var(--medpact-blue)/0.2)] focus:ring-[rgba(var(--medpact-blue)/0.12)]"
    : "bg-transparent text-medpact-black hover:bg-black/5 focus:ring-medpact-black";
  return <button className={clsx(base, styles, className)} {...props} />;
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
  <span className="inline-flex items-center rounded-full bg-[rgb(var(--platinum-100)/0.6)] px-3 py-1 text-xs font-medium text-[rgb(var(--platinum-700))]">
      {children}
    </span>
  );
}
