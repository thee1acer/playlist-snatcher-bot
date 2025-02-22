import { PrismaClient } from "@prisma/client";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";
import { checkIfUserExists } from "./lib/authentication";

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Handle /start command
bot.start(async (ctx) => {
  const { id, username, first_name, last_name } = ctx.from;

  const greeting = await checkIfUserExists(
    id,
    username ?? id.toString(),
    first_name,
    last_name ?? ""
  );

  ctx.reply(greeting);
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body);
    return res.status(200).send("OK");
  }
  res.status(405).send("Method Not Allowed");
}
