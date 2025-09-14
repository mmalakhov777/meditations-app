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
      // Check if modern API is available (Bot API 8.0+)
      if (webApp.isVersionAtLeast && webApp.isVersionAtLeast('8.0')) {
        if (webApp.viewport?.requestFullscreen?.isAvailable?.()) {
          webApp.viewport.requestFullscreen();
          return true;
        }
      }
      
      // Fallback to legacy API
      if (webApp.requestFullscreen && typeof webApp.requestFullscreen === 'function') {
        webApp.requestFullscreen();
        return true;
      }
      
      console.warn('Fullscreen not available in this Telegram version');
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
    
    // Check modern API
    if (webApp.isVersionAtLeast && webApp.isVersionAtLeast('8.0')) {
      return webApp.viewport?.requestFullscreen?.isAvailable?.() ?? false;
    }
    
    // Check legacy API
    return typeof webApp.requestFullscreen === 'function';
  }, [webApp, isTelegram]);

  return {
    requestFullscreen,
    exitFullscreen,
    isFullscreenAvailable,
    isFullscreen: webApp?.isFullscreen ?? false,
  };
}
