import { Context } from "telegraf";
import { userIsSubscribed } from "../lib/authentication";
import { getUserDownloadHistory } from "../lib/download";

import fs from "fs";
import path from "path";

import { put } from "@vercel/blob";
import { spawn } from "child_process";
import archiver from "archiver";

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
  ctx: Context,
  playlistUrl: string,
  outputFolder: string,
  tempDir: string
) {
  await ctx.replyWithDocument(
    "https://9dbsrzxknugap8tb.public.blob.vercel-storage.com/downloads/apktool-XxfgjqNnldK277fbdlI7H4OOb7qvRo.zip",
    {
      caption: "Here is your downloaded playlist 🎵"
    }
  );

  return;
  console.log("Setting up root directory");
  try {
    await fs.promises.access(tempDir);
  } catch {
    await fs.promises.mkdir(tempDir, { recursive: true });
  }

  console.log("Setting up output directory");
  await fs.promises.mkdir(outputFolder, { recursive: true });

  console.log("Fetching tracklist");

  const ytDlpPath = path.join(__dirname, "bin", "yt-dlp");

  await new Promise((resolve, reject) => {
    const process = spawn(ytDlpPath, [
      playlistUrl,
      "-x",
      "--audio-format",
      "mp3",
      "-o",
      path.join(outputFolder, "%(title)s.%(ext)s")
    ]);

    process.stdout.on("data", (data) => console.log(`yt-dlp: ${data}`));
    process.stderr.on("data", (data) => console.error(`yt-dlp error: ${data}`));

    process.on("close", (code) => {
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
    console.log(`Reading files from: ${outputFolder}`);
    const files = await fs.promises.readdir(outputFolder);

    if (files.length === 0) {
      ctx.reply("⚠ No files found.");
      return;
    }

    const zipPath = path.join("/tmp", `playlist-${Date.now()}.zip`);
    console.log("Creating zip archive:", zipPath);

    const zipStream = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(zipStream);
    files.forEach((file) => {
      archive.file(path.join(outputFolder, file), { name: file });
    });

    await archive.finalize();
    await new Promise((resolve) => zipStream.on("close", resolve));

    console.log("Uploading zip file...");
    const zipBuffer = await fs.promises.readFile(zipPath);
    const { url } = await put(
      `playlist/playlist-${Date.now()}.zip`,
      zipBuffer,
      {
        access: "public"
      }
    );

    ctx.reply(`✅ Download complete! Your playlist zip:\n\n${url}`);

    // ✅ Clean up temporary files
    await fs.promises.rm(outputFolder, { recursive: true, force: true });
    await fs.promises.unlink(zipPath);
  } catch (error) {
    console.error("Error uploading zip file:", error);
    ctx.reply("❌ Failed to upload.");
  }
}
