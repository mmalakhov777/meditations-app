// Static Home Page - Pre-rendered at build time for instant loading
import { t } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import { ClientHomePage } from "@/app/ClientHomePage";

// Enable static generation for this page
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// Deterministic daily saint cover calculation (same logic as before)
function getDailySaintCover() {
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
  const today = new Date();
  const dayKey = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return saintCovers[dayKey % saintCovers.length];
}

// Static page component - renders immediately without hydration delays
export default function Home() {
  const dailySaintCover = getDailySaintCover();
  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>

      {/* Static hero section - no hydration needed */}
      <div className="saint-hero-container">
        <div className="saint-hero-wrapper">
          <Image
            src={`/covers/saitns/${dailySaintCover}`}
            alt="Saint of the day"
            width={720}
            height={960}
            className="saint-hero-image"
            priority
            style={{ objectFit: "cover" }}
          />
          
          {/* Static overlay content with skeleton placeholders */}
          <div className="hero-overlay">
            <div className="stack-8">
              <div className="h1 saint-overlay-text">Saint of the Day</div>
              <div className="muted small saint-overlay-text">{todayDate}</div>
            </div>
            <div className="stack-8" style={{ maxWidth: "55%" }} id="saint-content-container">
              {/* Skeleton loading state - will be replaced by dynamic content */}
              <div className="saint-content-skeleton">
                <div className="skeleton-line" style={{ width: "90%", height: "16px", marginBottom: "8px" }}></div>
                <div className="skeleton-line" style={{ width: "85%", height: "16px", marginBottom: "8px" }}></div>
                <div className="skeleton-line" style={{ width: "70%", height: "16px", marginBottom: "16px" }}></div>
                <div className="skeleton-button" style={{ width: "120px", height: "36px" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static meditation cards */}
      <div className="container stack-16" style={{ paddingTop: 8 }}>
        <div style={{ height: 8 }} />

        <Link href="/meditation/f1" className="card meditation-card card--morning" style={{ display: "block", textDecoration: "none", color: "inherit", position: "relative" }}>
          <div className="meditation-card-container" style={{ display: "grid", gridTemplateColumns: "30% 1fr", columnGap: 20, alignItems: "center" }}>
            <div className="meditation-image-wrapper">
              <Image 
                src={`/covers/saitns/${dailySaintCover}`} 
                alt="Morning Meditation" 
                width={216}
                height={120}
                style={{ objectFit: "cover", width: "100%", height: "100%" }} 
              />
              <div className="gold-play-button play-button-wrapper">
                <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: "block" }} aria-hidden>
                  <polygon points="8,5 19,12 8,19" fill="#1a1a1a" />
                </svg>
              </div>
            </div>
            <div className="meditation-content stack-8">
              <div className="pill pill--sun">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" fill="#f4b400"/>
                  <path d="m12 1 0 2m0 18 0 2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12l2 0m18 0 2 0M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#f4b400" strokeWidth="1.5"/>
                </svg>
                Morning
              </div>
              <div><strong>Morning Meditation</strong></div>
              <div className="muted small">Start your day with calm reflection.</div>
            </div>
          </div>
        </Link>

        <Link href="/meditation/s1" className="card meditation-card card--evening evening-meditation" style={{ display: "block", textDecoration: "none", color: "inherit", position: "relative" }}>
          <div className="meditation-card-container" style={{ display: "grid", gridTemplateColumns: "30% 1fr", columnGap: 20, alignItems: "center" }}>
            <div className="meditation-image-wrapper">
              <Image 
                src={`/covers/saitns/${dailySaintCover}`} 
                alt="Evening Meditation" 
                width={216}
                height={120}
                style={{ objectFit: "cover", width: "100%", height: "100%" }} 
              />
              <div className="gold-play-button play-button-wrapper">
                <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: "block" }} aria-hidden>
                  <polygon points="8,5 19,12 8,19" fill="#ffffff" />
                </svg>
              </div>
            </div>
            <div className="meditation-content stack-8">
              <div className="pill pill--moon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" fill="#6b74ff"/>
                </svg>
                Evening
              </div>
              <div><strong>Evening Meditation</strong></div>
              <div className="muted small" style={{ color: "#ffffff" }}>Unwind and reflect before rest.</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Client-side dynamic functionality */}
      <ClientHomePage dailySaintCover={dailySaintCover} />
    </>
  );
}
