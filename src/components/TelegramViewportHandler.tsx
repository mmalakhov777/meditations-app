"use client";

import { useEffect } from "react";

export function TelegramViewportHandler() {
  useEffect(() => {
    // This effect runs only on the client side after hydration
    // It ensures Telegram viewport properties are set after React has hydrated
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      // Set viewport properties that Telegram expects
      const root = document.documentElement;
      
      const updateViewport = () => {
        const height = window.innerHeight;
        root.style.setProperty('--tg-viewport-height', `${height}px`);
        root.style.setProperty('--tg-viewport-stable-height', `${height}px`);
        
        // Ensure body takes full height
        document.body.style.height = `${height}px`;
        document.body.style.minHeight = `${height}px`;
      };
      
      // Initial viewport setup
      updateViewport();
      
      // Listen for viewport changes
      window.addEventListener('resize', updateViewport);
      window.addEventListener('orientationchange', updateViewport);
      
      // Listen for Telegram-specific events if available
      if (webApp.onEvent) {
        webApp.onEvent('viewportChanged', updateViewport);
      }
      
      return () => {
        window.removeEventListener('resize', updateViewport);
        window.removeEventListener('orientationchange', updateViewport);
        if (webApp.offEvent) {
          webApp.offEvent('viewportChanged', updateViewport);
        }
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
