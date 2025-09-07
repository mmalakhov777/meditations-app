"use client";

import { useEffect, useRef, useState } from "react";

export function AudioPlayer({ id, src, cover }: { id: string; src: string; cover?: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const key = `audio-progress:${id}`;
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const saved = localStorage.getItem(key);
    const t = saved ? parseFloat(saved) : 0;
    const onLoaded = () => {
      if (t > 0 && t < el.duration) el.currentTime = t;
      setReady(true);
    };
    const onTime = () => localStorage.setItem(key, String(el.currentTime));
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
    };
  }, [key]);

  const toggle = () => {
    const el = ref.current; if (!el) return;
    if (playing) { el.pause(); el.currentTime = 0; setPlaying(false); }
    else { el.play(); setPlaying(true); }
  };

  return (
    <div className="stack-12">
      <div className="overlay">
        {cover ? <img src={cover} alt="Cover" className="cover-xl" /> : null}
        <div className="overlay-controls">
          <button className="button-secondary" onClick={() => { const el = ref.current; if (!el) return; el.currentTime = Math.max(0, el.currentTime - 30); }}>-30s</button>
          <button className="button" onClick={toggle}>{playing ? "Stop" : "Play"}</button>
          <button className="button-secondary" onClick={() => { const el = ref.current; if (!el) return; el.currentTime = Math.min(el.duration || el.currentTime + 30, el.currentTime + 30); }}>+30s</button>
        </div>
      </div>
      <audio ref={ref} src={src} preload="metadata" />
      {!ready && <div className="muted small">Loading…</div>}
    </div>
  );
}


