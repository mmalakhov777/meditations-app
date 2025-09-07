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
            <button className="button-secondary" onClick={toggle}>{theme === "light" ? t("theme.dark") : t("theme.light")}</button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px", marginBottom: 8 }}>
        <div className="muted small">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {todayMorning?.cover ? (
            <div style={{ flex: "0 0 30%" }}>
              <img src={todayMorning.cover} alt={todayMorning.title} style={{ width: "100%", borderRadius: 12 }} />
            </div>
          ) : null}
          <div style={{ flex: 1 }} className="stack-8">
            <div className="muted small">Morning</div>
            {todayMorning?.title ? <div><strong>{todayMorning.title}</strong></div> : null}
            <Link href="/meditation/f1" className="button">Start</Link>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {todayEvening?.cover ? (
            <div style={{ flex: "0 0 30%" }}>
              <img src={todayEvening.cover} alt={todayEvening.title} style={{ width: "100%", borderRadius: 12 }} />
            </div>
          ) : null}
          <div style={{ flex: 1 }} className="stack-8">
            <div className="muted small">Evening</div>
            {todayEvening?.title ? <div><strong>{todayEvening.title}</strong></div> : null}
            <Link href="/meditation/s1" className="button-secondary">Start</Link>
          </div>
        </div>
      </div>

      {null}
    </div>
  );
}
