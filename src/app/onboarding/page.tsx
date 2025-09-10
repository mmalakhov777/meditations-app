"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { Card, Button, H1, Subtle } from "@/components/UI";
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
  ], []);

  const [index, setIndex] = useState(0);
  const isLastSlide = index >= steps.length;

  const goNext = () => setIndex(prev => Math.min(prev + 1, steps.length));
  const goBack = () => setIndex(prev => Math.max(prev - 1, 0));
  const skip = () => setIndex(steps.length);

  return (
    <>
      <HideBottomNav />
      {!isLastSlide ? (
        <div style={{ position: "fixed", inset: 0 }}>
          {index === 0 ? (
            <>
               {/* Background image */}
               <img
                 src="/covers/1stepnew.png"
                 alt="Step 1 background"
                 style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
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
          ) : index === 1 ? (
            <video
              src="/covers/2stepback.mp4"
              autoPlay
              muted
              playsInline
              loop={false}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: steps[index].gradient }} />
          )}

          {/* Progress dots header */}
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

          {/* Content overlay */}
          {index === 1 ? (
            // Step 2: Title overlay at bottom - no cards
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "calc(env(safe-area-inset-top) + 20px) 20px 100px",
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
          ) : index === 2 ? (
            // Step 3: Saints images grid above text
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
                  <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 4 }}>
                    <img src="/covers/saitns/Untitled Design.png" alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 1 }} />
                    <img src="/covers/saitns/Untitled Design (1).png" alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.9 }} />
                    <img src="/covers/saitns/Untitled Design (2).png" alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.8 }} />
                    <img src="/covers/saitns/Untitled Design (3).png" alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.7 }} />
                  </div>
                  {/* Second row - 4 images */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 4 }}>
                    <img src="/covers/saitns/Untitled Design (4).png" alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.6 }} />
                    <img src="/covers/saitns/Untitled Design (5).png" alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.5 }} />
                    <img src="/covers/saitns/Untitled Design (6).png" alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.4 }} />
                    <img src="/covers/saitns/Untitled Design (7).png" alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.3 }} />
                  </div>
                  {/* Third row - 4 images */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                    <img src="/covers/saitns/Untitled Design (8).png" alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.2 }} />
                    <img src="/covers/saitns/Untitled Design (9).png" alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.15 }} />
                    <img src="/covers/saitns/Untitled Design (10).png" alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.1 }} />
                    <img src="/covers/saitns/Untitled Design (11).png" alt="Saint" style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover", border: "3px solid white", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", opacity: 0.05 }} />
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
          ) : index !== 0 ? (
            // Other steps (not first): Text overlay at bottom
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "calc(env(safe-area-inset-top) + 20px) 20px 100px",
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
          ) : null}
        </div>
      ) : (
        <div className="container stack-16" style={{ paddingTop: 24 }}>
          <Card style={{ padding: 20 }}>
            <div className="stack-12" style={{ padding: "0 4px" }}>
              <H1>{t("onboarding.cta.title")}</H1>
              <Subtle>{t("onboarding.cta.subtitle")}</Subtle>
              <div className="row" style={{ gap: 10 }}>
                <Link href="/" className="button">{t("onboarding.start")}</Link>
              </div>
            </div>
          </Card>
        </div>
      )}

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
          {!isLastSlide ? (
            <Button onClick={goNext} style={{ width: "100%" }}>{t("onboarding.next")}</Button>
          ) : (
            <Link href="/" className="button" style={{ width: "100%", display: "block", textAlign: "center" }}>{t("onboarding.start")}</Link>
          )}
        </div>
      </div>
    </>
  );
}
