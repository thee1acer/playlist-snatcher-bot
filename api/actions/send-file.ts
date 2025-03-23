import { Readable } from "stream";
import { Context } from "vm";

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
