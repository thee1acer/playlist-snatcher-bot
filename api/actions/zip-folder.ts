import { put } from "@vercel/blob";
import path from "path";
import { Context } from "vm";

import fs from "fs";
import archiver from "archiver";

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
