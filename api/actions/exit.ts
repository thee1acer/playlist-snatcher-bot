import { Context } from "telegraf";

export async function handleExitAction(ctx: Context) {
  ctx.editMessageText("Goodbye! 👋");
}
