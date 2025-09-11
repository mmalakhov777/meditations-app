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
    "Untitled Design.png",
    "Untitled Design (1).png",
    "Untitled Design (2).png", 
    "Untitled Design (3).png",
    "Untitled Design (4).png",
    "Untitled Design (5).png",
    "Untitled Design (6).png",
    "Untitled Design (7).png",
    "Untitled Design (8).png",
    "Untitled Design (9).png",
    "Untitled Design (10).png",
    "Untitled Design (11).png",
    "Untitled Design (12).png",
    "Untitled Design (13).png"
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


