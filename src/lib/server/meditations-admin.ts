import { promises as fs } from "fs";
import path from "path";

export type MeditationType = "morning" | "evening" | "other";

export type MeditationItem = {
  id: string;
  day: string; // YYYY-MM-DD
  title: string;
  text: string;
  about: string;
  audio: string;
  cover: string;
  type: MeditationType;
};

export type MeditationsDoc = { items: MeditationItem[] };

function getMonthKeyFromDay(day: string): { year: number; month: number } {
  const [yyyy, mm] = day.split("-");
  return { year: Number(yyyy), month: Number(mm) };
}

function getFilePath(year: number, month: number): string {
  const mm = String(month).padStart(2, "0");
  return path.join(process.cwd(), "public", "meditations", `${year}-${mm}.json`);
}

export async function readMonth(year: number, month: number): Promise<MeditationsDoc> {
  const file = getFilePath(year, month);
  try {
    const buf = await fs.readFile(file, "utf8");
    return JSON.parse(buf) as MeditationsDoc;
  } catch {
    return { items: [] };
  }
}

export async function writeMonth(year: number, month: number, doc: MeditationsDoc): Promise<void> {
  const file = getFilePath(year, month);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(doc, null, 2), "utf8");
}

export async function upsertItem(item: MeditationItem): Promise<MeditationsDoc> {
  const { year, month } = getMonthKeyFromDay(item.day);
  const doc = await readMonth(year, month);
  const existsIndex = doc.items.findIndex((x) => x.id === item.id);
  if (existsIndex >= 0) doc.items[existsIndex] = item;
  else doc.items.push(item);
  await writeMonth(year, month, doc);
  return doc;
}

export async function deleteItem(id: string, year: number, month: number): Promise<MeditationsDoc> {
  const doc = await readMonth(year, month);
  const filtered = doc.items.filter((x) => x.id !== id);
  const updated: MeditationsDoc = { items: filtered };
  await writeMonth(year, month, updated);
  return updated;
}


