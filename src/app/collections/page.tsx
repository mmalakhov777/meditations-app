import { collections } from "@/lib/data";
import { CollectionCard } from "@/components/Cards";

export default function CollectionsPage() {
  return (
    <div className="container" style={{ display: "grid", gap: 12 }}>
      {collections.map((c) => (
        <CollectionCard key={c.id} id={c.id} title={c.title} description={c.description} />
      ))}
    </div>
  );
}


