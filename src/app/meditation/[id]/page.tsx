import { getMeditation } from "@/lib/data";
import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import Link from "next/link";
import { HideBottomNav } from "@/components/HideBottomNav";
import TelegramBackButton from "@/components/TelegramBackButton";

export default function MeditationPage({ params }: { params: { id: string } }) {
  const m = getMeditation(params.id);
  if (!m) return notFound();
  return (
    <div className="container" style={{ padding: 0 }}>
      <HideBottomNav />
      <TelegramBackButton />
      <div className="overlay" style={{ position: "relative", minHeight: "100dvh" }}>
        <img src="/covers/1-sept-light-cover.webp" alt="Cover" className="cover-full" />
        {/* Using native Telegram BackButton; no on-screen back link needed */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 16 }}>
          <div className="container" style={{ padding: 0 }}>
            <div className="card" style={{ padding: 12, background: "transparent", border: "none", boxShadow: "none" }}>
              <AudioPlayer id={m.id} src="/meditations/audio/1-sept-meditation.mp3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


