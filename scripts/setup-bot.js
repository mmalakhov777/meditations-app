#!/usr/bin/env node

const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.NEXT_PUBLIC_APP_URL + '/api/telegram/webhook';

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is required in .env file');
  process.exit(1);
}

async function setupBot() {
  const bot = new TelegramBot(BOT_TOKEN, { polling: false });

  try {
    console.log('🤖 Setting up Telegram bot...');
    
    // Get bot info
    const botInfo = await bot.getMe();
    console.log(`✅ Bot connected: @${botInfo.username} (${botInfo.first_name})`);

    // Set webhook
    console.log(`🔗 Setting webhook to: ${WEBHOOK_URL}`);
    const webhookResult = await bot.setWebHook(WEBHOOK_URL);
    
    if (webhookResult) {
      console.log('✅ Webhook set successfully!');
    } else {
      console.log('❌ Failed to set webhook');
    }

    // Get webhook info
    const webhookInfo = await bot.getWebHookInfo();
    console.log('📋 Webhook info:', {
      url: webhookInfo.url,
      has_custom_certificate: webhookInfo.has_custom_certificate,
      pending_update_count: webhookInfo.pending_update_count,
      last_error_date: webhookInfo.last_error_date,
      last_error_message: webhookInfo.last_error_message
    });

    // Set bot commands
    console.log('⚙️ Setting bot commands...');
    await bot.setMyCommands([
      { command: 'start', description: 'Start using Meditations bot' },
      { command: 'meditate', description: 'Quick meditation options' },
      { command: 'favorites', description: 'View your favorite meditations' },
      { command: 'profile', description: 'View your profile and subscription' },
      { command: 'help', description: 'Show help and available commands' }
    ]);
    console.log('✅ Bot commands set successfully!');

    console.log('\n🎉 Bot setup complete!');
    console.log(`💬 You can now message @${botInfo.username} on Telegram`);
    console.log(`🔗 Or visit: https://t.me/${botInfo.username}`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupBot();
