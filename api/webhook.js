export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("AI Future Hub Assistant is running!");
  }

  try {
    const update = req.body;
    const botToken = process.env.BOT_TOKEN;

    // Handle normal messages
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text || "";

      const keyboard = {
        inline_keyboard: [
          [
            { text: "🤖 AI Tools", callback_data: "ai_tools" },
            { text: "📰 AI News", callback_data: "ai_news" }
          ],
          [
            { text: "💰 Earn with AI", callback_data: "earn_ai" },
            { text: "📚 Free Courses", callback_data: "courses" }
          ],
          [
            {
              text: "📢 Join Channel",
              url: "https://t.me/AIFutureHubOfficial"
            },
            {
              text: "👨‍💻 Contact Admin",
              url: "https://t.me/MalikGAIKing"
            }
          ]
        ]
      };

      let reply =
        "🤖 Welcome to AI Future Hub Assistant!\n\n" +
        "Choose an option below 👇";

      if (text !== "/start") {
        reply =
          "👋 Hello!\n\n" +
          "Please choose an option from the menu below 👇";
      }

      await sendMessage(botToken, chatId, reply, keyboard);
    }

    // Handle button clicks
    if (update.callback_query) {
      const callback = update.callback_query;
      const chatId = callback.message.chat.id;
      const messageId = callback.message.message_id;
      const data = callback.data;

      let text = "";

      if (data === "ai_tools") {
        text =
          "🤖 AI TOOLS\n\n" +
          "🔥 ChatGPT — AI assistant\n" +
          "🎨 Canva AI — Design & graphics\n" +
          "🎬 CapCut AI — Video editing\n" +
          "🖼️ Leonardo AI — AI images\n" +
          "🎵 Suno — AI music\n\n" +
          "Use these tools to create content faster.";
      }

      if (data === "ai_news") {
        text =
          "📰 AI NEWS\n\n" +
          "Stay updated with the latest AI tools, trends and important developments.\n\n" +
          "🔔 More AI updates coming soon.";
      }

      if (data === "earn_ai") {
        text =
          "💰 EARN WITH AI\n\n" +
          "1️⃣ AI content creation\n" +
          "2️⃣ YouTube automation\n" +
          "3️⃣ Freelancing with AI\n" +
          "4️⃣ AI graphic design\n" +
          "5️⃣ AI video editing\n\n" +
          "Learn a skill first, then offer it as a service.";
      }

      if (data === "courses") {
        text =
          "📚 FREE COURSES\n\n" +
          "🎓 AI Basics\n" +
          "🎓 Prompt Engineering\n" +
          "🎓 Canva & AI Design\n" +
          "🎓 Video Editing\n" +
          "🎓 Freelancing\n\n" +
          "Free learning resources will be added here.";
      }

      await answerCallbackQuery(botToken, callback.id);

      await editMessage(botToken, chatId, messageId, text, {
        inline_keyboard: [
          [{ text: "🔙 Main Menu", callback_data: "main_menu" }]
        ]
      });
    }

    // Main menu button
    if (
      update.callback_query &&
      update.callback_query.data === "main_menu"
    ) {
      const callback = update.callback_query;
      const chatId = callback.message.chat.id;
      const messageId = callback.message.message_id;

      await answerCallbackQuery(botToken, callback.id);

      const keyboard = {
        inline_keyboard: [
          [
            { text: "🤖 AI Tools", callback_data: "ai_tools" },
            { text: "📰 AI News", callback_data: "ai_news" }
          ],
          [
            { text: "💰 Earn with AI", callback_data: "earn_ai" },
            { text: "📚 Free Courses", callback_data: "courses" }
          ],
          [
            {
              text: "📢 Join Channel",
              url: "https://t.me/AIFutureHubOfficial"
            },
            {
              text: "👨‍💻 Contact Admin",
              url: "https://t.me/MalikGAIKing"
            }
          ]
        ]
      };

      await editMessage(
        botToken,
        chatId,
        messageId,
        "🤖 Welcome to AI Future Hub Assistant!\n\nChoose an option below 👇",
        keyboard
      );
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false });
  }
}

async function sendMessage(token, chatId, text, replyMarkup) {
  return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: replyMarkup
    })
  });
}

async function answerCallbackQuery(token, callbackId) {
  return fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackId
    })
  });
}

async function editMessage(token, chatId, messageId, text, replyMarkup) {
  return fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      reply_markup: replyMarkup
    })
  });
}
