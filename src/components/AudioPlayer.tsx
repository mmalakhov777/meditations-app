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
        <div className="overlay-controls">
          <button className="button-secondary" onClick={toggleFavorite} title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            {isFavorite ? "★" : "☆"}
          </button>
          <button className="button-secondary" onClick={() => { const el = ref.current; if (!el) return; el.currentTime = Math.max(0, el.currentTime - 30); }}>-30s</button>
          <button className="button" onClick={toggle}>{playing ? "Stop" : "Play"}</button>
          <button className="button-secondary" onClick={() => { const el = ref.current; if (!el) return; el.currentTime = Math.min(el.duration || el.currentTime + 30, el.currentTime + 30); }}>+30s</button>
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


