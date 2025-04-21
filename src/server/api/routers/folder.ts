import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { sql, eq, desc, and, lt, or } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";
import { files_table, folders_table } from "@/server/db/schema";

export const folderRouter = createTRPCRouter({
  getFolderContents: protectedProcedure
    .input(
      z.object({
        folderId: z.number(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z
          .object({
            lastModified: z.date(),
            id: z.number(),
            phase: z.enum(["folders", "files"]),
          })
          .nullish(),
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
              // 1. 如果還在取 folder 階段，取比這個 folder 更早的 folder
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
              // 2. 如果已經開始取 file 階段，取比這個 file 更早的 file
              and(
                eq(unioned.type, "file"),
                sql`${cursor.phase} = 'files'`,
                or(
                  lt(unioned.lastModified, cursor.lastModified),
                  and(
                    eq(unioned.lastModified, cursor.lastModified),
                    lt(unioned.id, cursor.id),
                  ),
                ),
              ),
              // 3. 如果剛從 folder 階段轉到 file 階段，取所有的 file
              and(eq(unioned.type, "file"), sql`${cursor.phase} = 'folders'`),
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
      if (hasMore) rows.pop();

      // 6) 映射成前端型别
      const items = rows.map((r) => ({
        id: Number(r.id),
        name: r.name,
        lastModified: r.lastModified,
        type: r.type as "folder" | "file",
        size: r.type === "file" ? Number(r.size) : null,
      }));

      const lastItem = rows[rows.length - 1];
      const nextPhase = lastItem?.type === "file" ? "files" : "folders";

      return {
        items,
        nextCursor:
          hasMore && lastItem
            ? {
                lastModified: lastItem.lastModified,
                id: Number(lastItem.id),
                phase: nextPhase,
              }
            : undefined,
      };
    }),
});
