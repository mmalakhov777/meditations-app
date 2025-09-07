"use client";

import { useEffect, useRef, useState } from "react";

export function VideoPlayer({ src, id }: { src: string; id: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const key = `progress:${id}`;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    const t = saved ? parseFloat(saved) : 0;
    const el = ref.current;
    if (!el) return;
    const onLoaded = () => {
      if (t > 0 && t < el.duration) el.currentTime = t;
      setReady(true);
    };
    const onTime = () => {
      if (!el) return;
      localStorage.setItem(key, String(el.currentTime));
    };
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
    };
  }, [key]);

  return (
    <div className="card" style={{ padding: 8 }}>
      <video ref={ref} src={src} controls playsInline style={{ width: "100%", borderRadius: 8, background: "#000" }} />
      {!ready && <div className="muted" style={{ padding: 8, fontSize: 12 }}>Loading…</div>}
    </div>
  );
}


