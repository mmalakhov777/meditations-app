"use client";

import Link from "next/link";

export function CollectionCard({ id, title, description }: { id: string; title: string; description: string }) {
  return (
    <Link href={`/collections/${id}`} className="card" style={{ padding: 16, display: "grid", gap: 6 }}>
      <strong>{title}</strong>
      <span className="muted" style={{ fontSize: 12 }}>{description}</span>
    </Link>
  );
}

export function MeditationCard({ id, title, durationSec }: { id: string; title: string; durationSec: number }) {
  const min = Math.round(durationSec / 60);
  return (
    <Link href={`/meditation/${id}`} className="card" style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span>{title}</span>
      <span className="muted" style={{ fontSize: 12 }}>{min}m</span>
    </Link>
  );
}


