import { Context } from "telegraf";
import { userIsSubscribed } from "../lib/authentication";
import { getUserDownloadHistory } from "../lib/download";

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
