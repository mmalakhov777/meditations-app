import TelegramBot from 'node-telegram-bot-api';
import { createOrGetUser, getUserByTelegramId } from '@/lib/services/user-service';
import { t } from '@/lib/i18n';

export async function handleBotMessage(bot: TelegramBot, message: TelegramBot.Message) {
  const chatId = message.chat.id;
  const text = message.text || '';
  const user = message.from;

  if (!user) return;

  try {
    // Ensure user exists in database
    await createOrGetUser({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      language_code: user.language_code,
      is_premium: user.is_premium,
    });

    // Handle different commands
    if (text.startsWith('/start')) {
      await handleStartCommand(bot, chatId, user);
    } else if (text.startsWith('/help')) {
      await handleHelpCommand(bot, chatId);
    } else if (text.startsWith('/meditate')) {
      await handleMeditateCommand(bot, chatId);
    } else if (text.startsWith('/favorites')) {
      await handleFavoritesCommand(bot, chatId, user.id);
    } else if (text.startsWith('/profile')) {
      await handleProfileCommand(bot, chatId, user.id);
    } else {
      // Default response for unknown commands
      await bot.sendMessage(chatId, 
        "🤔 I didn't understand that command. Try /help to see available options.",
        { reply_markup: getMainKeyboard() }
      );
    }
  } catch (error) {
    console.error('❌ Bot message handler error:', error);
    await bot.sendMessage(chatId, 
      "Sorry, something went wrong. Please try again later."
    );
  }
}

async function handleStartCommand(bot: TelegramBot, chatId: number, user: TelegramBot.User) {
  const welcomeMessage = `
🧘 Welcome to Meditations, ${user.first_name}!

Find calm in just 3 minutes with our guided meditations designed for busy lives.

Choose an option below or open the full app for the complete experience.
  `.trim();

  await bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🧘 Open Full App',
            web_app: { url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app' }
          }
        ],
        [
          { text: '🌅 Morning Meditation', callback_data: 'morning' },
          { text: '🌙 Evening Meditation', callback_data: 'evening' }
        ],
        [
          { text: '❤️ My Favorites', callback_data: 'favorites' },
          { text: '👤 Profile', callback_data: 'profile' }
        ]
      ]
    }
  });
}

async function handleHelpCommand(bot: TelegramBot, chatId: number) {
  const helpMessage = `
🆘 Available Commands:

/start - Welcome message and main menu
/meditate - Quick meditation options
/favorites - View your favorite meditations
/profile - View your profile and subscription
/help - Show this help message

💡 Tip: Use the inline buttons for the best experience!
  `.trim();

  await bot.sendMessage(chatId, helpMessage, {
    reply_markup: getMainKeyboard()
  });
}

async function handleMeditateCommand(bot: TelegramBot, chatId: number) {
  await bot.sendMessage(chatId, "🧘 Choose your meditation:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🧘 Open Meditation App',
            web_app: { url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app' }
          }
        ],
        [
          { text: '🌅 Morning Session', callback_data: 'morning' },
          { text: '🌙 Evening Session', callback_data: 'evening' }
        ]
      ]
    }
  });
}

async function handleFavoritesCommand(bot: TelegramBot, chatId: number, telegramId: number) {
  try {
    const user = await getUserByTelegramId(telegramId);
    
    if (!user || user.favoriteMeditations.length === 0) {
      await bot.sendMessage(chatId, 
        "💔 You haven't favorited any meditations yet.\n\nOpen the app to explore and save your favorites!",
        {
          reply_markup: {
            inline_keyboard: [[
              {
                text: '🧘 Open App',
                web_app: { url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app' }
              }
            ]]
          }
        }
      );
      return;
    }

    await bot.sendMessage(chatId, 
      `❤️ You have ${user.favoriteMeditations.length} favorite meditation(s)!\n\nOpen the app to access them.`,
      {
        reply_markup: {
          inline_keyboard: [[
            {
              text: '❤️ View Favorites',
              web_app: { url: `${process.env.NEXT_PUBLIC_APP_URL}/favorites` || 'https://your-app.vercel.app/favorites' }
            }
          ]]
        }
      }
    );
  } catch (error) {
    console.error('❌ Favorites command error:', error);
    await bot.sendMessage(chatId, "Sorry, couldn't load your favorites. Please try again.");
  }
}

async function handleProfileCommand(bot: TelegramBot, chatId: number, telegramId: number) {
  try {
    const user = await getUserByTelegramId(telegramId);
    
    if (!user) {
      await bot.sendMessage(chatId, "Profile not found. Please try /start to initialize.");
      return;
    }

    const statusEmoji = user.subscriptionStatus === 'premium' ? '⭐' : 
                       user.subscriptionStatus === 'trial' ? '🆓' : '🆓';
    
    const profileMessage = `
👤 Your Profile

Name: ${user.telegramData.first_name}
Status: ${statusEmoji} ${user.subscriptionStatus}
Favorites: ❤️ ${user.favoriteMeditations.length} meditations
Joined: ${user.createdAt.toLocaleDateString()}
    `.trim();

    await bot.sendMessage(chatId, profileMessage, {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '👤 Open Profile',
            web_app: { url: `${process.env.NEXT_PUBLIC_APP_URL}/profile` || 'https://your-app.vercel.app/profile' }
          }
        ]]
      }
    });
  } catch (error) {
    console.error('❌ Profile command error:', error);
    await bot.sendMessage(chatId, "Sorry, couldn't load your profile. Please try again.");
  }
}

function getMainKeyboard(): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: '🧘 Open App',
          web_app: { url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app' }
        }
      ],
      [
        { text: '🌅 Morning', callback_data: 'morning' },
        { text: '🌙 Evening', callback_data: 'evening' }
      ]
    ]
  };
}
