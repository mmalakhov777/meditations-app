# Deployment Guide - Render

## Quick Deploy Steps:

### 1. **Push to GitHub**
```bash
git add .
git commit -m "Add Telegram bot integration"
git push origin main
```

### 2. **Deploy on Render**
1. Go to [render.com](https://render.com)
2. Connect your GitHub account
3. Click "New +" → "Web Service"
4. Select your `Meditations` repository
5. Use these settings:
   - **Name**: `meditations-app`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 3. **Set Environment Variables**
In Render dashboard, add these:

**Database (from your Neon dashboard):**
- `PGHOST` = `ep-still-band-a2btswzg-pooler.eu-central-1.aws.neon.tech`
- `PGDATABASE` = `neondb`
- `PGUSER` = `neondb_owner`
- `PGPASSWORD` = `npg_XsB7fMTgyD0W`
- `PGSSLMODE` = `require`
- `PGCHANNELBINDING` = `require`

**Bot (get from @BotFather):**
- `TELEGRAM_BOT_TOKEN` = `your_bot_token_here`
- `NEXT_PUBLIC_APP_URL` = `https://your-app-name.onrender.com`

### 4. **After Deploy**
1. Note your Render URL (e.g., `https://meditations-app-xyz.onrender.com`)
2. Update `NEXT_PUBLIC_APP_URL` with your real URL
3. Run bot setup: `node scripts/setup-bot.js`

## Alternative: Manual Render.yaml
If you prefer, you can use the included `render.yaml` file for automated deployment configuration.

Your app will be live and ready for Telegram bot integration! 🚀
