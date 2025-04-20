import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { sql, eq, desc } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";
import { files_table, folders_table } from "@/server/db/schema";

export const folderRouter = createTRPCRouter({
  getFolderContents: protectedProcedure
    .input(
      z.object({
        folderId: z.number(),
        limit: z.number().min(1).max(100).default(20),
        // cursor 由前端维护：最后一条的 type/ts/id
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { folderId, limit, cursor } = input;
      const offset = cursor ?? 0;

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
      const pagedQ = ctx.db
        .select({
          id: unioned.id,
          name: unioned.name,
          lastModified: unioned.lastModified,
          type: unioned.type,
          size: unioned.size,
        })
        .from(unioned)
        .orderBy(
          // folder 全部排前面
          desc(eq(unioned.type, "folder")),
          // 同類型内部再按時間倒序
          desc(unioned.lastModified),
        )
        .limit(limit + 1)
        .offset(offset);

      // 5) 執行 SQL
      // 用 prepare 後，Drizzle 才會把把查詢的輸出類型固化到 PreparedQuery<…> 的泛型裡，TypeScript 才會知道查詢結果的型別，並且 column name 的 alias 才會被記住
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

      return {
        items,
        nextCursor: hasMore ? offset + limit : undefined,
      };
    }),
});
