import { Context, Markup } from "telegraf";
import { userIsSubscribed } from "../lib/authentication";
import {
  getUserDownloadHistory,
  getUserDownloadHistoryByHistoryId
} from "../lib/download";

export async function handleViewAllDownloadHistory(ctx: Context) {
  const { id } = ctx.from!;

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
}

export async function handleViewDownloadHistoryById(
  ctx: Context,
  downloadId: string
) {
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
}
