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
    return "Welcome back" + firstName + ". How can I help? 😊";
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
    ". Welcom to Playlist Snatcher - your easy to user playlist downloader. How can I help? 😊"
  );
}
