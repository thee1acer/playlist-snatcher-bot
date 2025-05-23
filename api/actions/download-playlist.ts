import { Context } from "telegraf";
import { userIsSubscribed } from "../lib/authentication";
import { getUserDownloadHistory } from "../lib/download";
import { put } from "@vercel/blob";
import path from "path";

import fs from "fs";
import archiver from "archiver";

import { randomUUID } from "crypto";

import {
  getPlaylistHeaderParams,
  getPlaylistItemHeaderParams
} from "../lib/get-req-params";
import { Readable } from "stream";

export async function handlePlayListDownloadRequest(ctx: Context) {
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
  playlistUrl: string
) {
  const tempDir = "/tmp";
  const outputFolder = `${tempDir}/playlist-${randomUUID()}`;

  try {
    await fs.promises.access(tempDir);
  } catch {
    await ctx
      .reply("Failed to access temporary directory, let's create it.. 😊👨‍💻")
      .then(async (_) => {
        await fs.promises.mkdir(tempDir, { recursive: true });
      })
      .catch(async (_) => {
        await ctx.reply("Failed to create temporary directory 😣");
        return;
      });
  }

  try {
    await fs.promises.mkdir(outputFolder, { recursive: true });
  } catch {
    await ctx.reply("Failed to create output directory 😣");
    return;
  }

  const REQ_PLAYLIST_BODY = JSON.stringify(
    getPlaylistHeaderParams(playlistUrl)
  );

  const response = await fetch(`${process.env.YT_NEXT_API}`, {
    method: "POST",
    body: REQ_PLAYLIST_BODY
  });

  const contentEncoding = response.headers.get("content-encoding");

  var data;
  if (contentEncoding && contentEncoding.includes("gzip")) {
    const decompressedBody = await response.text();
    data = JSON.parse(decompressedBody);
  } else {
    data = await response.json();
  }

  interface itemDetails {
    videoId: string;
    title: string;
    thumbnails: string[];
    index: number;
  }

  interface detailedPlayList {
    playlistId: string;
    title: string;
    fullPlayList: itemDetails[];
  }

  const playlistId =
    data?.contents?.twoColumnWatchNextResults?.playlist?.playlist?.playlistId;
  const title =
    data?.contents?.twoColumnWatchNextResults?.playlist?.playlist?.title;
  const fullPlayListData =
    data?.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents;

  var fullPlayList: itemDetails[] = [];

  fullPlayListData?.forEach((item: any, index: number) => {
    const details = item?.playlistPanelVideoRenderer;
    if (details) {
      const playListItem: itemDetails = {
        thumbnails: details?.thumbnail?.thumbnails?.map((v) => v?.url),
        title: details?.title?.accessibility?.accessibilityData?.label,
        videoId: details?.videoId,
        index: index
      };

      fullPlayList.push(playListItem);
    }
  });

  const results: detailedPlayList = {
    playlistId: playlistId,
    title: title,
    fullPlayList: fullPlayList
  };

  let replyMessage = `🎶 *Now Downloading Playlist:* _"${results.title}"_\n\n`;
  results.fullPlayList.forEach((song, index) => {
    replyMessage += `🎵 *Song ${index + 1}:* _"${song.title}"_\n\n`;
  });

  await ctx.reply(replyMessage);

  await ctx.replyWithAnimation({
    url: process.env.LOADING_GIF!.toString(),
    filename: "Loading_GIF.gif"
  });

  const firstItem = fullPlayList[0];
  const REQ_PLAYLIST_ITEM_BODY = JSON.stringify(
    getPlaylistItemHeaderParams(playlistUrl, firstItem.index)
  );
  const playlist_item_response = await fetch(`${process.env.YT_PLAYER_API}`, {
    method: "POST",
    body: REQ_PLAYLIST_ITEM_BODY
  });

  var playlistItemData;
  const playlistItemEncoding =
    playlist_item_response.headers.get("content-encoding");

  if (playlistItemEncoding && playlistItemEncoding.includes("gzip")) {
    const decompressedPlaylistItemBody = await playlist_item_response.text();
    playlistItemData = JSON.parse(decompressedPlaylistItemBody);
  } else {
    playlistItemData = await playlist_item_response.json();
  }

  console.log({ playlistItemData: JSON.stringify(playlistItemData) });

  return outputFolder;
}

export async function handleSendPlayListZipFile(
  ctx: Context,
  outputFolder: string
) {
  /*try {
    console.log(`Reading files from: ${outputFolder}`);
    const files = await fs.promises.readdir(outputFolder);

    if (files.length === 0) {
      ctx.reply("⚠ No files found.");
      return;
    }

    const zipPath = path.join("/tmp", `playlist-${Date.now()}.zip`);
    console.log("Creating zip archive:", zipPath);

    const zipStream = fs.createWriteStream(zipPath);
    const archive = new archiver("zip", { zlib: { level: 9 } });

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
  }*/
}

export async function SendFile(ctx: Context) {
  try {
    const signedURL =
      //"https://9dbsrzxknugap8tb.public.blob.vercel-storage.com/downloads/blob-BSiLYXepyTmRXzsivYKBm7r8pIpMwZ.txt";
      "https://9dbsrzxknugap8tb.public.blob.vercel-storage.com/downloads/apktool-XxfgjqNnldK277fbdlI7H4OOb7qvRo.zip";

    const response = await fetch(signedURL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    const fileSizeMB = contentLength
      ? parseInt(contentLength, 10) / (1024 * 1024)
      : 0;

    if (fileSizeMB > 50) {
      ctx.reply(
        `File size is greater than 50mbs. Here is your download link: ${signedURL}`
      );
    } else {
      const fileBuffer = Buffer.from(await response.arrayBuffer());
      const fileStream = Readable.from(fileBuffer);

      const fileExtension = signedURL.split(".").pop();

      await ctx.replyWithDocument(
        {
          source: fileStream,
          filename: `file.${fileExtension}`
        },
        { caption: "Here is your file 📂" }
      );
    }
  } catch (err) {
    console.error("Failed to fetch file:", err);
    await ctx.reply("❌ Failed to send the file.");
  }
}
