import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";
import { handleStartCommand } from "./commands/start";
import { handleExitAction } from "./actions/exit";
import { handleHelpCommand } from "./commands/help";
import { handleAboutCommand } from "./commands/about";
import { handleInteractiveMenuCommand } from "./commands/menu";
import {
  handlePlayListDownloadRequest,
  handleFetchPlayListMedia
} from "./actions/download-playlist";
import {
  handleViewAllDownloadHistory,
  handleViewDownloadHistoryById
} from "./actions/view-download-history";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.telegram.setMyCommands([
  { command: "start", description: "Start the bot ▶️" },
  { command: "help", description: "Show help menu ⛑️" },
  { command: "menu", description: "Show interactive menu 🛒" },
  { command: "about", description: "About this bot 🤖" }
]);

//bot commands
bot.start(async (ctx) => await handleStartCommand(ctx));
bot.help(async (ctx) => await handleHelpCommand(ctx));
bot.command("menu", async (ctx) => await handleInteractiveMenuCommand(ctx));
bot.command("about", async (ctx) => await handleAboutCommand(ctx));

//serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body);
    return res.status(200).send("OK");
  }
  res.status(405).send("Method Not Allowed");
}

//actions
bot.action(
  "download_playlist",
  async (ctx) => await handlePlayListDownloadRequest(ctx)
);

bot.action(
  "view_download_history",
  async (ctx) => await handleViewAllDownloadHistory(ctx)
);

bot.action(/^view_history:(\d+)$/, async (ctx) => {
  const downloadId = ctx.match[1];
  await handleViewDownloadHistoryById(ctx, downloadId);
});

bot.action("view_bot_docs", (ctx) => {
  ctx.editMessageText(
    "Here is more on the bot's documentation! https://github.com/thee1acer/playlist-snatcher-bot/blob/main/README.md 📚"
  );
});

bot.action("exit", async (ctx) => {
  await handleExitAction(ctx);
});

// on messages
bot.on("text", async (ctx) => {
  const { id } = ctx.from;
  const messageText = ctx.message?.text || "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  if (urlRegex.test(messageText)) {
    const playlistUrl = messageText.match(urlRegex)?.[0];
    if (playlistUrl === null || playlistUrl === undefined) {
      ctx.reply("That doesn't seem to be a link. Send me a URL to proceed! 🔗");
      return;
    }

    ctx.reply("Processing... 🔄");

    await handleFetchPlayListMedia(ctx, playlistUrl).then(
      async (outputFolder) => {
        return;
        //if (outputFolder) {
        //await handleSendPlayListZipFile(ctx, outputFolder);
        //}
      }
    );
  }
});
