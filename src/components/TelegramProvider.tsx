"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Script from "next/script";

type TelegramWebApp = {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    auth_date?: string;
    hash?: string;
    [key: string]: unknown;
  };
  colorScheme?: "light" | "dark";
  themeParams?: Record<string, string>;
  ready: () => void;
  expand: () => void;
  close: () => void;
  version: string;
  // Version checking
  isVersionAtLeast?: (version: string) => boolean;
  // Header color
  setHeaderColor?: (color: string) => void;
  // Fullscreen controls (Bot API 8.0+)
  requestFullscreen?: () => void;
  exitFullscreen?: () => void;
  isFullscreen?: boolean;
  // Event handling for fullscreen
  onEvent?: (eventType: 'fullscreen_changed' | 'fullscreen_failed' | 'viewportChanged' | string, callback: (event?: any) => void) => void;
  offEvent?: (eventType: 'fullscreen_changed' | 'fullscreen_failed' | 'viewportChanged' | string, callback: (event?: any) => void) => void;
  BackButton: { show: () => void; hide: () => void; onClick: (cb: () => void) => void };
  MainButton: { setText: (t: string) => void; show: () => void; hide: () => void; onClick: (cb: () => void) => void };
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

type TelegramContextValue = {
  webApp: TelegramWebApp | null;
  isTelegram: boolean;
};

const TelegramContext = createContext<TelegramContextValue>({ webApp: null, isTelegram: false });

export function useTelegram() {
  return useContext(TelegramContext);
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const isTelegram = useMemo(() => typeof window !== "undefined" && !!window.Telegram?.WebApp, []);

  useEffect(() => {
    if (!window?.Telegram?.WebApp) return;
    const app = window.Telegram.WebApp;
    try {
      app.ready();
      app.expand();
      
      // Set header color for better visibility in fullscreen
      if (app.setHeaderColor) {
        const isDark = app.colorScheme === 'dark';
        app.setHeaderColor(isDark ? '#000000' : '#ffffff');
      }
      
      // Set up fullscreen event listeners first
      if (app.onEvent) {
        app.onEvent('fullscreen_changed', (event) => {
          console.log('Fullscreen changed:', event?.is_fullscreen ? 'entered' : 'exited');
        });
        
        app.onEvent('fullscreen_failed', (event) => {
          if (event?.error === 'UNSUPPORTED') {
            console.warn('Fullscreen mode is not supported on this device or platform');
          } else if (event?.error === 'ALREADY_FULLSCREEN') {
            console.info('The Mini App is already in fullscreen mode');
          } else {
            console.error('Fullscreen request failed:', event?.error);
          }
        });
      }
      
      // Try to request fullscreen using the correct API (Bot API 8.0+)
      if (app.isVersionAtLeast && app.isVersionAtLeast('8.0')) {
        if (app.requestFullscreen && typeof app.requestFullscreen === 'function') {
          app.requestFullscreen();
        }
      } else {
        // Check version manually for older clients
        const version = app.version || '0.0';
        const [major] = version.split('.').map(Number);
        if (major >= 8 && app.requestFullscreen) {
          app.requestFullscreen();
        } else {
          console.info('Fullscreen mode requires Telegram WebApp version 8.0 or higher');
        }
      }
    } catch (error) {
      console.warn('Telegram WebApp initialization error:', error);
    }
    setWebApp(app);

    // Respect user's theme choice if set by ThemeProvider. Only apply if none is set.
    const current = document.documentElement.dataset.theme as "light" | "dark" | undefined;
    if (!current) {
      const scheme = app.colorScheme || "light";
      document.documentElement.dataset.theme = scheme;
    }
  }, []);

  return (
    <>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
      <TelegramContext.Provider value={{ webApp, isTelegram }}>{children}</TelegramContext.Provider>
    </>
  );
}


