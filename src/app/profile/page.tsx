"use client";
import { useTheme } from "@/components/ThemeProvider";

export default function ProfilePage() {
  const { theme, setTheme, toggle } = useTheme();
  return (
    <div className="container stack-12">
      <div className="card" style={{ padding: 16 }}>
        <strong>Profile</strong>
        <div className="muted small">Telegram-based sign-in handled automatically.</div>
      </div>

      <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <strong>Theme</strong>
          <div className="muted small">Current: {theme}</div>
        </div>
        <div className="row">
          <button className="button-ghost" onClick={() => setTheme("light")}>Light</button>
          <button className="button-ghost" onClick={() => setTheme("dark")}>Dark</button>
          <button className="button-secondary" onClick={toggle}>Toggle</button>
        </div>
      </div>
    </div>
  );
}


