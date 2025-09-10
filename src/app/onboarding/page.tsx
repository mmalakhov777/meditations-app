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
      titleKey: "onboarding.step2.title",
      subtitleKey: "onboarding.step2.subtitle",
      gradient: "linear-gradient(135deg, #0b1b34 0%, #1a2d4f 50%, #2a3f6b 100%)",
      icon: "☦",
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
    {
      titleKey: "onboarding.step5.title",
      subtitleKey: "onboarding.step5.subtitle",
      gradient: "linear-gradient(135deg, #e6c15a 0%, #f0c75e 50%, #fff7d1 100%)",
      icon: "💬",
    },
  ], []);

  // Preloading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedUrls, setPreloadedUrls] = useState<Record<string, string>>({});
  const isLastSlide = index >= steps.length;

  // All assets to preload
  const assetsToPreload = useMemo(() => [
    '/covers/newfirstbg.png',
    '/covers/newsecondslidebg.png',
    '/covers/newthirdslidebg.png',
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
  ], []);

  // Preload assets function
  const preloadAssets = useCallback(async () => {
    const progressIncrement = 100 / assetsToPreload.length;

    const loadPromises = assetsToPreload.map(async (src) => {
      if (src.endsWith('.mp4')) {
        await new Promise<void>((resolve) => {
          const video = document.createElement('video');
          video.preload = 'auto';
          video.oncanplaythrough = () => resolve();
          video.onerror = () => resolve();
          video.src = src;
          video.load();
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

  const skip = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setIndex(steps.length);
      setIsTransitioning(false);
    }, 150);
  }, [isTransitioning, steps.length]);

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
          opacity: isTransitioning ? 0.8 : 1,
          transition: "opacity 0.15s ease"
        }}>
          {index <= 2 ? (
            // Steps 1-3: Identical design with different background images
            <>
               {/* Background image */}
               <img
                 src={
                   index === 0 ? "/covers/newfirstbg.png" :
                   index === 1 ? "/covers/newsecondslidebg.png" :
                   "/covers/newthirdslidebg.png"
                 }
                 alt="Background"
                 style={{ 
                   position: "absolute", 
                   inset: 0, 
                   width: "100%", 
                   height: "100%", 
                   objectFit: "cover",
                   opacity: isTransitioning ? 0.8 : 1,
                   transition: "opacity 0.15s ease"
                 }}
               />
              
               {/* Title and description at bottom - white text */}
               <div
                 style={{
                   position: "absolute",
                   bottom: 0,
                   left: 0,
                   right: 0,
                   padding: "calc(env(safe-area-inset-top) + 20px) 20px 100px",
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
          ) : (
            // Steps 4-5: Gradient background
            <div style={{ 
              position: "absolute", 
              inset: 0, 
              background: steps[index].gradient,
              opacity: isTransitioning ? 0.8 : 1,
              transition: "opacity 0.15s ease"
            }} />
          )}

          {/* Progress dots header */}
          {index !== 4 && (
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
              {Array.from({ length: steps.length + 1 }).map((_, i) => {
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
          {index === 3 ? (
            // Step 4: Saints images grid above text
            <>
              {/* Saints images grid */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
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
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design.png'] || "/covers/saitns/Untitled Design.png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 1, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (1).png'] || "/covers/saitns/Untitled Design (1).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.9, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (2).png'] || "/covers/saitns/Untitled Design (2).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.8, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (3).png'] || "/covers/saitns/Untitled Design (3).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.7, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                   </div>
                   {/* Second row - 4 images */}
                   <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 4, willChange: "transform", animationName: "rowDriftRight", animationDuration: "1400ms", animationTimingFunction: "ease-out", animationDelay: "120ms", animationFillMode: "forwards" }}>
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (4).png'] || "/covers/saitns/Untitled Design (4).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.6, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (5).png'] || "/covers/saitns/Untitled Design (5).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.5, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (6).png'] || "/covers/saitns/Untitled Design (6).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.4, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (7).png'] || "/covers/saitns/Untitled Design (7).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.3, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                   </div>
                   {/* Third row - 4 images */}
                   <div style={{ display: "flex", justifyContent: "center", gap: 4, willChange: "transform", animationName: "rowDriftLeft", animationDuration: "1600ms", animationTimingFunction: "ease-out", animationDelay: "180ms", animationFillMode: "forwards" }}>
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (8).png'] || "/covers/saitns/Untitled Design (8).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.2, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (9).png'] || "/covers/saitns/Untitled Design (9).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.15, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (10).png'] || "/covers/saitns/Untitled Design (10).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.1, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                     <img loading="eager" src={preloadedUrls['/covers/saitns/Untitled Design (11).png'] || "/covers/saitns/Untitled Design (11).png"} alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.05, display: "block", backgroundColor: "rgba(255,255,255,0.1)" }} />
                   </div>
                </div>
              </div>
              
              {/* Title and description at bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "calc(env(safe-area-inset-top) + 20px) 20px 100px",
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
                      color: "#0b1b34",
                    }}
                  >
                    {t(steps[index].titleKey)}
                  </h1>
                  <p
                    style={{
                      margin: 0,
                      color: "rgba(11,27,52,0.8)",
                      fontSize: 16,
                      lineHeight: 1.4,
                    }}
                  >
                    {t(steps[index].subtitleKey)}
                  </p>
                </div>
              </div>
            </>
          ) : index === 4 ? (
            // Step 5: Testimonials loop
            <>
              {/* Testimonials scrolling container */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "100%",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "calc(env(safe-area-inset-top) + 80px) 20px 200px",
                  zIndex: 10,
                }}
              >
                {/* Continuous testimonials loop */}
                <div
                  ref={(el) => {
                    if (!el) return;
                    try {
                      // Use half of full scroll height to match duplicated content exactly
                      const updateDistance = () => {
                        const total = el.scrollHeight;
                        const half = total / 2;
                        el.style.setProperty('--loop-distance', `${half}px`);
                      };
                      // Defer to next frame to ensure layout is ready
                      requestAnimationFrame(updateDistance);
                      // Also update on window resize for responsiveness
                      const onResize = () => requestAnimationFrame(updateDistance);
                      window.addEventListener('resize', onResize);
                      // Cleanup if element is unmounted/replaced
                      (el as HTMLElement & { _cleanup?: () => void })._cleanup = () => window.removeEventListener('resize', onResize);
                    } catch {}
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    animation: "testimonialLoop 60s linear infinite",
                    willChange: "transform",
                    maxWidth: 600,
                    width: "100%",
                  }}
                >
                  {/* First set of testimonials */}
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div
                      key={`testimonial-${num}`}
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        borderRadius: 16,
                        padding: "24px",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {/* Stars rating */}
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                          marginBottom: 12,
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              color: "#f0c75e",
                              fontSize: 16,
                            }}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      
                      <p
                        style={{
                          margin: "0 0 16px 0",
                          color: "#ffffff",
                          fontSize: 16,
                          lineHeight: 1.5,
                          fontStyle: "italic",
                        }}
                      >
                        &ldquo;{t(`onboarding.testimonial${num}.text`)}&rdquo;
                      </p>
                      <p
                        style={{
                          margin: 0,
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        — {t(`onboarding.testimonial${num}.author`)}
                      </p>
                    </div>
                  ))}
                  
                  {/* Duplicate set for seamless loop */}
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div
                      key={`testimonial-duplicate-${num}`}
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        borderRadius: 16,
                        padding: "24px",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {/* Stars rating */}
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                          marginBottom: 12,
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              color: "#f0c75e",
                              fontSize: 16,
                            }}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      
                      <p
                        style={{
                          margin: "0 0 16px 0",
                          color: "#ffffff",
                          fontSize: 16,
                          lineHeight: 1.5,
                          fontStyle: "italic",
                        }}
                      >
                        &ldquo;{t(`onboarding.testimonial${num}.text`)}&rdquo;
                      </p>
                      <p
                        style={{
                          margin: 0,
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        — {t(`onboarding.testimonial${num}.author`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Solid black div at very bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "180px",
                  background: "rgba(0,0,0,0.95)",
                  zIndex: 15,
                }}
              />

              {/* Black gradient overlay above solid bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: "180px",
                  left: 0,
                  right: 0,
                  height: "150px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)",
                  zIndex: 15,
                }}
              />

              {/* Title and description at bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "calc(env(safe-area-inset-top) + 20px) 20px 100px",
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
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 16px calc(12px + env(safe-area-inset-bottom))" }}>
          {/* Spacing div to push content higher */}
          <div style={{ height: "60px" }} />
          {index < steps.length - 1 ? (
            <Button onClick={goNext} style={{ width: "100%", fontSize: "18px", padding: "16px 24px", fontWeight: "600" }}>{t("onboarding.next")}</Button>
          ) : (
            <Link href="/" className="button" style={{ width: "100%", display: "block", textAlign: "center", fontSize: "18px", padding: "16px 24px", fontWeight: "600" }}>{t("onboarding.start")}</Link>
          )}
        </div>
      </div>
    </>
  );
}
