"use client";

import { useEffect } from "react";

export function TelegramViewportHandler() {
  useEffect(() => {
    // This effect runs only on the client side after hydration
    // It ensures Telegram viewport properties are set after React has hydrated
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      // Set up viewport handling for Telegram
      
      // Set viewport properties that Telegram expects
      const root = document.documentElement;
      root.style.setProperty('--tg-viewport-height', '100vh');
      root.style.setProperty('--tg-viewport-stable-height', '100vh');
      
      // Update when viewport changes
      const updateViewport = () => {
        root.style.setProperty('--tg-viewport-height', `${window.innerHeight}px`);
        root.style.setProperty('--tg-viewport-stable-height', `${window.innerHeight}px`);
      };
      
      window.addEventListener('resize', updateViewport);
      
      return () => {
        window.removeEventListener('resize', updateViewport);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
