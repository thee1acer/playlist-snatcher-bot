import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf, Markup } from "telegraf";
import { checkIfUserExists, userIsSubscribed } from "./lib/authentication";
import {
  getUserDownloadHistory,
  getUserDownloadHistoryByHistoryId
} from "./lib/download";
import { handleStartCommand } from "./commands/start";
import { handleExitAction } from "./actions/exit";
import { handleHelpCommand } from "./commands/help";
import { handleAboutCommand } from "./commands/about";
import { handleInteractiveMenuCommand } from "./commands/menu";

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
bot.action("download_playlist", async (ctx) => {
  //check if user has subscription and is active
  const { id } = ctx.from;
  const userSubscription = await userIsSubscribed(id);
  const downloadHistory = await getUserDownloadHistory(id);

  if (
    userSubscription?.subscription == null &&
    downloadHistory != null &&
    downloadHistory.length > 0
  ) {
    ctx.editMessageText(
      "You have exceed the free qouta😣.\n\n Need help setting up your subscription? 🤖"
    );
  } else if (
    userSubscription?.subscription == null &&
    downloadHistory?.length == 0
  ) {
    ctx.editMessageText(
      "Note that first time downloads are free but from then you will need a subscription!"
    );
    ctx.reply("Send a url of your playlist to download 🤖");
  } else if (userSubscription?.subscription) {
    const subscriptionName =
      userSubscription?.subscriptionType?.subscriptionName;
    const totalSubScriptionDays =
      userSubscription?.subscriptionType?.lengthInDays;
    const totalDaysLeft =
      userSubscription?.subscription.expiryDate &&
      userSubscription?.subscription.activationDate
        ? Math.ceil(
            (new Date(userSubscription.subscription.expiryDate).getTime() -
              new Date(
                userSubscription.subscription.activationDate
              ).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

    ctx.editMessageText(
      `Your have ${totalDaysLeft} days / ${totalSubScriptionDays} left out of your ${subscriptionName}`
    );
    ctx.reply("Send a url of your playlist to download 🤖");
  }
});

bot.action("view_download_history", async (ctx) => {
  const { id } = ctx.from;

  const downloadHistory = await getUserDownloadHistory(id);

  if (downloadHistory == null || (downloadHistory?.length ?? 0) === 0)
    ctx.editMessageText(
      "Uh Oh! You do not have any existing download history 😣😭"
    );
  else {
    ctx.reply(
      "Here is your download history:",
      Markup.inlineKeyboard(
        downloadHistory.map((download) =>
          Markup.button.callback(
            `${download.downloadUrl}`,
            `view_history:${download.id}`
          )
        )
      )
    );
  }
});
bot.action(/^view_history:(\d+)$/, async (ctx) => {
  const downloadId = ctx.match[1];
  const history = await getUserDownloadHistoryByHistoryId(downloadId);

  if (history == null) ctx.reply("Uh Oh! Issue getting Download history 🤖");
  else {
    const formattedDate = new Date(history.downloadDate).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "2-digit"
      }
    );
    ctx.reply(`📅 Date: ${formattedDate}`);

    ctx.reply(
      `History: \n\n\t Download ID: ${history.id} \n\t Download History: ${history.downloadUrl} \n\t Download Date: ${formattedDate}`
    );
  }
});

bot.action("add_item", (ctx) => {
  ctx.answerCbQuery();
  ctx.reply("Send me the item you want to add.");
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
bot.on("text", (ctx) => {
  const messageText = ctx.message?.text || "";

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  if (urlRegex.test(messageText)) {
    ctx.reply("I see you sent a link! Processing it... 🔄");

    const links = messageText.match(urlRegex);
    console.log("User sent links:", links);

    // Example: Call a function to process the link
    // processLink(links[0]);
  } else {
    ctx.reply("That doesn't seem to be a link. Send me a URL to proceed! 🔗");
  }
});
