"use client";
import { useParams } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import Image from "next/image";

export default function SaintPage() {
  const params = useParams();
  const { theme } = useTheme();
  const saintId = params.id as string;

  // Mock saint data - replace with real data from API
  const saintData = {
    id: saintId,
    name: "Saint of the Day",
    image: "/covers/saitns/Untitled Design.png",
    feastDay: "January 1st",
    patronOf: "Meditation and Peace",
    description: `Saint of the Day is a revered figure in the Christian tradition, known for their profound spiritual wisdom and dedication to contemplative practices. Born in the early centuries of Christianity, this saint dedicated their life to seeking union with the divine through prayer, meditation, and acts of compassion.

Their journey began in a small village where they experienced a profound spiritual awakening at a young age. This moment of divine revelation set them on a path of deep spiritual exploration, leading them to establish one of the first Christian meditation communities in the region.

The saint's teachings emphasized the importance of inner silence and the cultivation of a peaceful heart. They believed that true spiritual growth comes not through external achievements, but through the quiet transformation of the soul. Their writings, though few in number, have influenced countless seekers throughout the centuries.

One of their most famous teachings was the "Prayer of the Heart," a method of contemplative prayer that involves repeating a sacred phrase while focusing on the heart center. This practice, they taught, helps to quiet the mind and open the heart to divine love.

The saint was also known for their remarkable ability to bring peace to troubled situations. Many stories tell of how they would sit in silent prayer with those who were suffering, and through their presence alone, bring comfort and healing. They believed that true peace comes from within and radiates outward to touch all those around us.

Their legacy continues to inspire modern practitioners of meditation and contemplative prayer. The saint's emphasis on inner transformation and peaceful living remains as relevant today as it was in their time. Their life serves as a reminder that the path to spiritual fulfillment lies not in external achievements, but in the quiet cultivation of love, compassion, and inner peace.

The saint's feast day is celebrated annually, and their teachings continue to guide those seeking a deeper connection with the divine through meditation and contemplative practices.`,
    quotes: [
      "The heart that is still knows the voice of God.",
      "In silence, we find the answers that words cannot provide.",
      "True peace begins within and flows outward to heal the world.",
      "The soul that seeks God finds God in every moment."
    ]
  };

  return (
    <div className="container stack-16" style={{ paddingTop: "calc(env(safe-area-inset-top))" }}>
      {/* Saint header with image - taller with back button overlay */}
      <div style={{ position: "relative", width: "100vw", marginLeft: "calc(50% - 50vw)", marginBottom: 16 }}>
        <div style={{ width: "100%", aspectRatio: "4 / 5", position: "relative" }}>
          <Image
            src={saintData.image}
            alt={saintData.name}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          {/* Top overlay: back button */}
          <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top) + 16px)", left: 16 }}>
            <Link href="/" className="button-secondary" style={{ textDecoration: "none", background: "rgba(255,255,255,0.9)", color: "#1a1a1a" }}>
              ← Back
            </Link>
          </div>
          {/* Bottom overlay: saint info */}
          <div style={{ 
            position: "absolute", 
            bottom: 0, 
            left: 0, 
            right: 0, 
            background: "linear-gradient(transparent, rgba(0,0,0,0.8))", 
            padding: "60px 20px 20px",
            color: "white"
          }}>
            <h1 className="h1" style={{ color: "white", margin: 0 }}>{saintData.name}</h1>
            <div className="muted" style={{ color: "rgba(255,255,255,0.8)" }}>{saintData.feastDay}</div>
            <div className="small" style={{ color: "rgba(255,255,255,0.9)" }}>Patron of {saintData.patronOf}</div>
          </div>
        </div>
      </div>

      {/* Saint description */}
      <div className="card" style={{ padding: 24 }}>
        <div className="stack-16">
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>About {saintData.name}</h2>
          <div style={{ lineHeight: 1.6, fontSize: "16px" }}>
            {saintData.description.split('\n\n').map((paragraph, index) => (
              <p key={index} style={{ margin: "0 0 16px 0" }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Quotes section */}
      <div className="card" style={{ padding: 24 }}>
        <div className="stack-16">
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Famous Quotes</h3>
          <div className="stack-12">
            {saintData.quotes.map((quote, index) => (
              <div key={index} style={{ 
                padding: "16px", 
                background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                borderRadius: "8px",
                borderLeft: "4px solid var(--color-accent)",
                fontStyle: "italic",
                lineHeight: 1.5
              }}>
                &ldquo;{quote}&rdquo;
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meditation practice section */}
      <div className="card" style={{ padding: 24 }}>
        <div className="stack-16">
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Meditation Practice</h3>
          <div style={{ lineHeight: 1.6 }}>
            <p>Inspired by {saintData.name}&apos;s teachings, try this simple meditation practice:</p>
            <ol style={{ paddingLeft: "20px", lineHeight: 1.8 }}>
              <li>Find a quiet place and sit comfortably</li>
              <li>Close your eyes and take three deep breaths</li>
              <li>Repeat silently: &ldquo;Peace begins within&rdquo;</li>
              <li>Focus on your heart center and feel the warmth of divine love</li>
              <li>When ready, slowly open your eyes and carry this peace with you</li>
            </ol>
          </div>
          <div className="meditation-buttons">
            <Link href="/meditation/f1" className="button" style={{ textDecoration: "none" }}>
              Start Morning Meditation
            </Link>
            <Link href="/meditation/s1" className="button-secondary evening-meditation" style={{ textDecoration: "none" }}>
              Start Evening Meditation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
