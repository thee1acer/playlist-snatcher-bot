import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkIfUserExists(
  id: number,
  username: string,
  firstName: string,
  lastName: string
): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { telegramId: id.toString() }
  });

  //if user exists
  if (user) {
    return "Welcome back " + firstName + ". How can I help? 😊";
  }

  //else if user is using bot for the first time
  await prisma.user.upsert({
    where: { telegramId: id.toString() },
    update: {
      firstName: firstName,
      lastName: lastName,
      username: username
    },
    create: {
      telegramId: id.toString(),
      username: username || null,
      firstName: firstName,
      lastName: lastName
    }
  });

  return (
    "Hello " +
    firstName +
    ". Welcome to Playlist Snatcher - your easy to use playlist downloader. How can I help? 😊"
  );
}

export async function userIsSubscribed(id: number) {
  const user = await prisma.user.findUnique({
    where: { telegramId: id.toString() },
    select: {
      id: true
    }
  });

  const sub = await prisma.userSubscription.findFirst({
    where: {
      userId: user?.id
    }
  });

  const subscriptionType = sub
    ? await prisma.subscription.findUnique({
        where: {
          subscriptionName: sub.subscriptionStatus
        }
      })
    : null;

  if (sub == null) return null;

  return { subscription: sub, subscriptionType: subscriptionType };
}

export async function getUserDownloadHistory(id: number) {
  const user = await prisma.user.findUnique({
    where: { telegramId: id.toString() },
    select: {
      id: true
    }
  });

  return await prisma.downloadHistory.findMany({
    where: { userId: id }
  });
}
