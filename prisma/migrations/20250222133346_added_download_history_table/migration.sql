-- CreateTable
CREATE TABLE "DownloadHistory" (
    "id" SERIAL NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "downloadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DownloadHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DownloadHistory" ADD CONSTRAINT "DownloadHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
