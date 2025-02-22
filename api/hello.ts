import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf, Markup } from "telegraf";
import {
  checkIfUserExists,
  getUserDownloadHistory,
  userIsSubscribed
} from "./lib/authentication";

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
      [Markup.button.callback("👨‍💻 Download a playlist", "download_playlist")],
      [
        Markup.button.callback(
          "🧾 View download history",
          "view_download_history"
        )
      ],
      [Markup.button.callback("❌ End chat", "exit")]
    ])
  );
});

// Handle /help command
bot.help(async (ctx) => {
  ctx.reply(
    "Here is some documentation I can help you with: ",
    Markup.inlineKeyboard([
      [Markup.button.callback("📜 View Bot Documentation", "view_bot_docs")],
      [Markup.button.callback("❌ End chat", "exit")]
    ])
  );
});

bot.command("menu", (ctx) => ctx.reply("Showing interactive menu"));

bot.command("about", (ctx) =>
  ctx.reply(
    "📌 *Playlist Downloader Bot*\n\n\
    *Overview* \n\n\
    The Playlist Downloader Bot is a Telegram bot designed to fetch and download playlists from various music streaming platforms. It allows users to input a playlist URL from services like Spotify, YouTube, Apple Music, SoundCloud, and Deezer, and retrieves the tracks while providing download links or converted audio files. The bot is built using Node.js, Telegraf (Telegram Bot API), and Prisma for database management, ensuring seamless storage of user preferences and download history. Hosted on Vercel, the bot operates efficiently with serverless functions, making it scalable and reliable. \n \
    \nFeatures\n\
      \t🔍 Playlist Detection: Supports multiple streaming platforms and extracts tracks from URLs.\n\
      \t📥 Music Download: Fetches high-quality audio files for each song in a playlist.\n\
      \t📂 File Management: Provides downloadable links or directly sends files in Telegram.\n\
      \t⚡ User Subscriptions: Tracks user preferences, ensuring a personalized experience.\n\
      \t🛠 Database Integration: Uses Prisma + PostgreSQL for storing user interactions.\n\
      \t🔄 Webhook Integration: Uses Vercel Serverless Functions for real-time bot responses.\n\
      \t🛑 Legal Compliance: Ensures fair usage policies and copyright adherence.\n\n\
    🔹 To get started, simply send a playlist URL to the bot and select the desired download format. The bot will process the request and provide links or direct downloads. 🚀 \n \
  "
  )
);

//function
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

  if (userSubscription?.subscription == null && downloadHistory?.length > 0) {
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
  }

  ctx.reply("Send a url of your playlist to download 🤖");
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

bot.action("exit", (ctx) => {
  ctx.editMessageText("Goodbye! 👋");
});

// on messages
bot.on("text", (ctx) => {
  const messageText = ctx.message?.text || "";

  // Regex to detect URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  if (urlRegex.test(messageText)) {
    ctx.reply("I see you sent a link! Processing it... 🔄");

    // Do something with the link, like downloading a playlist
    const links = messageText.match(urlRegex);
    console.log("User sent links:", links);

    // Example: Call a function to process the link
    // processLink(links[0]);
  } else {
    ctx.reply("That doesn't seem to be a link. Send me a URL to proceed! 🔗");
  }
});
