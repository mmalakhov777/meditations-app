"use client";

import { useEffect } from "react";
import { useTelegram } from "@/components/TelegramProvider";

export default function TelegramBackButton() {
  const { webApp, isTelegram } = useTelegram();

  useEffect(() => {
    if (!isTelegram || !webApp) return;
    try {
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => {
        // Prefer native close if no history, else go back
        if (window.history.length <= 1) {
          try { webApp.close(); } catch {}
        } else {
          window.history.back();
        }
      });
    } catch {}
    return () => {
      try { webApp.BackButton.hide(); } catch {}
    };
  }, [isTelegram, webApp]);

  return null;
}


