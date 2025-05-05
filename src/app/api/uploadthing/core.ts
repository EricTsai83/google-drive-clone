import { MUTATIONS, QUERIES } from "@/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { fileUploadRatelimit } from "@/lib/ratelimit";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  driveUploader: f({
    blob: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "32MB",
      maxFileCount: 10,
    },
  })
    .input(
      z.object({
        folderId: z.number(),
      }),
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input, files }) => {
      // This code runs on your server before upload
      const user = await auth();

      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user.userId) throw new UploadThingError("Unauthorized");

      // 檢查當前上傳的檔案數量
      const uploadingFileCount = files.length;

      // 先檢查用戶的剩餘上傳限制，但不消耗配額
      const { remaining, reset } = await fileUploadRatelimit.getRemaining(
        user.userId,
      );

      console.log("Current time (UTC):", new Date().toISOString());
      console.log("Current time (Local):", new Date().toLocaleString());
      console.log("Reset timestamp:", reset);
      console.log("Reset time (UTC):", new Date(reset).toISOString());
      console.log("Reset time (Local):", new Date(reset).toLocaleString());
      console.log("uploadingFileCount", uploadingFileCount);

      // 如果要上傳的檔案數量超過剩餘限制，直接拒絕
      if (uploadingFileCount > remaining) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError(
          `Cannot upload ${uploadingFileCount} files. You can only upload ${remaining} more files today. Limit resets at ${new Date(reset).toLocaleString()}`,
        );
      }

      // 確認可以上傳後，才實際消耗配額
      const { success } = await fileUploadRatelimit.limit(user.userId, {
        rate: uploadingFileCount,
      });

      if (!success) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError(
          `Daily upload limit reached. You can upload ${remaining} more files today. Limit resets at ${new Date(reset).toLocaleString()}`,
        );
      }

      const folder = await QUERIES.getFolderById(input.folderId);

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!folder) throw new UploadThingError("Folder not found");

      if (folder.ownerId !== user.userId)
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId, parentId: input.folderId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This function if called by uploadthing server when the file is uploaded
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      try {
        await MUTATIONS.createFile({
          file: {
            utFileKey: file.key,
            name: file.name,
            size: file.size,
            url: file.ufsUrl,
            parent: metadata.parentId,
          },
          userId: metadata.userId,
        });

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Error saving file to database:", error);
        throw new Error("Error saving file to database");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
