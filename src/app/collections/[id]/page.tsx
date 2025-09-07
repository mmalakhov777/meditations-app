import { getCollection, getMeditationsByCollection } from "@/lib/data";
import { notFound } from "next/navigation";
import { MeditationCard } from "@/components/Cards";

export default function CollectionDetail({ params }: { params: { id: string } }) {
  const collection = getCollection(params.id);
  if (!collection) return notFound();
  const list = getMeditationsByCollection(collection.id);
  return (
    <div className="container" style={{ display: "grid", gap: 12 }}>
      <div className="card" style={{ padding: 16 }}>
        <strong>{collection.title}</strong>
        <div className="muted" style={{ fontSize: 12 }}>{collection.description}</div>
      </div>
      {list.map((m) => (
        <MeditationCard key={m.id} id={m.id} title={m.title} durationSec={m.durationSec} />
      ))}
    </div>
  );
}


