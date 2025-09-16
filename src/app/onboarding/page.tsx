"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
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
  const step3Ref = useRef<HTMLDivElement | null>(null);

  // Static approach - all slides pre-rendered
  const didInitRef = useRef(false);
  const lastNavAtRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const resolveSrc = useCallback((src: string) => preloadedUrls[src] || src, [preloadedUrls]);

  // ALL assets to preload - complete onboarding and app resources
  const assetsToPreload = useMemo(() => [
    // Critical onboarding background images (highest priority)
    '/covers/1stepcorrectnotfinal.webp',
    '/covers/2stepnotfinal.webp',
    '/covers/subscrimage.webp',
    
    // ALL saint images used in onboarding (preload all for instant step 3)
    '/covers/saitns/Untitled Design.webp',
    '/covers/saitns/Untitled Design (1).webp',
    '/covers/saitns/Untitled Design (2).webp',
    '/covers/saitns/Untitled Design (3).webp',
    '/covers/saitns/Untitled Design (4).webp',
    '/covers/saitns/Untitled Design (5).webp',
    '/covers/saitns/Untitled Design (6).webp',
    '/covers/saitns/Untitled Design (7).webp',
    '/covers/saitns/Untitled Design (8).webp',
    '/covers/saitns/Untitled Design (9).webp',
    '/covers/saitns/Untitled Design (10).webp',
    '/covers/saitns/Untitled Design (11).webp',
    '/covers/saitns/Untitled Design (12).webp',
    '/covers/saitns/Untitled Design (13).webp',
    
    // Main app assets (for seamless transition after onboarding)
    '/meditations/covers/1-sept-light-cover.webp',
    '/meditations/audio/1-sept-meditation.mp3',
  ], []);

  // Preload assets function - loads entire app and warms up CSS classes
  const preloadAssets = useCallback(async () => {
    const totalAssets = assetsToPreload.length + 5; // +5 for app data, routes, and CSS warming
    const progressIncrement = 100 / totalAssets;

    // 1. Warm up all CSS classes by creating invisible elements (instant CSS parsing)
    try {
      const warmupContainer = document.createElement('div');
      warmupContainer.style.position = 'absolute';
      warmupContainer.style.top = '-9999px';
      warmupContainer.style.left = '-9999px';
      warmupContainer.style.visibility = 'hidden';
      warmupContainer.style.pointerEvents = 'none';
      
      // Create elements with all onboarding CSS classes to force browser parsing
      const classesToWarmup = [
        'onboarding-container', 'onboarding-background', 'onboarding-content',
        'saints-grid-container', 'saints-row', 'saints-row-left', 'saints-row-right', 'saints-row-left-delayed',
        'saint-image', 'progress-dots', 'progress-dot', 'progress-dot-active', 'progress-dot-done', 'progress-dot-inactive',
        'fixed-bottom-controls', 'bottom-controls-container', 'onboarding-title', 'onboarding-subtitle',
        'onboarding-bullet-point', 'onboarding-bullet', 'onboarding-bullet-text', 'onboarding-bullet-strong',
        'subscription-image', 'pricing-card', 'pricing-old-price', 'pricing-new-price', 'pricing-period',
        'pricing-description', 'gradient-overlay', 'click-area-left', 'click-area-right',
        'loading-screen', 'loading-content', 'loading-title', 'loading-progress-bar', 'loading-progress-fill', 'loading-percentage'
      ];
      
      classesToWarmup.forEach(className => {
        const el = document.createElement('div');
        el.className = className;
        el.textContent = 'warmup';
        warmupContainer.appendChild(el);
      });
      
      document.body.appendChild(warmupContainer);
      
      // Force reflow to ensure CSS is parsed
      warmupContainer.offsetHeight;
      
      // Clean up
      document.body.removeChild(warmupContainer);
      
      setLoadingProgress(prev => Math.min(prev + progressIncrement, 100));
    } catch (error) {
      console.warn('Failed to warm up CSS classes:', error);
      setLoadingProgress(prev => Math.min(prev + progressIncrement, 100));
    }

    // 2. Load meditation data (critical for app)
    try {
      await fetch('/meditations/2025-09.json', { cache: 'force-cache' });
      setLoadingProgress(prev => Math.min(prev + progressIncrement, 100));
    } catch (error) {
      console.warn('Failed to preload meditation data:', error);
      setLoadingProgress(prev => Math.min(prev + progressIncrement, 100));
    }

    // 3. Preload critical app routes
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

    // 4. Load all visual and audio assets with maximum priority
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

  // Start preloading on mount (guard against StrictMode double-invoke)
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    preloadAssets();
  }, [preloadAssets]);

  // Update container transform when index changes
  useEffect(() => {
    if (!containerRef.current || isLoading) return;
    
    // Each slide is 33.33% wide, so move by 33.33% per slide
    const translateX = -index * (100 / steps.length);
    containerRef.current.style.transform = `translateX(${translateX}%)`;
  }, [index, isLoading, steps.length]);

  // Smooth transition functions
  const goNext = useCallback(() => {
    if (isTransitioning) return;
    const now = Date.now();
    if (now - lastNavAtRef.current < 400) return;
    lastNavAtRef.current = now;
    
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 400);
    setIndex(prev => Math.min(prev + 1, steps.length));
  }, [isTransitioning, steps.length]);

  const goBack = useCallback(() => {
    if (isTransitioning) return;
    const now = Date.now();
    if (now - lastNavAtRef.current < 400) return;
    lastNavAtRef.current = now;
    
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 400);
    setIndex(prev => Math.max(prev - 1, 0));
  }, [isTransitioning]);

  const skip = useCallback(() => {
    if (isTransitioning) return;
    setIndex(steps.length);
  }, [isTransitioning, steps.length]);

  // Show loading screen while preloading - using preloaded CSS classes
  if (isLoading) {
    return (
      <>
        <HideBottomNav />
        <div className="loading-screen">
          <div className="loading-content">
            <h2 className="loading-title">
              {t("onboarding.loading.title") || "Preparing your experience..."}
            </h2>
            
            {/* Progress bar using preloaded classes */}
            <div className="loading-progress-bar">
              <div 
                className="loading-progress-fill"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            
            <p className="loading-percentage">
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
      {/* All CSS classes are now preloaded in layout.tsx for instant rendering */}
      {!isLastSlide ? (
        <div 
          className="onboarding-container"
          style={{
            background: 'linear-gradient(135deg, #1b1406 0%, #0e0b05 100%)',
            minHeight: '100svh',
            overflow: 'hidden'
          }}
        >
          {/* Left click area for previous slide */}
          <div
            onClick={goBack}
            className="click-area-left"
            aria-label="Previous slide"
            style={{ pointerEvents: isTransitioning ? 'none' : 'auto' }}
          />
          
          {/* Right click area for next slide */}
          <div
            onClick={goNext}
            className="click-area-right"
            aria-label="Next slide"
            style={{ pointerEvents: isTransitioning ? 'none' : 'auto' }}
          />

          {/* Static slides container that slides horizontally */}
          <div 
            ref={containerRef}
            style={{
              display: 'flex',
              width: `${steps.length * 100}%`,
              height: '100%',
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: 'translateX(0%)',
              willChange: 'transform',
              overflow: 'hidden'
            }}
          >
            {/* Slide 1 */}
            <div style={{ 
              width: `${100 / steps.length}%`, 
              position: 'relative', 
              flexShrink: 0,
              overflow: 'hidden',
              height: '100vh'
            }}>
              <img
                src={resolveSrc('/covers/1stepcorrectnotfinal.webp')}
                alt="Background"
                width={720}
                height={960}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="onboarding-background"
                style={{ transform: "none", zIndex: 1 }}
              />
              <div className="onboarding-content">
                <div className="stack-8" style={{ maxWidth: 720, margin: "0 auto" }}>
                  <h1 className="onboarding-title">{t(steps[0].titleKey)}</h1>
                  <p className="onboarding-subtitle">{t(steps[0].subtitleKey)}</p>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div style={{ 
              width: `${100 / steps.length}%`, 
              position: 'relative', 
              flexShrink: 0, 
              zIndex: 100,
              overflow: 'hidden',
              height: '100vh'
            }}>
              <img
                src={resolveSrc('/covers/2stepnotfinal.webp')}
                alt="Background"
                width={720}
                height={960}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="onboarding-background"
                style={{ transform: "none", zIndex: 100 }}
              />
              <div className="onboarding-content" style={{ zIndex: 101 }}>
                <div className="stack-8" style={{ maxWidth: 720, margin: "0 auto" }}>
                  <h1 className="onboarding-title">{t(steps[1].titleKey)}</h1>
                  <p className="onboarding-subtitle">{t(steps[1].subtitleKey)}</p>
                </div>
              </div>
            </div>

            {/* Slide 3 - Saints grid */}
            <div style={{ 
              width: `${100 / steps.length}%`, 
              position: 'relative', 
              flexShrink: 0,
              overflow: 'hidden',
              height: '100vh',
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)"
            }}>
              {/* Saints images grid - no separate overlay needed */}
              <div className="saints-grid-container">
                <div style={{ maxWidth: 1000, width: "100%" }}>
                   {/* First row - 4 images */}
                   <div className="saints-row saints-row-left">
                     <img loading="eager" decoding="sync" fetchPriority="high" src={resolveSrc('/covers/saitns/Untitled Design.webp')} alt="Saint" width={200} height={200} className="saint-image" style={{ opacity: 1 }} />
                     <img loading="eager" decoding="sync" fetchPriority="high" src={resolveSrc('/covers/saitns/Untitled Design (1).webp')} alt="Saint" width={200} height={200} className="saint-image" style={{ opacity: 0.9 }} />
                     <img loading="eager" decoding="sync" fetchPriority="high" src={resolveSrc('/covers/saitns/Untitled Design (2).webp')} alt="Saint" width={200} height={200} className="saint-image" style={{ opacity: 0.8 }} />
                     <img loading="eager" decoding="sync" fetchPriority="high" src={resolveSrc('/covers/saitns/Untitled Design (3).webp')} alt="Saint" width={200} height={200} className="saint-image" style={{ opacity: 0.7 }} />
                   </div>
                   {/* Second row - 4 images */}
                   <div className="saints-row saints-row-right">
                     <img loading="eager" decoding="sync" fetchPriority="high" src={resolveSrc('/covers/saitns/Untitled Design (4).webp')} alt="Saint" width={200} height={200} className="saint-image" style={{ opacity: 0.6 }} />
                     <img loading="eager" decoding="sync" fetchPriority="high" src={resolveSrc('/covers/saitns/Untitled Design (5).webp')} alt="Saint" width={200} height={200} className="saint-image" style={{ opacity: 0.5 }} />
                     <img loading="eager" decoding="sync" fetchPriority="high" src={resolveSrc('/covers/saitns/Untitled Design (6).webp')} alt="Saint" width={200} height={200} className="saint-image" style={{ opacity: 0.4 }} />
                     <img loading="eager" decoding="sync" fetchPriority="high" src={resolveSrc('/covers/saitns/Untitled Design (7).webp')} alt="Saint" width={200} height={200} className="saint-image" style={{ opacity: 0.3 }} />
                   </div>
                   {/* Third row - 4 images */}
                   <div className="saints-row saints-row-left-delayed">
                     <img loading="eager" decoding="sync" fetchPriority="high" src={resolveSrc('/covers/saitns/Untitled Design (8).webp')} alt="Saint" width={200} height={200} className="saint-image" style={{ opacity: 0.2 }} />
                     <img loading="eager" decoding="sync" fetchPriority="high" src={resolveSrc('/covers/saitns/Untitled Design (9).webp')} alt="Saint" width={200} height={200} className="saint-image" style={{ opacity: 0.15 }} />
                     <img loading="eager" decoding="sync" fetchPriority="high" src={resolveSrc('/covers/saitns/Untitled Design (10).webp')} alt="Saint" width={200} height={200} className="saint-image" style={{ opacity: 0.1 }} />
                     <img loading="eager" decoding="sync" fetchPriority="high" src={resolveSrc('/covers/saitns/Untitled Design (11).webp')} alt="Saint" width={200} height={200} className="saint-image" style={{ opacity: 0.05 }} />
                   </div>
                </div>
              </div>
              
              {/* Content */}
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
                  <h1 style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: -0.3, margin: "0 0 5px 0", fontWeight: 800, color: "#ffffff" }}>
                    {t(steps[2].titleKey)}
                  </h1>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
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
                    
                    <div style={{ flexShrink: 0 }}>
                      <img 
                        src={resolveSrc('/covers/subscrimage.webp')}
                        alt="Subscription"
                        width={120}
                        height={120}
                        style={{ width: "120px", height: "auto", borderRadius: "8px", objectFit: "cover" }}
                      />
                    </div>
                  </div>

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
                      <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", textDecoration: "line-through", marginRight: "8px" }}>$9.99</span>
                      <span style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>$4.99</span>
                      <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", marginLeft: "4px" }}>/month</span>
                    </div>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
                      🔥 50% OFF • Cancel anytime • 7-day free trial
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress dots header */}
          {index !== 2 && (
            <div className="progress-dots">
            <div className="row" style={{ justifyContent: "center", gap: 6 }}>
              {Array.from({ length: steps.length }).map((_, i) => {
                const active = i === index;
                const done = i < index;
                return (
                  <span
                    key={i}
                    aria-hidden
                    className={`progress-dot ${
                      active ? 'progress-dot-active' : 
                      done ? 'progress-dot-done' : 
                      'progress-dot-inactive'
                    }`}
                  />
                );
              })}
            </div>
            </div>
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
