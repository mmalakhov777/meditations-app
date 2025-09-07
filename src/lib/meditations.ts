export type MeditationType = "morning" | "evening" | "other";

export type MeditationItem = {
  id: string;
  day: string; // YYYY-MM-DD
  title: string;
  text: string;
  about: string;
  audio: string; // public path
  cover: string; // public path
  type: MeditationType;
};

export type MeditationsDoc = { items: MeditationItem[] };

export async function loadMeditationsDoc(year: number, month: number): Promise<MeditationsDoc | null> {
  const mm = String(month).padStart(2, "0");
  const url = `/meditations/${year}-${mm}.json`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as MeditationsDoc;
  } catch {
    return null;
  }
}

export function pickToday(items: MeditationItem[], date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const day = `${yyyy}-${mm}-${dd}`;
  const morning = items.find(x => x.day === day && x.type === "morning") || null;
  const evening = items.find(x => x.day === day && x.type === "evening") || null;
  return { morning, evening } as const;
}


