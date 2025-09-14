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
      // Check if Bot API 8.0+ is available
      if (webApp.isVersionAtLeast && webApp.isVersionAtLeast('8.0')) {
        if (webApp.requestFullscreen && typeof webApp.requestFullscreen === 'function') {
          webApp.requestFullscreen();
          return true;
        }
      } else {
        // Manual version check for older clients without isVersionAtLeast
        const version = webApp.version || '0.0';
        const [major] = version.split('.').map(Number);
        if (major >= 8 && webApp.requestFullscreen) {
          webApp.requestFullscreen();
          return true;
        }
      }
      
      console.warn('Fullscreen requires Telegram WebApp version 8.0 or higher');
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
    
    // Check if Bot API 8.0+ is available
    if (webApp.isVersionAtLeast && webApp.isVersionAtLeast('8.0')) {
      return typeof webApp.requestFullscreen === 'function';
    }
    
    // Manual version check for older clients
    const version = webApp.version || '0.0';
    const [major] = version.split('.').map(Number);
    return major >= 8 && typeof webApp.requestFullscreen === 'function';
  }, [webApp, isTelegram]);

  return {
    requestFullscreen,
    exitFullscreen,
    isFullscreenAvailable,
    isFullscreen: webApp?.isFullscreen ?? false,
  };
}
