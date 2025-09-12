"use client";
import { useTelegram } from "@/components/TelegramProvider";
import { t } from "@/lib/i18n";

export default function FavoritesPage() {
  const { webApp, isTelegram } = useTelegram();
  const user = webApp?.initDataUnsafe.user;

  return (
    <div className="container" style={{ display: "grid", gap: 12 }}>
      {/* Profile header moved here */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="row">
            <div className="avatar-44" />
            <div className="stack-8">
              <strong>{user?.first_name ?? t("user.guest")}</strong>
              <span className="muted small">{isTelegram ? t("source.telegram") : t("source.web")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <strong>Favorites</strong>
        <div className="muted" style={{ fontSize: 12 }}>Saved meditations will appear here.</div>
      </div>
    </div>
  );
}


