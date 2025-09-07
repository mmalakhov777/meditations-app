"use client";

function Day({ d }: { d: number }) {
  return (
    <div className="card" style={{ padding: 12, textAlign: "center" }}>{d}</div>
  );
}

export default function CalendarPage() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div className="container stack-16">
      <div className="stack-12" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
        {days.map(d => <Day key={d} d={d} />)}
      </div>
    </div>
  );
}


