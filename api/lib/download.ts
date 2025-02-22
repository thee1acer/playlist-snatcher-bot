import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserDownloadHistory(id: number) {
  const user = await prisma.user.findUnique({
    where: { telegramId: id.toString() },
    select: {
      id: true
    }
  });

  if (user == null) return null;

  return await prisma.downloadHistory.findMany({
    where: { userId: user.id }
  });
}

export async function getUserDownloadHistoryByHistoryId(historyId: string) {
  return await prisma.downloadHistory.findFirst({
    where: { id: Number(historyId) }
  });
}
