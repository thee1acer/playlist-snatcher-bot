import { Context, Markup } from "telegraf";
import { checkIfUserExists } from "../lib/authentication";

export async function handleStartCommand(ctx: Context) {
  const { id, username, first_name, last_name } = ctx.from!;

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
}
