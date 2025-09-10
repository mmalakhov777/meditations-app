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

  const user = webApp?.initDataUnsafe.user;

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
    <div className="container stack-16">
      <div className="card stack-12" style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="row">
            <div className="avatar-44" />
            <div className="stack-8">
              <strong>{user?.first_name ?? t("user.guest")}</strong>
              <span className="muted small">{isTelegram ? t("source.telegram") : t("source.web")}</span>
            </div>
          </div>
          <div className="row" style={{ alignItems: "center", gap: 8 }}>
            {authLoading ? <span className="muted small">{t("auth.loading")}</span> : null}
            <button 
              onClick={toggle}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "none",
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 215, 0, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 215, 0, 0.3)";
              }}
            >
              {theme === "light" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#1a1a1a"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" fill="#1a1a1a"/>
                  <path d="m12 1 0 2m0 18 0 2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12l2 0m18 0 2 0M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#1a1a1a"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px", marginBottom: 8 }}>
        <div className="muted small">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      <Link href="/meditation/f1" className="card" style={{ padding: 0, display: "block", textDecoration: "none", color: "inherit", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", minHeight: 120 }}>
          {todayMorning?.cover ? (
            <div style={{ flex: "0 0 30%", height: 120, position: "relative" }}>
              <img src={todayMorning.cover} alt={todayMorning.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ 
                position: "absolute", 
                top: "50%", 
                left: "50%", 
                transform: "translate(-50%, -50%)",
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 20px rgba(255, 215, 0, 0.4)",
                transition: "all 0.3s ease"
              }}>
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: "16px solid #1a1a1a",
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  marginLeft: "4px"
                }} />
              </div>
            </div>
          ) : null}
          <div style={{ flex: 1, padding: 20 }} className="stack-8">
            <div className="muted small">Morning</div>
            {todayMorning?.title ? <div><strong>{todayMorning.title}</strong></div> : null}
            <div className="muted small">Tap to start meditation</div>
          </div>
        </div>
      </Link>

      <Link href="/meditation/s1" className="card" style={{ padding: 0, display: "block", textDecoration: "none", color: "inherit", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", minHeight: 120 }}>
          {todayEvening?.cover ? (
            <div style={{ flex: "0 0 30%", height: 120, position: "relative" }}>
              <img src={todayEvening.cover} alt={todayEvening.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ 
                position: "absolute", 
                top: "50%", 
                left: "50%", 
                transform: "translate(-50%, -50%)",
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 20px rgba(255, 215, 0, 0.4)",
                transition: "all 0.3s ease"
              }}>
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: "16px solid #1a1a1a",
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  marginLeft: "4px"
                }} />
              </div>
            </div>
          ) : null}
          <div style={{ flex: 1, padding: 20 }} className="stack-8">
            <div className="muted small">Evening</div>
            {todayEvening?.title ? <div><strong>{todayEvening.title}</strong></div> : null}
            <div className="muted small">Tap to start meditation</div>
          </div>
        </div>
      </Link>

      {null}
    </div>
  );
}
