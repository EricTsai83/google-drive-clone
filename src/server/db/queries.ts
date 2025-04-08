import "server-only";

import { db } from "@/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "@/server/db/schema";
import { eq, isNull, and } from "drizzle-orm/expressions";
import { sql } from "drizzle-orm";

export const QUERIES = {
  getFolderOwner: async function (folderId: number) {
    const [folder] = await db
      .select({ ownerId: foldersSchema.ownerId })
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId));
    return folder?.ownerId;
  },
  getFileOwner: async function (fileId: number) {
    const [folder] = await db
      .select({ ownerId: filesSchema.ownerId })
      .from(filesSchema)
      .where(eq(filesSchema.id, fileId));
    return folder?.ownerId;
  },
  getFolders: function (folderId: number) {
    return db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.parent, folderId))
      .orderBy(foldersSchema.id);
  },
  getFiles: function (folderId: number) {
    return db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.parent, folderId))
      .orderBy(filesSchema.id);
  },
  getAllParentsForFolder: async function (folderId: number) {
    const parents = await db.execute<{
      id: number;
      ownerId: string;
      name: string;
      parent: number | null;
      createdAt: Date;
      lastModified: Date;
    }>(
      sql`
        WITH RECURSIVE folder_hierarchy AS (
          -- Base case: start with the given folder
          SELECT id, owner_id, name, parent, created_at, last_modified
          FROM "google-drive_folders_table"
          WHERE id = ${folderId}
          
          UNION ALL
          
          -- Recursive case: join with parent folders
          SELECT f.id, f.owner_id, f.name, f.parent, f.created_at, f.last_modified
          FROM "google-drive_folders_table" f
          INNER JOIN folder_hierarchy h ON f.id = h.parent
        )
        SELECT 
          id,
          owner_id as "ownerId",
          name,
          parent,
          created_at as "createdAt",
          last_modified as "lastModified"
        FROM folder_hierarchy
        ORDER BY created_at;
      `,
    );

    if (parents.length === 0) {
      throw new Error("folder not found");
    }

    return parents;
  },
  getFolderById: async function (folderId: number) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId));
    return folder[0];
  },
  getRootFolderForUser: async function (userId: string) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(
        and(eq(foldersSchema.ownerId, userId), isNull(foldersSchema.parent)),
      );
    return folder[0];
  },
  getFile: async function (fileId: number) {
    const file = await db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.id, fileId));
    return file[0];
  },
  getFolderContents: async function (folderId: number) {
    const contents = await db
      .select({
        type: sql<"folder" | "file">`'folder'::text`.as("type"),
        id: foldersSchema.id,
        name: foldersSchema.name,
        createdAt: foldersSchema.createdAt,
        lastModified: foldersSchema.lastModified,
        ownerId: foldersSchema.ownerId,
        parent: foldersSchema.parent,
        // 為檔案特有的欄位提供 NULL 值
        size: sql`NULL`.as("size"),
        url: sql`NULL`.as("url"),
        utFileKey: sql`NULL`.as("utFileKey"),
      })
      .from(foldersSchema)
      .where(eq(foldersSchema.parent, folderId))
      .union(
        db
          .select({
            type: sql<"folder" | "file">`'file'::text`.as("type"),
            id: filesSchema.id,
            name: filesSchema.name,
            createdAt: filesSchema.createdAt,
            lastModified: filesSchema.lastModified,
            ownerId: filesSchema.ownerId,
            parent: filesSchema.parent,
            size: filesSchema.size,
            url: filesSchema.url,
            utFileKey: filesSchema.utFileKey,
          })
          .from(filesSchema)
          .where(eq(filesSchema.parent, folderId)),
      )
      .orderBy(sql`type DESC`, sql`name ASC`);
    return contents;
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      utFileKey: string;
      name: string;
      size: number;
      url: string;
      parent: number;
    };
    userId: string;
  }) {
    return await db
      .insert(filesSchema)
      .values({ ...input.file, ownerId: input.userId });
  },

  onboardUser: async function (userId: string) {
    const rootFolder = await db
      .insert(foldersSchema)
      .values({
        name: "Root",
        parent: null,
        ownerId: userId,
      })
      .returning();

    const rootFolderId = rootFolder[0]!.id;

    const nestedFolder = await db
      .insert(foldersSchema)
      .values({
        name: "Nested Folder",
        parent: rootFolderId,
        ownerId: userId,
      })
      .returning();

    const nestedFolder2 = await db
      .insert(foldersSchema)
      .values({
        name: "Nested Folder 2",
        parent: nestedFolder[0]!.id,
        ownerId: userId,
      })
      .returning();

    await db.insert(foldersSchema).values([
      {
        name: "Trash",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Shared",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Documents",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Nested Folder 3",
        parent: nestedFolder2[0]!.id,
        ownerId: userId,
      },
    ]);

    return rootFolderId;
  },
};
