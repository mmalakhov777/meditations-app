"use client";

import { useEffect, useRef, useState } from "react";
import { useTelegram } from "@/components/TelegramProvider";

export function AudioPlayer({ id, src, cover }: { id: string; src: string; cover?: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const key = `audio-progress:${id}`;
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { webApp } = useTelegram();
  const telegramId = webApp?.initDataUnsafe?.user?.id;
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const saved = localStorage.getItem(key);
    const t = saved ? parseFloat(saved) : 0;
    const markReady = () => {
      setDuration(Number.isFinite(el.duration) ? el.duration : 0);
      setCurrentTime(el.currentTime || 0);
      setReady(true);
    };
    const onLoaded = () => {
      if (t > 0 && t < el.duration) el.currentTime = t;
      markReady();
    };
    const onTime = () => {
      setCurrentTime(el.currentTime || 0);
      localStorage.setItem(key, String(el.currentTime));
    };
    const onCanPlay = () => { markReady(); };
    const onDurationChange = () => { markReady(); };
    const onPlay = () => { markReady(); };

    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("durationchange", onDurationChange);
    el.addEventListener("play", onPlay);

    if (el.readyState > 0 || Number.isFinite(el.duration)) {
      if (t > 0 && t < (el.duration || Infinity)) el.currentTime = t;
      markReady();
    }

    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("durationchange", onDurationChange);
      el.removeEventListener("play", onPlay);
    };
  }, [key]);

  const toggle = () => {
    const el = ref.current; if (!el) return;
    if (playing) { el.pause(); el.currentTime = 0; setPlaying(false); }
    else { el.play(); setPlaying(true); }
  };

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el || !duration) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, x / rect.width));
    el.currentTime = ratio * duration;
    setCurrentTime(el.currentTime);
  };

  const progress = duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0;

  useEffect(() => {
    if (!telegramId) return;
    fetch(`/api/user/favorites?telegramId=${telegramId}`).then(r => r.json()).then((d) => {
      const favs: string[] = d?.favorites || [];
      setIsFavorite(favs.includes(id));
    }).catch(() => {});
  }, [telegramId, id]);

  const toggleFavorite = async () => {
    if (!telegramId) return;
    try {
      const res = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, meditationId: id, action: 'toggle' })
      });
      const data = await res.json();
      if (res.ok) setIsFavorite(Boolean(data?.isFavorite));
    } catch {}
  };

  return (
    <div className="stack-12">
      <div className="overlay">
        {cover ? <img src={cover} alt="Cover" className="cover-xl" /> : null}
        <div className="overlay-controls" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <button 
            onClick={toggleFavorite} 
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "none",
              background: isFavorite ? "linear-gradient(135deg, #FFD700, #FFA500)" : "rgba(255, 255, 255, 0.2)",
              boxShadow: isFavorite ? "0 4px 12px rgba(255, 215, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = isFavorite ? "0 6px 16px rgba(255, 215, 0, 0.4)" : "0 4px 12px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = isFavorite ? "0 4px 12px rgba(255, 215, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.2)";
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "#1a1a1a" : "#fff"}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          
          <button 
            onClick={() => { const el = ref.current; if (!el) return; el.currentTime = Math.max(0, el.currentTime - 30); }}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255, 255, 255, 0.2)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 0,
              padding: 0,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" style={{ display: "block" }}>
              <path d="M11 17l-5-5 5-5v10z"/>
              <path d="M18 17l-5-5 5-5v10z"/>
            </svg>
          </button>
          
          <button 
            onClick={toggle}
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "none",
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              boxShadow: "0 6px 20px rgba(255, 215, 0, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 215, 0, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 215, 0, 0.4)";
            }}
          >
            {playing ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a1a1a">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <div style={{
                width: 0,
                height: 0,
                borderLeft: "20px solid #1a1a1a",
                borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                marginLeft: "4px"
              }} />
            )}
          </button>
          
          <button 
            onClick={() => { const el = ref.current; if (!el) return; el.currentTime = Math.min(el.duration || el.currentTime + 30, el.currentTime + 30); }}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255, 255, 255, 0.2)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 0,
              padding: 0,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" style={{ display: "block" }}>
              <path d="M13 7l5 5-5 5V7z"/>
              <path d="M6 7l5 5-5 5V7z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="audio-progress" onClick={onSeek}>
        <div className="audio-progress__fill" style={{ width: `${progress}%` }} />
      </div>
      <audio ref={ref} src={src} preload="metadata" />
      {!ready && !playing && <div className="muted small">Loading…</div>}
    </div>
  );
}


