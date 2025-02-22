import { Context } from "telegraf";
import { userIsSubscribed } from "../lib/authentication";
import { getUserDownloadHistory } from "../lib/download";

import YTDlpWrap from "yt-dlp-wrap";
import fs from "fs";
import path from "path";

import { put } from "@vercel/blob";

const ytDlp = new YTDlpWrap();

export async function handleDownloadPlayListAction(ctx: Context) {
  const { id } = ctx.from!;
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
    await ctx
      .editMessageText(
        "Note that first time downloads are free but from then you will need a subscription!"
      )
      .then((_) => ctx.reply("Send a url of your playlist to download 🤖"));
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

    await ctx
      .editMessageText(
        `Your have ${totalDaysLeft} days / ${totalSubScriptionDays} left out of your ${subscriptionName}`
      )
      .then((_) => ctx.reply("Send a url of your playlist to download 🤖"));
  }
}

export async function handleFetchPlayListMedia(
  playlistUrl: string,
  outputFolder: string
) {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    ytDlp
      .exec([
        playlistUrl,
        "-x",
        "--audio-format",
        "mp3",
        "-o",
        path.join(outputFolder, "%(title)s.%(ext)s")
      ])
      .on("progress", (progress) => {
        console.log(`Downloading: ${progress.percent}%`);
      })
      .on("close", (code) => {
        if (code === 0) resolve(outputFolder);
        else reject(new Error("Download failed"));
      });
  });
}

export async function handleSendPlayListZipFile(
  ctx: Context,
  outputFolder: string
) {
  try {
    const files = await fs.promises.readdir(outputFolder);
    const uploadedFiles: string[] = [];

    for (const file of files) {
      const filePath = path.join(outputFolder, file);
      const fileBuffer = await fs.promises.readFile(filePath);

      const { url } = await put(`playlist/${file}`, fileBuffer, {
        access: "public"
      });

      uploadedFiles.push(url);
    }

    if (uploadedFiles.length === 0) {
      ctx.reply("⚠ No files found to upload.");
      return;
    }

    ctx.reply(
      `✅ Download complete! Here are your files:\n\n${uploadedFiles.join(
        "\n"
      )}`
    );
  } catch (error) {
    console.error("Error uploading files:", error);
    ctx.reply("❌ Failed to upload files.");
  }
}
