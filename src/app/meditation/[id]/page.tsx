import { getMeditation } from "@/lib/data";
import { notFound } from "next/navigation";
import { ClassicalAudioPlayer } from "@/components/ClassicalAudioPlayer";
import { HideBottomNav } from "@/components/HideBottomNav";
import TelegramBackButton from "@/components/TelegramBackButton";

export default function MeditationPage({ params }: { params: { id: string } }) {
  const m = getMeditation(params.id);
  if (!m) return notFound();
  
  // Random cover selection from saints folder
  const saintCovers = [
    "Untitled Design.webp",
    "Untitled Design (1).webp",
    "Untitled Design (2).webp", 
    "Untitled Design (3).webp",
    "Untitled Design (4).webp",
    "Untitled Design (5).webp",
    "Untitled Design (6).webp",
    "Untitled Design (7).webp",
    "Untitled Design (8).webp",
    "Untitled Design (9).webp",
    "Untitled Design (10).webp",
    "Untitled Design (11).webp",
    "Untitled Design (12).webp",
    "Untitled Design (13).webp"
  ];
  const randomCover = saintCovers[Math.floor(Math.random() * saintCovers.length)];
  
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column" }}>
      <HideBottomNav />
      <TelegramBackButton />
      
      {/* Cover image section - takes remaining space */}
      <div style={{
        flex: 1,
        overflow: "hidden"
      }}>
        <img 
          src={`/covers/saitns/${randomCover}`} 
          alt="Cover" 
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.9) contrast(1.1)"
          }}
        />
      </div>

      {/* Classical audio player controls at bottom */}
      <ClassicalAudioPlayer 
        id={m.id} 
        src="/meditations/audio/1-sept-meditation.mp3" 
        title={m.title}
        artist="Meditation"
      />
    </div>
  );
}


