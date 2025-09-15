import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TelegramProvider } from "@/components/TelegramProvider";
import { BottomNav } from "@/components/BottomNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TelegramViewportHandler } from "@/components/TelegramViewportHandler";
import type { Viewport } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevent FOIT/FOUT
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Prevent FOIT/FOUT
  preload: true,
});

export const metadata: Metadata = {
  title: "Meditations - Orthodox Daily Practice",
  description: "Daily Orthodox meditations with saints and spiritual guidance",
  keywords: "orthodox, meditation, saints, spiritual, daily practice",
  authors: [{ name: "Meditations App" }],
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/_next/static/media/geist-sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/_next/static/media/geist-mono.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Critical CSS inlined to prevent layout shift */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            :root {
              --color-bg: #ffffff;
              --color-fg: #0b1b34;
              --color-accent: #e6c15a;
              --color-accent-contrast: #0b1b34;
              --radius: 12px;
              --shadow: 0 6px 20px rgba(11, 27, 52, 0.06);
              --glass: rgba(255,255,255,0.5);
              --glass-border: rgba(11,27,52,0.06);
              --gold-1: #fff7d1;
              --gold-2: #f5dc8a;
              --gold-3: #e9c25a;
              --gold-4: #caa43b;
              --gold-5: #a98522;
              --gold-shadow: rgba(233, 194, 90, 0.32);
            }
            
            html[data-theme="dark"]:root {
              --color-bg: #000000;
              --color-fg: #ffffff;
              --color-accent: #f0c75e;
              --color-accent-contrast: #000000;
            }
            
            * {
              box-sizing: border-box;
              padding: 0;
              margin: 0;
            }
            
            html, body {
              max-width: 100vw;
              overflow-x: hidden;
              font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            body {
              background: var(--color-bg);
              color: var(--color-fg);
            }
            
            .app-shell { 
              position: fixed; 
              inset: 0; 
              display: flex; 
              flex-direction: column; 
            }
            
            .app-content { 
              flex: 1 1 auto; 
              overflow: auto; 
              -webkit-overflow-scrolling: touch; 
            }
            
            .cloud-bg {
              position: fixed;
              inset: 0;
              background: radial-gradient(900px 500px at 50% -10%, rgba(240,248,255,0.7), transparent 60%), linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
              filter: saturate(1.0);
              z-index: -1;
            }
            
            html[data-theme="dark"] .cloud-bg {
              background: radial-gradient(900px 500px at 50% -10%, rgba(10,10,10,0.7), transparent 60%), linear-gradient(180deg, #050505 0%, #000000 60%);
              filter: saturate(1.0);
            }
            
            .container {
              max-width: 720px;
              margin: 0 auto;
              padding: calc(64px + env(safe-area-inset-top)) 16px 88px;
            }
            
            .stack-8 { display: grid; gap: 8px; }
            .stack-12 { display: grid; gap: 12px; }
            .stack-16 { display: grid; gap: 16px; }
            .row { display: flex; align-items: center; gap: 12px; }
            .small { font-size: 12px; }
            
            .card {
              background: rgba(255,255,255,0.6);
              backdrop-filter: blur(8px) saturate(1.05);
              border: 1px solid var(--glass-border);
              border-radius: var(--radius);
              box-shadow: var(--shadow);
            }
            
            html[data-theme="dark"] .card {
              background: rgba(10,10,10,0.8);
              backdrop-filter: blur(8px) saturate(1.05);
              border-color: rgba(240, 199, 94, 0.2);
            }
            
            .h1 { 
              font-size: 28px; 
              line-height: 1.1; 
              letter-spacing: -0.3px; 
              margin: 0 0 10px; 
              font-weight: 800; 
            }
            
            .muted {
              color: color-mix(in oklab, var(--color-fg) 65%, transparent);
            }
            
            html[data-theme="dark"] .muted {
              color: color-mix(in oklab, var(--color-fg) 85%, transparent);
            }
            
            a {
              color: inherit;
              text-decoration: none;
            }
            
            /* Home page specific styles */
            .saint-hero-container {
              position: relative;
              width: 100vw;
              margin-left: calc(50% - 50vw);
            }
            .saint-hero-wrapper {
              width: 100%;
              aspect-ratio: 3 / 4;
              position: relative;
            }
            .saint-hero-image {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .hero-controls {
              position: absolute;
              top: calc(env(safe-area-inset-top) + 64px);
              right: 16px;
              display: flex;
              gap: 8px;
              align-items: center;
            }
            .hero-overlay {
              position: absolute;
              left: 12px;
              right: 12px;
              bottom: 12px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              gap: 12px;
              background: var(--glass);
              border: 1px solid var(--glass-border);
              backdrop-filter: blur(8px) saturate(1.05);
              border-radius: 12px;
              padding: 12px;
            }
            .meditation-card-container {
              display: flex;
              align-items: center;
              min-height: 120px;
            }
            .meditation-image-wrapper {
              flex: 0 0 30%;
              height: 120px;
              position: relative;
            }
            .meditation-content {
              flex: 1;
              padding: 20px;
            }
            .play-button-wrapper {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 64px;
              height: 64px;
              z-index: 10;
            }
            
            /* Onboarding specific styles - preloaded for instant rendering */
            .onboarding-container {
              position: fixed;
              inset: 0;
              background: #000000;
              display: flex;
              flex-direction: column;
            }
            
            .onboarding-background {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .onboarding-content {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              padding: calc(env(safe-area-inset-top) + 20px) 20px 180px;
              z-index: 20;
            }
            
            .saints-grid-container {
              position: absolute;
              top: -60px;
              left: 0;
              right: 0;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              padding: calc(env(safe-area-inset-top)) 20px 20px;
              z-index: 10;
            }
            
            .saints-row {
              display: flex;
              justify-content: center;
              gap: 4px;
              margin-bottom: 4px;
              will-change: transform;
            }
            
            .saints-row-left {
              animation-name: rowDriftLeft;
              animation-duration: 1200ms;
              animation-timing-function: ease-out;
              animation-delay: 60ms;
              animation-fill-mode: forwards;
            }
            
            .saints-row-right {
              animation-name: rowDriftRight;
              animation-duration: 1400ms;
              animation-timing-function: ease-out;
              animation-delay: 120ms;
              animation-fill-mode: forwards;
            }
            
            .saints-row-left-delayed {
              animation-name: rowDriftLeft;
              animation-duration: 1600ms;
              animation-timing-function: ease-out;
              animation-delay: 180ms;
              animation-fill-mode: forwards;
            }
            
            .saint-image {
              width: 200px;
              height: 200px;
              border-radius: 0;
              object-fit: cover;
              border: 3px solid;
              border-image: linear-gradient(135deg, #f0c75e 0%, #e9c25a 50%, #caa43b 100%) 1;
              box-shadow: 0 8px 32px rgba(0,0,0,0.3);
              display: block;
              background-color: rgba(255,255,255,0.1);
            }
            
            .progress-dots {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              padding: calc(env(safe-area-inset-top) + 20px) 20px 100px;
              z-index: 10;
              display: flex;
              justify-content: center;
              gap: 6px;
            }
            
            .progress-dot {
              width: 8px;
              height: 8px;
              border-radius: 999px;
            }
            
            .progress-dot-active {
              background: #ffffff;
              box-shadow: 0 0 0 4px rgba(255,255,255,0.3);
            }
            
            .progress-dot-done {
              background: rgba(255,255,255,0.8);
            }
            
            .progress-dot-inactive {
              background: rgba(255,255,255,0.3);
            }
            
            .fixed-bottom-controls {
              position: fixed;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 40;
            }
            
            .bottom-controls-container {
              max-width: 720px;
              margin: 0 auto;
              padding: 20px 16px calc(12px + env(safe-area-inset-bottom));
            }
            
            .onboarding-title {
              font-size: 28px;
              line-height: 1.1;
              letter-spacing: -0.3px;
              margin: 0;
              font-weight: 800;
              color: #ffffff;
            }
            
            .onboarding-subtitle {
              margin: 0;
              color: rgba(255,255,255,0.8);
              font-size: 16px;
              line-height: 1.4;
            }
            
            .onboarding-bullet-point {
              display: flex;
              align-items: flex-start;
              gap: 12px;
            }
            
            .onboarding-bullet {
              color: #f0c75e;
              font-size: 16px;
              margin-top: 6px;
            }
            
            .onboarding-bullet-text {
              margin: 0;
              color: rgba(255,255,255,0.8);
              font-size: 15px;
              line-height: 1.4;
            }
            
            .onboarding-bullet-strong {
              color: #ffffff;
            }
            
            .subscription-image {
              width: 120px;
              height: auto;
              border-radius: 8px;
              object-fit: cover;
            }
            
            .pricing-card {
              text-align: center;
              padding: 16px 20px;
              background: linear-gradient(135deg, rgba(240, 199, 94, 0.15) 0%, rgba(233, 194, 90, 0.1) 100%);
              border: 1px solid rgba(240, 199, 94, 0.3);
              border-radius: 16px;
              backdrop-filter: blur(10px);
              margin-top: -30px;
            }
            
            .pricing-old-price {
              font-size: 16px;
              color: rgba(255,255,255,0.6);
              text-decoration: line-through;
              margin-right: 8px;
            }
            
            .pricing-new-price {
              font-size: 28px;
              font-weight: 800;
              color: #ffffff;
            }
            
            .pricing-period {
              font-size: 14px;
              color: rgba(255,255,255,0.8);
              margin-left: 4px;
            }
            
            .pricing-description {
              margin: 0;
              color: rgba(255,255,255,0.8);
              font-size: 12px;
            }
            
            .gradient-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%);
              z-index: 15;
            }
            
            .click-area-left {
              position: absolute;
              left: 0;
              top: 0;
              width: 50%;
              height: 100%;
              z-index: 30;
              cursor: pointer;
            }
            
            .click-area-right {
              position: absolute;
              right: 0;
              top: 0;
              width: 50%;
              height: 100%;
              z-index: 30;
              cursor: pointer;
            }
            
            /* Onboarding animations */
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
            
            /* Loading screen styles */
            .loading-screen {
              position: fixed;
              inset: 0;
              background: linear-gradient(135deg, #e6c15a 0%, #f0c75e 50%, #fff7d1 100%);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 20px;
            }
            
            .loading-content {
              text-align: center;
              max-width: 300px;
              width: 100%;
            }
            
            .loading-title {
              color: #0b1b34;
              margin-bottom: 32px;
              font-size: 24px;
              font-weight: 700;
            }
            
            .loading-progress-bar {
              width: 100%;
              height: 8px;
              background-color: rgba(11,27,52,0.2);
              border-radius: 4px;
              overflow: hidden;
              margin-bottom: 16px;
            }
            
            .loading-progress-fill {
              height: 100%;
              background-color: #0b1b34;
              border-radius: 4px;
              transition: width 0.3s ease;
            }
            
            .loading-percentage {
              color: rgba(11,27,52,0.7);
              font-size: 14px;
              margin: 0;
            }

            /* Rows optimize for transform animations */
            .saints-row { will-change: transform; transform: translateZ(0); }
            .saints-row-left, .saints-row-right, .saints-row-left-delayed { animation-play-state: paused; }
            .animate .saints-row-left, .animate .saints-row-right, .animate .saints-row-left-delayed { animation-play-state: running; }

            /* Keep pre-mounted nodes decoded but invisible */
            .preload-hidden {
              position: absolute;
              top: -10000px;
              left: -10000px;
              visibility: hidden;
              pointer-events: none;
            }

            /* Prevent animations from running before reveal */
            .preload-hidden .saints-row-left,
            .preload-hidden .saints-row-right,
            .preload-hidden .saints-row-left-delayed {
              animation: none !important;
            }
          `
        }} />
        
        {/* Preload ALL onboarding images for instant rendering */}
        {/* Background images */}
        <link rel="preload" as="image" href="/covers/1stepcorrectnotfinal.webp" />
        <link rel="preload" as="image" href="/covers/2stepnotfinal.webp" />
        <link rel="preload" as="image" href="/covers/subscrimage.webp" />
        
        {/* All saint images used in onboarding */}
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design.webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (1).webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (2).webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (3).webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (4).webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (5).webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (6).webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (7).webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (8).webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (9).webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (10).webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (11).webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (12).webp" />
        <link rel="preload" as="image" href="/covers/saitns/Untitled Design (13).webp" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Resource hints for better loading */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Prevent layout shift with loading skeleton */}
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <TelegramProvider>
            <TelegramViewportHandler />
            <div className="app-shell">
              <div className="cloud-bg" />
              <main className="app-content">{children}</main>
              <BottomNav />
            </div>
          </TelegramProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
