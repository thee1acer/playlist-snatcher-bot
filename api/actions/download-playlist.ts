import { Context } from "telegraf";
import { userIsSubscribed } from "../lib/authentication";
import { getUserDownloadHistory } from "../lib/download";

import fs from "fs";

import { randomUUID } from "crypto";
import { Readable } from "stream";
import getRequestParams from "../lib/get-req-params";

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

  const REQ_BODY = JSON.stringify(getRequestParams());

  const response = fetch(`${process.env.YT_API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: REQ_BODY
  });

  console.log({ response: response });

  return outputFolder;
}
