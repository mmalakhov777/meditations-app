"use client";

import { useMemo, useState } from "react";
import { meditations } from "@/lib/data";
import { MeditationCard } from "@/components/Cards";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const list = useMemo(
    () => meditations.filter(m => m.title.toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  return (
    <div className="container" style={{ display: "grid", gap: 12 }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search meditations"
        className="card"
        style={{ padding: 12, border: "1px solid rgba(212,175,55,0.3)" }}
      />
      {list.map(m => (
        <MeditationCard key={m.id} id={m.id} title={m.title} durationSec={m.durationSec} />
      ))}
    </div>
  );
}


