import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Handle /start command
bot.start((ctx) => {
  ctx.reply("Hello and welcome! 😊");
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body);
    return res.status(200).send("OK");
  }
  res.status(405).send("Method Not Allowed");
}
