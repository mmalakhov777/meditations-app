export type Meditation = {
  id: string;
  title: string;
  durationSec: number;
  videoUrl: string;
  collectionId: string;
};

export type Collection = {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
};

export const collections: Collection[] = [
  { id: "focus", title: "Focus", description: "Sharpen attention in minutes" },
  { id: "sleep", title: "Sleep", description: "Ease into restful sleep" },
  { id: "calm", title: "Calm", description: "Reduce stress, find balance" }
];

export const meditations: Meditation[] = [
  { id: "f1", title: "3‑min Breath", durationSec: 180, videoUrl: "https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm", collectionId: "focus" },
  { id: "f2", title: "Body Scan", durationSec: 300, videoUrl: "https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm", collectionId: "focus" },
  { id: "s1", title: "Wind Down", durationSec: 240, videoUrl: "https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm", collectionId: "sleep" },
  { id: "c1", title: "Calm Reset", durationSec: 180, videoUrl: "https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm", collectionId: "calm" }
];

export function getCollection(id: string) {
  return collections.find(c => c.id === id) || null;
}

export function getMeditation(id: string) {
  return meditations.find(m => m.id === id) || null;
}

export function getMeditationsByCollection(collectionId: string) {
  return meditations.filter(m => m.collectionId === collectionId);
}


