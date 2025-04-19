import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { isNull, eq, gt } from "drizzle-orm";

export const folderRouter = createTRPCRouter({
  getFolderContents: protectedProcedure
    .input(
      z.object({
        folderId: z.number().optional(), // undefined for root folder
        cursor: z
          .object({
            folderId: z.number().optional(),
            fileId: z.number().optional(),
          })
          .optional(),
        limit: z.number().min(1).max(50).default(10).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { folderId, cursor, limit = 10 } = input;

      // Get folders with cursor-based pagination
      const folders = await ctx.db.query.folders_table.findMany({
        where: (folders_table, { and }) =>
          and(
            folderId === undefined
              ? isNull(folders_table.parent)
              : eq(folders_table.parent, folderId),
            cursor?.folderId
              ? gt(folders_table.id, cursor.folderId)
              : undefined,
          ),
        orderBy: (folders_table, { asc }) => [asc(folders_table.id)],
        limit: limit + 1, // Fetch one extra to determine if there are more items
      });

      // Get files with cursor-based pagination
      const files = await ctx.db.query.files_table.findMany({
        where: (files_table, { and }) =>
          and(
            folderId === undefined
              ? isNull(files_table.parent)
              : eq(files_table.parent, folderId),
            cursor?.fileId ? gt(files_table.id, cursor.fileId) : undefined,
          ),
        orderBy: (files_table, { asc }) => [asc(files_table.id)],
        limit: limit + 1, // Fetch one extra to determine if there are more items
      });

      // Process folders
      let nextFolderCursor: number | undefined = undefined;
      if (folders.length > limit) {
        const nextFolder = folders.pop();
        nextFolderCursor = nextFolder?.id;
      }

      // Process files
      let nextFileCursor: number | undefined = undefined;
      if (files.length > limit) {
        const nextFile = files.pop();
        nextFileCursor = nextFile?.id;
      }

      // Only return items if we have a cursor or it's the first page
      const shouldReturnFolders = !cursor || cursor.folderId !== undefined;
      const shouldReturnFiles = !cursor || cursor.fileId !== undefined;

      // If we have no more items for both folders and files, return null for nextCursor
      const hasMoreItems =
        nextFolderCursor !== undefined || nextFileCursor !== undefined;

      return {
        folders: shouldReturnFolders
          ? folders.map((folder) => ({
              id: folder.id,
              name: folder.name,
              lastModified: folder.lastModified,
              type: "folder" as const,
              ownerId: folder.ownerId,
              parent: folder.parent,
              createdAt: folder.createdAt,
            }))
          : [],
        files: shouldReturnFiles
          ? files.map((file) => ({
              id: file.id,
              name: file.name,
              size: file.size,
              lastModified: file.lastModified,
              type: "file" as const,
              ownerId: file.ownerId,
              parent: file.parent,
              createdAt: file.createdAt,
              utFileKey: file.utFileKey,
              url: file.url,
            }))
          : [],
        nextCursor: hasMoreItems
          ? {
              folderId: nextFolderCursor,
              fileId: nextFileCursor,
            }
          : null,
      };
    }),
});
