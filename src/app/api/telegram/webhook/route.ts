import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import { handleBotMessage } from '@/lib/telegram/bot-handler';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is required');
}

// Create bot instance (webhook mode, no polling)
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();
    
    console.log('📨 Received Telegram update type:', Object.keys(update));
    if (update.message) {
      console.log('🧾 Message:', {
        chatId: update.message.chat?.id,
        from: update.message.from?.username,
        text: update.message.text
      });
    }

    // Handle the update
    if (update.message) {
      await handleBotMessage(bot, update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(bot, update.callback_query);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('❌ Telegram webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleCallbackQuery(bot: TelegramBot, callbackQuery: TelegramBot.CallbackQuery) {
  const chatId = callbackQuery.message?.chat.id;
  const data = callbackQuery.data;

  if (!chatId || !data) return;

  try {
    // Answer the callback query to stop loading animation
    await bot.answerCallbackQuery(callbackQuery.id);

    // Handle different callback data
    if (data === 'open_app') {
      await bot.sendMessage(chatId, 'Opening Meditations app...', {
        reply_markup: {
          inline_keyboard: [[
            {
              text: '🧘 Open Meditations App',
              web_app: { url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app' }
            }
          ]]
        }
      });
    }
  } catch (error) {
    console.error('❌ Callback query error:', error);
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    bot_token_configured: !!BOT_TOKEN 
  });
}
