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
  const isTelegram = useMemo(() => typeof window !== "undefined" && !!window.Telegram?.WebApp, [webApp]);

  useEffect(() => {
    if (!window?.Telegram?.WebApp) return;
    const app = window.Telegram.WebApp;
    try {
      app.ready();
      app.expand();
    } catch {}
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
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      <TelegramContext.Provider value={{ webApp, isTelegram }}>{children}</TelegramContext.Provider>
    </>
  );
}


