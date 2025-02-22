import { Context, Markup } from "telegraf";

export async function handleHelpCommand(ctx: Context) {
  ctx.reply(
    "Here is some documentation I can help you with: ",
    Markup.inlineKeyboard([
      [Markup.button.callback("📜 View Bot Documentation", "view_bot_docs")],
      [Markup.button.callback("❌ End chat", "exit")]
    ])
  );
}
