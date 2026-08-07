export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("AI Future Hub Assistant is running!");
  }

  try {
    const update = req.body;

    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text || "";

      let reply = "";

      if (text === "/start") {
        reply =
          "🤖 Welcome to AI Future Hub Assistant!\n\n" +
          "Choose an option below 👇";
      } else {
        reply =
          "👋 Hello!\n\n" +
          "AI Future Hub Assistant is ready. 🤖\n\n" +
          "Use /start to open the main menu.";
      }

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
            { text: "📢 Join Channel", callback_data: "join_channel" },
            { text: "👨‍💻 Contact Admin", callback_data: "contact_admin" }
          ]
        ]
      };

      await fetch(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: reply,
            reply_markup: keyboard
          })
        }
      );
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false });
  }
}
