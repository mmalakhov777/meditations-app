"use client";

import { ReactNode, CSSProperties } from "react";

export function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={`card ${className}`} style={style}>{children}</div>;
}

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonProps = { children: ReactNode; onClick?: () => void; className?: string; icon?: ReactNode; style?: CSSProperties; variant?: ButtonVariant; loading?: boolean; disabled?: boolean };

export function Button({ children, onClick, className = "", icon, style, variant = "primary", loading = false, disabled = false }: ButtonProps) {
  const base: CSSProperties = {
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? "none" : "auto",
  };

  const variantClass =
    variant === "secondary"
      ? "button-secondary"
      : variant === "ghost"
      ? "button-ghost"
      : "button";

  return (
    <button className={`${variantClass} ${className}`} onClick={onClick} style={{ ...base, ...style }} disabled={disabled || loading}>
      {loading ? (
        <span className="spinner" aria-hidden style={{ width: 16, height: 16 }} />
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return (
    <h1 style={{
      fontSize: 28,
      lineHeight: 1.1,
      letterSpacing: -0.3,
      margin: "0 0 10px",
      fontWeight: 800,
    }}>{children}</h1>
  );
}

export function Subtle({ children }: { children: ReactNode }) {
  return <p className="muted" style={{ margin: 0 }}>{children}</p>;
}


