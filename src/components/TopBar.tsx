"use client";

export function TopBar({ title }: { title: string }) {
  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: "var(--color-bg)",
      borderBottom: "1px solid rgba(212,175,55,0.15)",
      padding: "12px 16px",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <strong style={{ fontWeight: 800 }}>{title}</strong>
      </div>
    </div>
  );
}


