export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("AI Future Hub Assistant is running!");
  }

  try {
    const update = req.body;
    const botToken = process.env.BOT_TOKEN;

    // =========================
    // NORMAL TELEGRAM MESSAGE
    // =========================
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text || "";

      // AI Chat mode
      if (text !== "/start" && !text.startsWith("/")) {
        const aiReply = await askGemini(text);

        await sendMessage(
          botToken,
          chatId,
          "🤖 Gemini AI:\n\n" + aiReply,
          null
        );

        return res.status(200).json({ ok: true });
      }

      const keyboard = {
        inline_keyboard: [
          [
            { text: "🤖 AI Chat", callback_data: "ai_chat" },
            { text: "🛠️ AI Tools", callback_data: "ai_tools" }
          ],
          [
            { text: "📰 AI News", callback_data: "ai_news" },
            { text: "💰 Earn with AI", callback_data: "earn_ai" }
          ],
          [
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

      await sendMessage(
        botToken,
        chatId,
        "🤖 Welcome to AI Future Hub Assistant!\n\nChoose an option below 👇",
        keyboard
      );
    }

    // =========================
    // BUTTON CLICKS
    // =========================
    if (update.callback_query) {
      const callback = update.callback_query;
      const chatId = callback.message.chat.id;
      const messageId = callback.message.message_id;
      const data = callback.data;

      await answerCallbackQuery(botToken, callback.id);

      if (data === "ai_chat") {
        await editMessage(
          botToken,
          chatId,
          messageId,
          "🤖 AI Chat\n\nاب اپنا سوال یہاں لکھیں۔\nمیں Gemini AI سے جواب لینے کی کوشش کروں گا۔\n\nمثال:\nWhat is artificial intelligence?",
          {
            inline_keyboard: [
              [{ text: "🔙 Main Menu", callback_data: "main_menu" }]
            ]
          }
        );
      }

      if (data === "ai_tools") {
        await editMessage(
          botToken,
          chatId,
          messageId,
          "🛠️ AI TOOLS\n\n" +
            "🔥 ChatGPT — AI assistant\n" +
            "🎨 Canva AI — Design\n" +
            "🎬 CapCut AI — Video editing\n" +
            "🖼️ Leonardo AI — AI images\n" +
            "🎵 Suno — AI music\n\n" +
            "AI tools کو اپنی ضرورت کے مطابق استعمال کریں۔",
          {
            inline_keyboard: [
              [{ text: "🔙 Main Menu", callback_data: "main_menu" }]
            ]
          }
        );
      }

      if (data === "ai_news") {
        await editMessage(
          botToken,
          chatId,
          messageId,
          "📰 AI NEWS\n\n" +
            "AI کی دنیا میں نئی technologies، tools اور updates مسلسل آ رہے ہیں۔\n\n" +
            "🔔 مزید AI updates جلد شامل کیے جائیں گے۔",
          {
            inline_keyboard: [
              [{ text: "🔙 Main Menu", callback_data: "main_menu" }]
            ]
          }
        );
      }

      if (data === "earn_ai") {
        await editMessage(
          botToken,
          chatId,
          messageId,
          "💰 EARN WITH AI\n\n" +
            "1️⃣ AI content creation\n" +
            "2️⃣ YouTube automation\n" +
            "3️⃣ Freelancing\n" +
            "4️⃣ AI graphic design\n" +
            "5️⃣ AI video editing\n\n" +
            "پہلے ایک skill سیکھیں، پھر اسے service کے طور پر offer کریں۔",
          {
            inline_keyboard: [
              [{ text: "🔙 Main Menu", callback_data: "main_menu" }]
            ]
          }
        );
      }

      if (data === "courses") {
        await editMessage(
          botToken,
          chatId,
          messageId,
          "📚 FREE COURSES\n\n" +
            "🎓 AI Basics\n" +
            "🎓 Prompt Engineering\n" +
            "🎓 Canva & AI Design\n" +
            "🎓 Video Editing\n" +
            "🎓 Freelancing\n\n" +
            "Free learning resources جلد شامل کیے جائیں گے۔",
          {
            inline_keyboard: [
              [{ text: "🔙 Main Menu", callback_data: "main_menu" }]
            ]
          }
        );
      }

      if (data === "main_menu") {
        const keyboard = {
          inline_keyboard: [
            [
              { text: "🤖 AI Chat", callback_data: "ai_chat" },
              { text: "🛠️ AI Tools", callback_data: "ai_tools" }
            ],
            [
              { text: "📰 AI News", callback_data: "ai_news" },
              { text: "💰 Earn with AI", callback_data: "earn_ai" }
            ],
            [
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
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Bot Error:", error);
    return res.status(500).json({ ok: false });
  }
}


// =========================
// GEMINI AI
// =========================

async function askGemini(userText) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return "⚠️ Gemini API key is not configured.";
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    apiKey;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text:
                "You are AI Future Hub Assistant. Give helpful, accurate and concise answers. User question:\n\n" +
                userText
            }
          ]
        }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini Error:", data);
    return "⚠️ Gemini AI is temporarily unavailable. Please try again later.";
  }

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "⚠️ I could not generate a response."
  );
}


// =========================
// TELEGRAM FUNCTIONS
// =========================

async function sendMessage(token, chatId, text, replyMarkup) {
  return fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...(replyMarkup ? { reply_markup: replyMarkup } : {})
      })
    }
  );
}

async function answerCallbackQuery(token, callbackId) {
  return fetch(
    `https://api.telegram.org/bot${token}/answerCallbackQuery`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        callback_query_id: callbackId
      })
    }
  );
}

async function editMessage(
  token,
  chatId,
  messageId,
  text,
  replyMarkup
) {
  return fetch(
    `https://api.telegram.org/bot${token}/editMessageText`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        reply_markup: replyMarkup
      })
    }
  );
    }
