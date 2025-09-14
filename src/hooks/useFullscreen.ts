"use client";

import { useTelegram } from "@/components/TelegramProvider";
import { useCallback } from "react";

export function useFullscreen() {
  const { webApp, isTelegram } = useTelegram();

  const requestFullscreen = useCallback(() => {
    if (!isTelegram || !webApp) {
      console.warn('Fullscreen only available in Telegram WebApp');
      return false;
    }

    try {
      if (webApp.requestFullscreen && typeof webApp.requestFullscreen === 'function') {
        webApp.requestFullscreen();
        return true;
      }
      
      console.warn('Fullscreen not available');
      return false;
    } catch (error) {
      console.error('Error requesting fullscreen:', error);
      return false;
    }
  }, [webApp, isTelegram]);

  const exitFullscreen = useCallback(() => {
    if (!isTelegram || !webApp) return false;

    try {
      if (webApp.exitFullscreen && typeof webApp.exitFullscreen === 'function') {
        webApp.exitFullscreen();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
      return false;
    }
  }, [webApp, isTelegram]);

  const isFullscreenAvailable = useCallback(() => {
    if (!isTelegram || !webApp) return false;
    
    return typeof webApp.requestFullscreen === 'function';
  }, [webApp, isTelegram]);

  return {
    requestFullscreen,
    exitFullscreen,
    isFullscreenAvailable,
    isFullscreen: webApp?.isFullscreen ?? false,
  };
}
