import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";

// Initialize the bot
const bot = new Telegraf(process.env.BOT_TOKEN!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body); // Process Telegram update
    return res.status(200).send("OK");
  }
  res.status(405).send("Method Not Allowed"); // Only allow POST requests
}
