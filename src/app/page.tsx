"use client";
import { useEffect, useState, useRef } from "react";
import { useTelegram } from "@/components/TelegramProvider";
import { t } from "@/lib/i18n";
import { useTheme } from "@/components/ThemeProvider";
import { loadMeditationsDoc, pickToday, type MeditationItem } from "@/lib/meditations";
import Link from "next/link";

export default function Home() {
  const { webApp, isTelegram } = useTelegram();
  const { theme, toggle } = useTheme();
  const [todayMorning, setTodayMorning] = useState<MeditationItem | null>(null);
  const [todayEvening, setTodayEvening] = useState<MeditationItem | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const didAuthRef = useRef(false);

  // Deterministic daily saint cover from saints folder
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
  const today = new Date();
  const dayKey = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const dailySaintCover = saintCovers[dayKey % saintCovers.length];

  // User data available via webApp?.initDataUnsafe.user when needed

  // Authorize/upsert user once per app load when Telegram data is available
  useEffect(() => {
    if (!didAuthRef.current && isTelegram && webApp?.initDataUnsafe?.user?.id) {
      didAuthRef.current = true;
      setAuthLoading(true);
      fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initDataUnsafe: webApp.initDataUnsafe })
      }).finally(() => setAuthLoading(false));
    }
  }, [isTelegram, webApp]);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    loadMeditationsDoc(year, month).then(doc => {
      if (!doc) {
        // Fallback to September 2025 data if current month doesn't exist
        return loadMeditationsDoc(2025, 9);
      }
      return doc;
    }).then(doc => {
      if (!doc) return;
      
      // First try to get today's items
      const { morning, evening } = pickToday(doc.items, now);
      
      // If today's items don't exist, fallback to first available
      const morningItem = morning || doc.items.find(x => x.type === "morning");
      const eveningItem = evening || doc.items.find(x => x.type === "evening");
      
      setTodayMorning(morningItem || null);
      setTodayEvening(eveningItem || null);
    });
  }, []);

  return (
    <>
      {/* Full-bleed saint hero */}
      <div style={{ position: "relative", width: "100vw", marginLeft: "calc(50% - 50vw)" }}>
        <div style={{ width: "100%", aspectRatio: "3 / 4", position: "relative" }}>
          <img
            src={`/covers/saitns/${dailySaintCover}`}
            alt="Saint of the day"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Top-right overlay: theme toggle */}
          <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top) + 64px)", right: 16 }}>
            {authLoading ? <span className="muted small" style={{ marginRight: 8 }}>{t("auth.loading")}</span> : null}
            <button 
              onClick={toggle}
              className="gold-theme-button"
              style={{ width: 38, height: 38 }}
            >
              {theme === "light" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="none" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#1a1a1a"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="none" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" fill="#1a1a1a" stroke="none"/>
                  <path d="m12 1 0 2m0 18 0 2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12l2 0m18 0 2 0M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#1a1a1a"/>
                </svg>
              )}
            </button>
          </div>
          {/* Bottom overlay: left name/date, right snippet + CTA */}
          <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, background: "var(--glass)", border: "1px solid var(--glass-border)", backdropFilter: "blur(8px) saturate(1.05)", borderRadius: 12, padding: 12 }}>
            <div className="stack-8">
              <div className="h1 saint-overlay-text">Saint of the Day</div>
              <div className="muted small saint-overlay-text">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div className="stack-8" style={{ maxWidth: "55%" }}>
              <div className="small saint-overlay-text" style={{ lineHeight: 1.3 }}>
                A short note about the saint goes here. Replace with real bio copy to introduce today&apos;s saint and their story.
              </div>
              <Link href="/saint/daily" className="button-secondary" style={{ textDecoration: "none", alignSelf: "start" }}>
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container stack-16" style={{ paddingTop: 8 }}>

      {/* Profile header removed per request; theme toggle stays on hero */}

      <div style={{ height: 8 }} />

      <Link href="/meditation/f1" className="card meditation-card card--morning" style={{ display: "block", textDecoration: "none", color: "inherit", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", minHeight: 120 }}>
          <div style={{ flex: "0 0 30%", height: 120, position: "relative" }}>
            <img src={`/covers/saitns/${dailySaintCover}`} alt="Morning Meditation" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div 
                className="gold-play-button"
                style={{ 
                  position: "absolute", 
                  top: "50%", 
                  left: "50%", 
                  transform: "translate(-50%, -50%)",
                  width: 64,
                  height: 64,
                  zIndex: 10
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: "block" }} aria-hidden>
                  <polygon points="8,5 19,12 8,19" fill={theme === "dark" ? "#ffffff" : "#1a1a1a"} />
                </svg>
              </div>
            </div>
          <div style={{ flex: 1, padding: 20 }} className="stack-8">
            <div className="pill pill--sun">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" fill="#f4b400"/>
                <path d="m12 1 0 2m0 18 0 2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12l2 0m18 0 2 0M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#f4b400" strokeWidth="1.5"/>
              </svg>
              Morning
            </div>
            {todayMorning?.title ? <div><strong>{todayMorning.title}</strong></div> : null}
            <div className="muted small">Tap to start meditation</div>
          </div>
        </div>
      </Link>

      <Link href="/meditation/s1" className="card meditation-card card--evening evening-meditation" style={{ display: "block", textDecoration: "none", color: "inherit", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", minHeight: 120 }}>
          <div style={{ flex: "0 0 30%", height: 120, position: "relative" }}>
            <img src={`/covers/saitns/${dailySaintCover}`} alt="Evening Meditation" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div 
                className="gold-play-button"
                style={{ 
                  position: "absolute", 
                  top: "50%", 
                  left: "50%", 
                  transform: "translate(-50%, -50%)",
                  width: 64,
                  height: 64,
                  zIndex: 10
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: "block" }} aria-hidden>
                  <polygon points="8,5 19,12 8,19" fill={theme === "dark" ? "#ffffff" : "#1a1a1a"} />
                </svg>
              </div>
            </div>
          <div style={{ flex: 1, padding: 20 }} className="stack-8">
            <div className="pill pill--moon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" fill="#6b74ff"/></svg>
              Evening
            </div>
            {todayEvening?.title ? <div><strong>{todayEvening.title}</strong></div> : null}
            <div className="muted small">Tap to start meditation</div>
          </div>
        </div>
      </Link>

      {null}
    </div>
    </>
  );
}
