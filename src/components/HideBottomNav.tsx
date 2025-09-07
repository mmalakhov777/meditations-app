"use client";

import { useEffect } from "react";

export function HideBottomNav() {
  useEffect(() => {
    document.documentElement.classList.add("hide-bottom-nav");
    return () => { document.documentElement.classList.remove("hide-bottom-nav"); };
  }, []);
  return null;
}


