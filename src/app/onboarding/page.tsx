"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { Button } from "@/components/UI";
import { HideBottomNav } from "@/components/HideBottomNav";

export default function OnboardingPage() {
  const steps = useMemo(() => [
    {
      titleKey: "onboarding.step1.title",
      subtitleKey: "onboarding.step1.subtitle",
      gradient: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%)",
      icon: "✦",
    },
    {
      titleKey: "onboarding.step3.title",
      subtitleKey: "onboarding.step3.subtitle",
      gradient: "linear-gradient(135deg, #e6c15a 0%, #f0c75e 50%, #fff7d1 100%)",
      icon: "🕊",
    },
    {
      titleKey: "onboarding.step4.title",
      subtitleKey: "onboarding.step4.subtitle",
      gradient: "linear-gradient(135deg, #e6c15a 0%, #f0c75e 50%, #fff7d1 100%)",
      icon: "✨",
    },
  ], []);

  // Preloading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedUrls, setPreloadedUrls] = useState<Record<string, string>>({});
  const isLastSlide = index >= steps.length;

  // All assets to preload - entire app resources
  const assetsToPreload = useMemo(() => [
    // Onboarding assets
    '/covers/1stepcorrectnotfinal.png',
    '/covers/2stepnotfinal.png',
    '/covers/subscrimage.png',
    
    // Saints covers (for home page and saint pages)
    '/covers/saitns/Untitled Design.png',
    '/covers/saitns/Untitled Design (1).png',
    '/covers/saitns/Untitled Design (2).png',
    '/covers/saitns/Untitled Design (3).png',
    '/covers/saitns/Untitled Design (4).png',
    '/covers/saitns/Untitled Design (5).png',
    '/covers/saitns/Untitled Design (6).png',
    '/covers/saitns/Untitled Design (7).png',
    '/covers/saitns/Untitled Design (8).png',
    '/covers/saitns/Untitled Design (9).png',
    '/covers/saitns/Untitled Design (10).png',
    '/covers/saitns/Untitled Design (11).png',
    '/covers/saitns/Untitled Design (12).png',
    '/covers/saitns/Untitled Design (13).png',
    
    // Meditation assets
    '/meditations/covers/1-sept-light-cover.webp',
    '/meditations/audio/1-sept-meditation.mp3',
  ], []);

  // Preload assets function - loads entire app
  const preloadAssets = useCallback(async () => {
    const totalAssets = assetsToPreload.length + 3; // +3 for app data and routes
    const progressIncrement = 100 / totalAssets;

    // 1. Load meditation data first (critical for app)
    try {
      await fetch('/meditations/2025-09.json', { cache: 'force-cache' });
      setLoadingProgress(prev => Math.min(prev + progressIncrement, 100));
    } catch (error) {
      console.warn('Failed to preload meditation data:', error);
      setLoadingProgress(prev => Math.min(prev + progressIncrement, 100));
    }

    // 2. Preload critical app routes
    try {
      await Promise.all([
        fetch('/', { cache: 'force-cache' }), // Home page
        fetch('/calendar', { cache: 'force-cache' }), // Calendar page
        fetch('/favorites', { cache: 'force-cache' }), // Favorites page
      ]);
      setLoadingProgress(prev => Math.min(prev + progressIncrement, 100));
    } catch (error) {
      console.warn('Failed to preload app routes:', error);
      setLoadingProgress(prev => Math.min(prev + progressIncrement, 100));
    }

    // 3. Load all visual and audio assets
    const loadPromises = assetsToPreload.map(async (src) => {
      if (src.endsWith('.mp3') || src.endsWith('.mp4')) {
        await new Promise<void>((resolve) => {
          const media = src.endsWith('.mp3') ? document.createElement('audio') : document.createElement('video');
          media.preload = 'auto';
          media.oncanplaythrough = () => resolve();
          media.onerror = () => resolve();
          media.src = src;
          media.load();
        });
        setLoadingProgress(prev => Math.min(prev + progressIncrement, 100));
        return;
      }

      try {
        // Fetch image and create a blob URL to guarantee in-memory availability
        const res = await fetch(src, { cache: 'force-cache' });
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        const img = new Image();
        const loadPromise = new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
        img.src = blobUrl;
        await loadPromise;
        if (img.decode) {
          try { await img.decode(); } catch {}
        }

        setPreloadedUrls(prev => ({ ...prev, [src]: blobUrl }));
      } catch {
        // fallback to original src if fetch fails
        const img = new Image();
        const loadPromise = new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
        img.src = src;
        await loadPromise;
        if (img.decode) {
          try { await img.decode(); } catch {}
        }
      }

      setLoadingProgress(prev => Math.min(prev + progressIncrement, 100));
    });

    try {
      await Promise.all(loadPromises);
      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      console.error('Failed to preload some assets:', error);
      setIsLoading(false);
    }
  }, [assetsToPreload]);

  // Start preloading on mount
  useEffect(() => {
    preloadAssets();
  }, [preloadAssets]);

  // Smooth transition functions
  const goNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setIndex(prev => Math.min(prev + 1, steps.length));
      setIsTransitioning(false);
    }, 150);
  }, [isTransitioning, steps.length]);

  const goBack = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setIndex(prev => Math.max(prev - 1, 0));
      setIsTransitioning(false);
    }, 150);
  }, [isTransitioning]);

  // Skip function removed as it's not used

  // Show loading screen while preloading
  if (isLoading) {
    return (
      <>
        <HideBottomNav />
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          background: "linear-gradient(135deg, #e6c15a 0%, #f0c75e 50%, #fff7d1 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px"
        }}>
          <div style={{ textAlign: "center", maxWidth: 300, width: "100%" }}>
            <h2 style={{ 
              color: "#0b1b34", 
              marginBottom: 32,
              fontSize: 24,
              fontWeight: 700
            }}>
              {t("onboarding.loading.title") || "Preparing your experience..."}
            </h2>
            
            {/* Progress bar */}
            <div style={{ 
              width: "100%", 
              height: 8, 
              backgroundColor: "rgba(11,27,52,0.2)", 
              borderRadius: 4,
              overflow: "hidden",
              marginBottom: 16
            }}>
              <div style={{ 
                width: `${loadingProgress}%`, 
                height: "100%", 
                backgroundColor: "#0b1b34",
                borderRadius: 4,
                transition: "width 0.3s ease"
              }} />
            </div>
            
            <p style={{ 
              color: "rgba(11,27,52,0.7)", 
              fontSize: 14,
              margin: 0
            }}>
              {Math.round(loadingProgress)}%
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HideBottomNav />
      <style>{`
        @keyframes rowDriftLeft {
          0% { transform: translateX(-12px); opacity: 0.98; }
          60% { transform: translateX(2px); }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes rowDriftRight {
          0% { transform: translateX(12px); opacity: 0.98; }
          60% { transform: translateX(-1px); }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes testimonialLoop {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(var(--loop-distance, 50%) * -1)); }
        }
      `}</style>
      {!isLastSlide ? (
        <div style={{ 
          position: "fixed", 
          inset: 0,
          background: "#000000",
          opacity: isTransitioning ? 0.8 : 1,
          transition: "opacity 0.15s ease"
        }}>
          {/* Left click area for previous slide */}
          <div
            onClick={goBack}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "50%",
              height: "100%",
              zIndex: 30,
              cursor: "pointer"
            }}
            aria-label="Previous slide"
          />
          
          {/* Right click area for next slide */}
          <div
            onClick={goNext}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "50%",
              height: "100%",
              zIndex: 30,
              cursor: "pointer"
            }}
            aria-label="Next slide"
          />
          {index <= 1 ? (
            // Steps 1-2: Identical design with different background images
            <>
               {/* Background image */}
               <img
                 src={
                   index === 0 ? "/covers/1stepcorrectnotfinal.png" :
                   "/covers/2stepnotfinal.png"
                 }
                 alt="Background"
                 style={{ 
                   position: "absolute", 
                   inset: 0, 
                   width: "100%", 
                   height: "100%", 
                   objectFit: "cover",
                   opacity: isTransitioning ? 0.8 : 1,
                   transition: "opacity 0.15s ease",
                   transform: "none"
                 }}
               />
              
               {/* Title and description at bottom - white text */}
               <div
                 style={{
                   position: "absolute",
                   bottom: 0,
                   left: 0,
                   right: 0,
                   padding: "calc(env(safe-area-inset-top) + 20px) 20px 180px",
                   zIndex: 20,
                 }}
               >
                 <div className="stack-8" style={{ maxWidth: 720, margin: "0 auto" }}>
                   <h1
                     style={{
                       fontSize: 28,
                       lineHeight: 1.1,
                       letterSpacing: -0.3,
                       margin: 0,
                       fontWeight: 800,
                       color: "#ffffff",
                     }}
                   >
                     {t(steps[index].titleKey)}
                   </h1>
                   <p
                     style={{
                       margin: 0,
                       color: "rgba(255,255,255,0.8)",
                       fontSize: 16,
                       lineHeight: 1.4,
                     }}
                   >
                     {t(steps[index].subtitleKey)}
                   </p>
                 </div>
               </div>
            </>
          ) : null}

          {/* Progress dots header */}
          {index !== 2 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                padding: "calc(env(safe-area-inset-top) + 20px) 20px 100px",
                zIndex: 10,
              }}
            >
            <div className="row" style={{ justifyContent: "center", gap: 6 }}>
              {Array.from({ length: steps.length }).map((_, i) => {
                const active = i === index;
                const done = i < index;
                return (
                  <span
                    key={i}
                    aria-hidden
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: active
                        ? "#ffffff"
                        : done
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(255,255,255,0.3)",
                      boxShadow: active ? "0 0 0 4px rgba(255,255,255,0.3)" : undefined,
                    }}
                  />
                );
              })}
            </div>
            </div>
          )}

          {/* Content overlay */}
          {index === 2 ? (
            // Step 3: Saints images grid above text
            <>
              {/* Saints images grid */}
              <div
                style={{
                  position: "absolute",
                  top: "-60px",
                  left: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  padding: "calc(env(safe-area-inset-top)) 20px 20px",
                  zIndex: 10,
                }}
              >
                <div style={{ maxWidth: 1000, width: "100%" }}>
                   {/* First row - 4 images */}
                   <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 4, willChange: "transform", animationName: "rowDriftLeft", animationDuration: "1200ms", animationTimingFunction: "ease-out", animationDelay: "60ms", animationFillMode: "forwards" }}>
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design.png'] || "/covers/saitns/Untitled Design.png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 0, objectFit: "cover", border: "3px solid", borderImage: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 1, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (1).png'] || "/covers/saitns/Untitled Design (1).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 0, objectFit: "cover", border: "3px solid", borderImage: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.9, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (2).png'] || "/covers/saitns/Untitled Design (2).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 0, objectFit: "cover", border: "3px solid", borderImage: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.8, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (3).png'] || "/covers/saitns/Untitled Design (3).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 0, objectFit: "cover", border: "3px solid", borderImage: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.7, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                   </div>
                   {/* Second row - 4 images */}
                   <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 4, willChange: "transform", animationName: "rowDriftRight", animationDuration: "1400ms", animationTimingFunction: "ease-out", animationDelay: "120ms", animationFillMode: "forwards" }}>
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (4).png'] || "/covers/saitns/Untitled Design (4).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 0, objectFit: "cover", border: "3px solid", borderImage: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.6, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (5).png'] || "/covers/saitns/Untitled Design (5).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 0, objectFit: "cover", border: "3px solid", borderImage: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.5, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (6).png'] || "/covers/saitns/Untitled Design (6).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 0, objectFit: "cover", border: "3px solid", borderImage: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.4, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (7).png'] || "/covers/saitns/Untitled Design (7).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 0, objectFit: "cover", border: "3px solid", borderImage: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.3, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                   </div>
                   {/* Third row - 4 images */}
                   <div style={{ display: "flex", justifyContent: "center", gap: 4, willChange: "transform", animationName: "rowDriftLeft", animationDuration: "1600ms", animationTimingFunction: "ease-out", animationDelay: "180ms", animationFillMode: "forwards" }}>
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (8).png'] || "/covers/saitns/Untitled Design (8).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 0, objectFit: "cover", border: "3px solid", borderImage: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.2, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (9).png'] || "/covers/saitns/Untitled Design (9).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 0, objectFit: "cover", border: "3px solid", borderImage: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.15, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (10).png'] || "/covers/saitns/Untitled Design (10).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 0, objectFit: "cover", border: "3px solid", borderImage: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.1, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (11).png'] || "/covers/saitns/Untitled Design (11).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 0, objectFit: "cover", border: "3px solid", borderImage: "linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.05, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                   </div>
                </div>
              </div>
              
              
              {/* Gradient overlay filling entire height - lighter top to darker bottom */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)",
                  zIndex: 15,
                }}
              />
              
              {/* Content in proper order from top to bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "calc(env(safe-area-inset-top) + 20px) 20px 140px",
                  zIndex: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px"
                }}
              >
                <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
                  {/* 1. Title */}
                  <h1
                    style={{
                      fontSize: 28,
                      lineHeight: 1.1,
                      letterSpacing: -0.3,
                      margin: "0 0 5px 0",
                      fontWeight: 800,
                      color: "#ffffff",
                    }}
                  >
                    {t(steps[index].titleKey)}
                  </h1>
                  
                  {/* 2. Row with bullets + image */}
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    {/* Left side - Bullet points */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <span style={{ color: "#f0c75e", fontSize: 16, marginTop: 6 }}>•</span>
                        <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.4 }}>
                          <strong style={{ color: "#ffffff" }}>2-minute meditations</strong> for morning and evening practice
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <span style={{ color: "#f0c75e", fontSize: 16, marginTop: 6 }}>•</span>
                        <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.4 }}>
                          <strong style={{ color: "#ffffff" }}>Daily saint-based content</strong> with new meditation each day
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <span style={{ color: "#f0c75e", fontSize: 16, marginTop: 6 }}>•</span>
                        <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.4 }}>
                          <strong style={{ color: "#ffffff" }}>Deep cultural roots</strong> connecting you to Orthodox tradition
                        </p>
                      </div>
                    </div>
                    
                    {/* Right side - Subscription image */}
                    <div style={{ flexShrink: 0 }}>
                      <img 
                        src={preloadedUrls['/covers/subscrimage.png'] || "/covers/subscrimage.png"}
                        alt="Subscription"
                        style={{
                          width: "120px",
                          height: "auto",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>

                  {/* 3. Pricing card */}
                  {index === 2 && (
                    <div style={{ 
                      textAlign: "center", 
                      padding: "16px 20px", 
                      background: "linear-gradient(135deg, rgba(240, 199, 94, 0.15) 0%, rgba(233, 194, 90, 0.1) 100%)",
                      border: "1px solid rgba(240, 199, 94, 0.3)",
                      borderRadius: "16px",
                      backdropFilter: "blur(10px)",
                      marginTop: "-30px"
                    }}>
                      <div style={{ marginBottom: "8px" }}>
                        <span style={{
                          fontSize: "16px",
                          color: "rgba(255,255,255,0.6)",
                          textDecoration: "line-through",
                          marginRight: "8px"
                        }}>
                          $9.99
                        </span>
                        <span style={{
                          fontSize: "28px",
                          fontWeight: "800",
                          color: "#ffffff"
                        }}>
                          $4.99
                        </span>
                        <span style={{
                          fontSize: "14px",
                          color: "rgba(255,255,255,0.8)",
                          marginLeft: "4px"
                        }}>
                          /month
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "12px"
                      }}>
                        🔥 50% OFF • Cancel anytime • 7-day free trial
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            // Other steps (if any)
            <></>
          )}
        </div>
      ) : null}

      {/* Fixed bottom controls */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px calc(12px + env(safe-area-inset-bottom))" }}>
          {index < steps.length - 1 ? (
            <Button onClick={goNext} style={{ width: "100%", fontSize: "18px", padding: "16px 24px", fontWeight: "600", color: "white" }}>{t("onboarding.next")}</Button>
          ) : (
            <Link href="/" className="button" style={{ width: "100%", display: "block", textAlign: "center", fontSize: "18px", padding: "16px 24px", fontWeight: "600", color: "white" }}>Start Now - $4.99/month</Link>
          )}
        </div>
      </div>
    </>
  );
}
