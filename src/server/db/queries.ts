import "server-only";

import { db } from "@/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "@/server/db/schema";
import { eq, isNull, and } from "drizzle-orm/expressions";

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
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(foldersSchema)
        .where(eq(foldersSchema.id, currentId));

      if (!folder[0]) {
        throw new Error("parent folder not found");
      }

      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
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
