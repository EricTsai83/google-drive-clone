import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { sql, eq, desc, and, lt, or } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";
import { files_table, folders_table } from "@/server/db/schema";

// Type definitions
const FolderCursorSchema = z.object({
  lastModified: z.date(),
  id: z.number(),
  phase: z.enum(["folders", "files"]),
});

export const folderRouter = createTRPCRouter({
  getFolderContents: protectedProcedure
    .input(
      z.object({
        folderId: z.number(),
        limit: z.number().min(1).max(100).default(20),
        cursor: FolderCursorSchema.nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { folderId, limit, cursor } = input;

      // 1) folders 子查詢
      const foldersQ = ctx.db
        .select({
          id: folders_table.id,
          name: folders_table.name,
          lastModified: folders_table.lastModified,
          type: folders_table.type,
          size: sql`NULL::integer`.as("size"),
        })
        .from(folders_table)
        .where(eq(folders_table.parent, folderId));

      // 2) files 子查詢
      const filesQ = ctx.db
        .select({
          id: files_table.id,
          name: files_table.name,
          lastModified: files_table.lastModified,
          type: files_table.type,
          size: files_table.size,
        })
        .from(files_table)
        .where(eq(files_table.parent, folderId));

      // 3) unionAll 並用 as() 成衍生表 unioned
      const unioned = unionAll(foldersQ, filesQ).as("unioned");

      // 4) 外層 select + 排序 + 分頁
      const baseQuery = ctx.db
        .select({
          id: unioned.id,
          name: unioned.name,
          lastModified: unioned.lastModified,
          type: unioned.type,
          size: unioned.size,
        })
        .from(unioned);

      // 添加 cursor 條件
      const whereClause = cursor
        ? and(
            or(
              // 文件夾階段
              and(
                eq(unioned.type, "folder"),
                sql`${cursor.phase} = 'folders'`,
                or(
                  lt(unioned.lastModified, cursor.lastModified),
                  and(
                    eq(unioned.lastModified, cursor.lastModified),
                    lt(unioned.id, cursor.id),
                  ),
                ),
              ),
              // 文件階段
              and(
                eq(unioned.type, "file"),
                or(
                  // 如果還在文件夾階段，取所有文件
                  sql`${cursor.phase} = 'folders'`,
                  // 如果已經在文件階段，取比當前文件更早的文件
                  and(
                    sql`${cursor.phase} = 'files'`,
                    or(
                      lt(unioned.lastModified, cursor.lastModified),
                      and(
                        eq(unioned.lastModified, cursor.lastModified),
                        lt(unioned.id, cursor.id),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          )
        : undefined;

      const pagedQ = baseQuery
        .where(whereClause)
        .orderBy(
          desc(eq(unioned.type, "folder")),
          desc(unioned.lastModified),
          desc(unioned.id),
        )
        .limit(limit + 1);

      // 5) 執行 SQL
      const prepared = pagedQ.prepare("pagedQ");
      const rows = await prepared.execute();
      const hasMore = rows.length > limit;

      // 6) 映射成前端型别
      const items = rows.map((r) => ({
        id: Number(r.id),
        name: r.name,
        lastModified: r.lastModified,
        type: r.type as "folder" | "file",
        size: r.type === "file" ? Number(r.size) : null,
      }));

      // 7) 確定下一個 cursor
      const lastItem = rows[rows.length - 1];
      let nextCursor = undefined;

      if (hasMore && lastItem) {
        // 如果最後一個項目是文件夾，繼續在文件夾階段
        if (lastItem.type === "folder") {
          nextCursor = {
            lastModified: lastItem.lastModified,
            id: Number(lastItem.id),
            phase: "folders" as const,
          };
        } else {
          // 如果最後一個項目是文件，進入文件階段
          nextCursor = {
            lastModified: lastItem.lastModified,
            id: Number(lastItem.id),
            phase: "files" as const,
          };
        }
      } else if (lastItem?.type === "folder") {
        // 如果沒有更多項目，但最後一個是文件夾，需要切換到文件階段
        // 使用最新的文件時間作為起始點
        const latestFile = await ctx.db
          .select({
            lastModified: files_table.lastModified,
            id: files_table.id,
          })
          .from(files_table)
          .where(eq(files_table.parent, folderId))
          .orderBy(desc(files_table.lastModified), desc(files_table.id))
          .limit(1);

        if (latestFile.length > 0 && latestFile[0]) {
          nextCursor = {
            lastModified: latestFile[0].lastModified,
            id: Number(latestFile[0].id),
            phase: "files" as const,
          };
        }
      }

      return {
        items,
        nextCursor,
      };
    }),
});
