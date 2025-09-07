## Meditations – Telegram Mini Web App

Lightweight Next.js app for daily audio meditations (morning/evening), optimized for Telegram Mini Apps. Uses Telegram init for auth, cloud-inspired minimal UI, and static JSON for catalog.

### Run locally
```bash
npm run dev
# http://localhost:3000
```

### App structure
- `src/app/`
  - `page.tsx` – Today screen (morning/evening actions)
  - `calendar/page.tsx` – Calendar + Profile (theme switcher)
  - `favorites/page.tsx` – Saved meditations placeholder
  - `meditation/[id]/page.tsx` – Full-screen cover + audio controls
  - `admin/page.tsx` – Localhost-only admin (CRUD)
  - `api/admin/meditations/route.ts` – JSON CRUD API for meditations
  - `globals.css` – imports theme
- `src/components/`
  - `TelegramProvider.tsx` – Loads Telegram WebApp SDK, exposes context
  - `ThemeProvider.tsx` – Light/Dark with localStorage
  - `BottomNav.tsx` – Minimal 3-tab nav (Today/Calendar/Favorites)
  - `UI.tsx` – Card/Button primitives
  - `AudioPlayer.tsx` – Audio with resume, overlay controls
  - `HideBottomNav.tsx` – Hides nav on media screens
- `src/styles/theme.css` – Centralized variables, utilities, components, dark mode
- `src/lib/`
  - `i18n.ts` – simple t() helper
  - `meditations.ts` – types + loader for month JSON
  - `server/meditations-admin.ts` – fs-based CRUD helpers

### Public content
- `public/meditations/`
  - `schema.json` – JSON schema for meditations
  - `YYYY-MM.json` – Monthly meditations (morning/evening per day)
  - `audio/` – Audio files (e.g., `1-sept-meditation.mp3`)
  - `covers/` – Cover images (e.g., `1-sept-light-cover.webp`)

Example `public/meditations/2025-09.json` item:
```json
{
  "id": "2025-09-01-morning",
  "day": "2025-09-01",
  "title": "Morning Calm",
  "text": "A gentle breath practice to begin your day.",
  "about": "Focus on slow inhales and longer exhales to center attention.",
  "audio": "/meditations/audio/1-sept-meditation.mp3",
  "cover": "/meditations/covers/1-sept-light-cover.webp",
  "type": "morning"
}
```

### Admin (localhost only)
- UI: `http://localhost:3000/admin`
- API: `/api/admin/meditations`
- Middleware restricts access to localhost: see `middleware.ts`.

### Theming
- Theme controlled via `ThemeProvider` → sets `html[data-theme]` and `color-scheme`.
- Dark/light styles defined in `src/styles/theme.css`.

### Telegram integration
- `TelegramProvider` loads `https://telegram.org/js/telegram-web-app.js`, calls `ready()`, and respects user theme when set.
