"use client";

import { useEffect, useMemo, useState } from "react";

type Item = {
  id: string; day: string; title: string; text: string; about: string; audio: string; cover: string; type: "morning" | "evening" | "other";
};

export default function AdminPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);

  const load = async () => {
    const res = await fetch(`/api/admin/meditations?year=${year}&month=${month}`);
    const json = await res.json();
    if (json.ok) setItems(json.doc.items);
  };

  useEffect(() => { load(); }, [year, month]);

  const empty: Item = useMemo(() => ({ id: "", day: `${year}-${String(month).padStart(2,"0")}-01`, title: "", text: "", about: "", audio: "", cover: "", type: "morning" }), [year, month]);

  const save = async () => {
    if (!editing) return;
    const res = await fetch(`/api/admin/meditations`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(editing) });
    const json = await res.json();
    if (json.ok) { setItems(json.doc.items); setEditing(null); }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/meditations?id=${encodeURIComponent(id)}&year=${year}&month=${month}`, { method: "DELETE" });
    const json = await res.json();
    if (json.ok) setItems(json.doc.items);
  };

  return (
    <div className="container stack-16">
      <div className="card" style={{ padding: 16 }}>
        <strong>Admin: Meditations</strong>
        <div className="row" style={{ marginTop: 8 }}>
          <input value={year} onChange={e => setYear(Number(e.target.value))} className="card" style={{ padding: 8, width: 120 }} />
          <input value={month} onChange={e => setMonth(Number(e.target.value))} className="card" style={{ padding: 8, width: 80 }} />
          <button className="button-secondary" onClick={load}>Reload</button>
          <button className="button" onClick={() => setEditing(empty)}>New</button>
        </div>
      </div>

      <div className="stack-12">
        {items.map(it => (
          <div key={it.id} className="card" style={{ padding: 12 }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div className="row">
                {it.cover ? (
                  <img src={it.cover} alt="Cover" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                ) : null}
                <div>
                  <strong>{it.title || it.id}</strong>
                  <div className="muted small">{it.day} • {it.type}</div>
                </div>
              </div>
              <div className="row">
                {it.audio ? <audio src={it.audio} controls preload="none" style={{ height: 28 }} /> : null}
                <button className="button-secondary" onClick={() => setEditing(it)}>Edit</button>
                <button className="button-ghost" onClick={() => remove(it.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="card stack-12" style={{ padding: 16 }}>
          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            <input placeholder="id" value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} className="card" style={{ padding: 8, flex: "1 1 200px" }} />
            <input placeholder="day YYYY-MM-DD" value={editing.day} onChange={e => setEditing({ ...editing, day: e.target.value })} className="card" style={{ padding: 8, flex: "1 1 200px" }} />
            <select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value as Item["type"] })} className="card" style={{ padding: 8 }}>
              <option value="morning">morning</option>
              <option value="evening">evening</option>
              <option value="other">other</option>
            </select>
          </div>
          <input placeholder="title" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="card" style={{ padding: 8 }} />
          <textarea placeholder="text" value={editing.text} onChange={e => setEditing({ ...editing, text: e.target.value })} className="card" style={{ padding: 8, minHeight: 80 }} />
          <textarea placeholder="about" value={editing.about} onChange={e => setEditing({ ...editing, about: e.target.value })} className="card" style={{ padding: 8, minHeight: 80 }} />
          <input placeholder="audio path e.g. /meditations/audio/file.mp3" value={editing.audio} onChange={e => setEditing({ ...editing, audio: e.target.value })} className="card" style={{ padding: 8 }} />
          <input placeholder="cover path e.g. /meditations/covers/file.webp" value={editing.cover} onChange={e => setEditing({ ...editing, cover: e.target.value })} className="card" style={{ padding: 8 }} />
          <div className="row" style={{ gap: 12 }}>
            {editing.cover ? (
              <img src={editing.cover} alt="Cover preview" style={{ width: 96, height: 96, borderRadius: 12, objectFit: "cover" }} />
            ) : null}
            {editing.audio ? (
              <audio src={editing.audio} controls preload="none" style={{ maxWidth: 280 }} />
            ) : null}
          </div>
          <div className="row">
            <button className="button-secondary" onClick={() => setEditing(null)}>Cancel</button>
            <button className="button" onClick={save}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}


