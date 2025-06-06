import { MUTATIONS, QUERIES } from "@/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { fileUploadRatelimit } from "@/lib/ratelimit";
import { hasPermission } from "@/lib/auth";
import { tryCatch } from "@/lib/try-catch";
import { DatabaseError, FileUploadError } from "@/lib/exceptions";

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

      const authCheckUser = {
        roles: user.sessionClaims.roles || ["user"],
        id: user.userId,
      };

      const ignoreRateLimit = hasPermission(
        authCheckUser,
        "rateLimit",
        "ignore",
      );

      if (!ignoreRateLimit) {
        // 檢查當前上傳的檔案數量
        const uploadingFileCount = files.length;

        // 先檢查用戶的剩餘上傳限制，但不消耗配額
        const { remaining, reset } = await fileUploadRatelimit.getRemaining(
          user.userId,
        );

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
      }

      const { data: folder, error } = await tryCatch(
        QUERIES.getFolderById(input.folderId),
      );

      if (error) {
        throw new DatabaseError();
      }

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

      const { error } = await tryCatch(
        MUTATIONS.createFile({
          file: {
            utFileKey: file.key,
            name: file.name,
            size: file.size,
            url: file.ufsUrl,
            parent: metadata.parentId,
          },
          userId: metadata.userId,
        }),
      );

      if (error) {
        throw new FileUploadError(
          `Failed to save file "${file.name}" metadata to database. Please try uploading again.`,
        );
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
