import { Context } from "telegraf";

export async function handleAboutCommand(ctx: Context) {
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
  );
}
