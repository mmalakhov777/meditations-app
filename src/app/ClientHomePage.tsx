"use client";

import { useEffect, useState, useRef } from "react";
import { useTelegram } from "@/components/TelegramProvider";
import { useTheme } from "@/components/ThemeProvider";
import { loadMeditationsDoc, pickToday, type MeditationItem } from "@/lib/meditations";
import { t } from "@/lib/i18n";

interface ClientHomePageProps {
  dailySaintCover: string;
}

export function ClientHomePage({ dailySaintCover }: ClientHomePageProps) {
  const { webApp, isTelegram } = useTelegram();
  const { theme, toggle } = useTheme();
  const [todayMorning, setTodayMorning] = useState<MeditationItem | null>(null);
  const [todayEvening, setTodayEvening] = useState<MeditationItem | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const didAuthRef = useRef(false);

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

  // Load meditation data
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
      {/* Theme toggle overlay - positioned over static content */}
      <div style={{ 
        position: "fixed", 
        top: "calc(env(safe-area-inset-top) + 64px)", 
        right: 16, 
        zIndex: 20,
        display: "flex", 
        gap: 8, 
        alignItems: "center" 
      }}>
        {authLoading ? (
          <span className="muted small" style={{ marginRight: 8 }}>
            {t("auth.loading")}
          </span>
        ) : null}
        
        <button 
          onClick={toggle}
          className="gold-theme-button"
          style={{ width: 38, height: 38 }}
          title="Toggle theme"
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

      {/* Dynamic meditation titles overlay - positioned over static content */}
      {(todayMorning || todayEvening) && (
        <>
          {/* Morning meditation title overlay */}
          {todayMorning?.title && (
            <div style={{
              position: "fixed",
              top: "calc(100vh * 3/4 + 64px + 8px + 120px * 0.5 - 12px)", // Positioned over morning card
              left: "calc(50% - 360px + 16px + 30% + 20px)", // Positioned over morning card content
              zIndex: 15,
              maxWidth: "calc(70% - 40px)",
              pointerEvents: "none"
            }}>
              <div><strong>{todayMorning.title}</strong></div>
            </div>
          )}

          {/* Evening meditation title overlay */}
          {todayEvening?.title && (
            <div style={{
              position: "fixed",
              top: "calc(100vh * 3/4 + 64px + 8px + 120px + 16px + 120px * 0.5 - 12px)", // Positioned over evening card
              left: "calc(50% - 360px + 16px + 30% + 20px)", // Positioned over evening card content
              zIndex: 15,
              maxWidth: "calc(70% - 40px)",
              pointerEvents: "none",
              color: "#ffffff" // White text for evening card
            }}>
              <div><strong>{todayEvening.title}</strong></div>
            </div>
          )}
        </>
      )}
    </>
  );
}
