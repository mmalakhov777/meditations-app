"use client";

import { useEffect, useRef, useState } from "react";
import { useTelegram } from "@/components/TelegramProvider";

interface ClassicalAudioPlayerProps {
  id: string;
  src: string;
  title?: string;
  artist?: string;
}

export function ClassicalAudioPlayer({ id, src, title, artist }: ClassicalAudioPlayerProps) {
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
    const onPlay = () => { 
      markReady(); 
      setPlaying(true);
    };
    const onPause = () => { 
      setPlaying(false); 
    };

    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("durationchange", onDurationChange);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

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
      el.removeEventListener("pause", onPause);
    };
  }, [key]);

  const toggle = () => {
    const el = ref.current; 
    if (!el) return;
    if (playing) { 
      el.pause(); 
    } else { 
      el.play(); 
    }
  };

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; 
    if (!el || !duration) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, x / rect.width));
    el.currentTime = ratio * duration;
    setCurrentTime(el.currentTime);
  };

  const progress = duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
    <>
      {/* Black overlay with classical audio player controls */}
      <div style={{
        background: "rgba(0, 0, 0, 0.95)",
        backdropFilter: "blur(20px) saturate(1.2)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "0 24px",
        paddingBottom: `max(16px, env(safe-area-inset-bottom))`,
        paddingTop: "20px",
        color: "white",
        position: "relative",
        zIndex: 10,
        flexShrink: 0
      }}>
        {/* Progress bar - positioned at the very top of controls */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "4px",
          marginBottom: "16px",
          borderRadius: "2px",
          background: "rgba(255, 255, 255, 0.2)",
          overflow: "hidden",
          cursor: "pointer"
        }} onClick={onSeek}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${progress}%`,
            background: "linear-gradient(90deg, #FFD700, #FFA500)",
            borderRadius: "2px",
            transition: "width 0.1s ease"
          }} />
          {/* Playhead */}
          <div style={{
            position: "absolute",
            left: `${progress}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "16px",
            height: "16px",
            background: "#FFD700",
            borderRadius: "50%",
            border: "2px solid rgba(0, 0, 0, 0.3)",
            boxShadow: "0 2px 8px rgba(255, 215, 0, 0.4)",
            opacity: progress > 0 ? 1 : 0,
            transition: "opacity 0.2s ease"
          }} />
        </div>

        {/* Times below progress bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px"
        }}>
          <div style={{
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.7)"
          }}>
            {formatTime(currentTime)}
          </div>
          <div style={{
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.7)"
          }}>
            {formatTime(duration)}
          </div>
        </div>

        {/* Track info with like button */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "20px"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "4px",
              color: "white"
            }}>
              {title || "Meditation"}
            </div>
            <div style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.7)"
            }}>
              {artist || "Unknown Artist"}
            </div>
          </div>
          
          {/* Like button next to title */}
          <button 
            onClick={toggleFavorite} 
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              background: isFavorite 
                ? "linear-gradient(135deg, #FFD700, #FFA500)" 
                : "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              if (isFavorite) {
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(255, 215, 0, 0.4)";
              } else {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              if (isFavorite) {
                e.currentTarget.style.boxShadow = "none";
              } else {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? "#1a1a1a" : "white"}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Main controls */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px"
        }}>
          {/* Previous/Rewind 30s */}
          <button 
            onClick={() => { 
              const el = ref.current; 
              if (!el) return; 
              el.currentTime = Math.max(0, el.currentTime - 30); 
            }}
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              color: "white"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>
            </svg>
          </button>

          {/* Main play/pause button */}
          <button 
            onClick={toggle}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "none",
              background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
              boxShadow: "0 8px 32px rgba(255, 215, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              color: "#1a1a1a"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(255, 215, 0, 0.5), 0 6px 20px rgba(0, 0, 0, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(255, 215, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)";
            }}
          >
            {playing ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "3px" }}>
                <polygon points="8,5 19,12 8,19"/>
              </svg>
            )}
          </button>

          {/* Next/Forward 30s */}
          <button 
            onClick={() => { 
              const el = ref.current; 
              if (!el) return; 
              el.currentTime = Math.min(el.duration || el.currentTime + 30, el.currentTime + 30); 
            }}
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              border: "none",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              color: "white"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 6v12l8.5-6L13 6zM4 18l8.5-6L4 6v12z"/>
            </svg>
          </button>
        </div>


        {/* Loading indicator */}
        {!ready && !playing && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.7)"
          }}>
            Loading…
          </div>
        )}
      </div>

      {/* Hidden audio element */}
      <audio ref={ref} src={src} preload="metadata" />
    </>
  );
}
