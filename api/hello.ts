import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf, Markup } from "telegraf";
import { checkIfUserExists } from "./lib/authentication";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.telegram.setMyCommands([
  { command: "start", description: "Start the bot ▶️" },
  { command: "help", description: "Show help menu ⛑️" },
  { command: "menu", description: "Show interactive menu 🛒" },
  { command: "about", description: "About this bot 🤖" }
]);

// Handle /start command
bot.start(async (ctx) => {
  const { id, username, first_name, last_name } = ctx.from;

  const greeting = await checkIfUserExists(
    id,
    username ?? id.toString(),
    first_name,
    last_name ?? ""
  );

  ctx.reply(
    greeting,
    Markup.inlineKeyboard([
      [Markup.button.callback("📜 View List", "view_list")],
      [Markup.button.callback("📌 Add Item", "add_item")],
      [Markup.button.callback("❌ Exit", "exit")]
    ])
  );
});

// Handle /help command
bot.help(async (ctx) => {
  const { id, username, first_name, last_name, is_premium, is_bot } = ctx.from;

  ctx.reply(
    "Here is some documentation I can help you with: ",
    Markup.inlineKeyboard([
      [Markup.button.callback("📜 View Bot Documentation", "view_bot_docs")],
      [Markup.button.callback("❌ Exit", "exit")]
    ])
  );
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body);
    return res.status(200).send("OK");
  }
  res.status(405).send("Method Not Allowed");
}

//actions
bot.action("view_list", (ctx) => {
  ctx.editMessageText("Here is your list");
  //ctx.reply("Here is your list...");
});

bot.action("add_item", (ctx) => {
  ctx.answerCbQuery();
  ctx.reply("Send me the item you want to add.");
});

bot.action("view_bot_docs", (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    "Here is the bot's documentation! https://github.com/thee1acer/playlist-snatcher-bot/blob/main/README.md 📚"
  );
});

bot.action("exit", (ctx) => {
  ctx.answerCbQuery();
  ctx.reply("Goodbye! 👋");
});
