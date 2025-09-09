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
            <video
              src="/covers/1stepback.mp4"
              autoPlay
              muted
              playsInline
              loop={false}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : index === 1 ? (
            <img
              src="/covers/2stepbg.png"
              alt="Step 2 background"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(4px)" }}
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
              background: "linear-gradient(rgba(0,0,0,0.3), transparent)",
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
            // Step 2: 3 cards layout with title at bottom
            <>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: "240px",
                  padding: "0 20px",
                }}
              >
                <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
                  <div className="stack-12">
                    <Card style={{ 
                      padding: 0, 
                      background: "transparent", 
                      border: "2px solid white",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      backgroundImage: "url(/covers/2.1.png)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      borderRadius: "12px",
                      overflow: "hidden",
                      height: "130px",
                      width: "80%",
                      margin: "0 auto"
                    }}>
                      <div style={{ display: "flex", height: "100%" }}>
                        <div style={{ width: "40%" }}></div>
                        <div style={{ width: "60%", padding: 16, display: "flex", alignItems: "flex-start" }}>
                          <div className="stack-8">
                            <p style={{ margin: 0, color: "#0b1b34", opacity: 0.8 }}>Daily readings rooted in Orthodox faith</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card style={{ 
                      padding: 0, 
                      background: "transparent", 
                      border: "2px solid white",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      backgroundImage: "url(/covers/2.2.png)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      borderRadius: "12px",
                      overflow: "hidden",
                      height: "130px",
                      width: "80%",
                      margin: "0 auto"
                    }}>
                      <div style={{ display: "flex", height: "100%" }}>
                        <div style={{ width: "40%" }}></div>
                        <div style={{ width: "60%", padding: 16, display: "flex", alignItems: "center" }}>
                          <div className="stack-8">
                            <p style={{ margin: 0, color: "#0b1b34", opacity: 0.8 }}>Sacred music and hymns for peaceful reflection</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card style={{ 
                      padding: 0, 
                      background: "transparent", 
                      border: "2px solid white",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      backgroundImage: "url(/covers/2.3.png)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      borderRadius: "12px",
                      overflow: "hidden",
                      height: "130px",
                      width: "80%",
                      margin: "0 auto"
                    }}>
                      <div style={{ display: "flex", height: "100%" }}>
                        <div style={{ width: "40%" }}></div>
                        <div style={{ width: "60%", padding: 16, display: "flex", alignItems: "center" }}>
                          <div className="stack-8">
                            <p style={{ margin: 0, color: "#0b1b34", opacity: 0.8 }}>Ancient practices for modern spiritual growth</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
              
              {/* Title overlay at bottom - same as other steps */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
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
                      color: "#ffffff",
                    }}
                  >
                    {t(steps[index].titleKey)}
                  </h1>
                  <p
                    style={{
                      margin: 0,
                      color: "rgba(255,255,255,0.9)",
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
            // Other steps: Text overlay at bottom
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
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
                    color: "#ffffff",
                  }}
                >
                  {t(steps[index].titleKey)}
                </h1>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 16,
                    lineHeight: 1.4,
                  }}
                >
                  {t(steps[index].subtitleKey)}
                </p>
              </div>
            </div>
          )}
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
          background: "linear-gradient(transparent, rgba(0,0,0,0.3))",
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
