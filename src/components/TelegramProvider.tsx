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
  // Version checking
  isVersionAtLeast?: (version: string) => boolean;
  // Header color
  setHeaderColor?: (color: string) => void;
  // Viewport API for fullscreen (Bot API 8.0+)
  viewport?: {
    requestFullscreen?: {
      isAvailable?: () => boolean;
    } & (() => void);
  };
  // Legacy fullscreen controls (for backwards compatibility)
  requestFullscreen?: () => void;
  exitFullscreen?: () => void;
  isFullscreen?: boolean;
  // Event handling
  onEvent?: (eventType: string, callback: () => void) => void;
  offEvent?: (eventType: string, callback: () => void) => void;
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
      
      // Try to request fullscreen using the modern API (Bot API 8.0+)
      if (app.isVersionAtLeast && app.isVersionAtLeast('8.0')) {
        if (app.viewport?.requestFullscreen?.isAvailable?.()) {
          // Use the new viewport API
          app.viewport.requestFullscreen();
        } else if (app.requestFullscreen && typeof app.requestFullscreen === 'function') {
          // Fallback to legacy API
          app.requestFullscreen();
        }
      } else {
        console.info('Fullscreen mode requires Telegram WebApp version 8.0 or higher');
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


