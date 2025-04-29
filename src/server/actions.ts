"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { eq, and, sql } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );

  if (!file) {
    return { error: "File not found" };
  }

  // delete the file from uploadthing
  const utApiResult = await utApi.deleteFiles([file.utFileKey]);

  console.log(utApiResult);

  // delete the file from the database
  const dbDeleteResult = await db
    .delete(files_table)
    .where(eq(files_table.id, fileId));

  console.log(dbDeleteResult);

  // use this method to force a refresh of the page
  // this is the same way that revalidatePath works but without the need for a specific path
  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export async function deleteFolder(folderId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const [folder] = await db
    .select()
    .from(folders_table)
    .where(
      and(
        eq(folders_table.id, folderId),
        eq(folders_table.ownerId, session.userId),
      ),
    );

  if (!folder) {
    return { error: "Folder not found" };
  }

  const recursiveQuery = sql`
    WITH RECURSIVE folder_tree AS (
      SELECT id FROM ${folders_table} WHERE id = ${folderId}
      
      UNION ALL
      
      SELECT f.id
      FROM ${folders_table} f
      JOIN folder_tree ft ON f.parent = ft.id
    )
    SELECT 
      f.ut_file_key as "utFileKey"
    FROM folder_tree ft
    LEFT JOIN ${files_table} f ON f.parent = ft.id
    WHERE f.ut_file_key IS NOT NULL
  `;

  const filesResult = await db.execute<{ utFileKey: string }>(recursiveQuery);
  const fileKeys = filesResult.map((f) => f.utFileKey).filter(Boolean);

  // Delete uploadthing files if any exist
  if (fileKeys.length > 0) {
    const utApiResult = await utApi.deleteFiles(fileKeys);
    console.log("Deleted files from uploadthing:", utApiResult);
  }

  // 資料庫會自動級聯刪除相關的資料夾和檔案
  await db.delete(folders_table).where(eq(folders_table.id, folderId));

  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export async function createFolder(name: string, parent: number | null) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  if (!name || name.trim().length === 0) {
    return { error: "Folder name is required" };
  }

  if (parent !== null) {
    const [parentFolder] = await db
      .select()
      .from(folders_table)
      .where(
        and(
          eq(folders_table.id, parent),
          eq(folders_table.ownerId, session.userId),
        ),
      );

    if (!parentFolder) {
      return { error: "Parent folder not found" };
    }
  }

  await db.insert(folders_table).values({
    name: name.trim(),
    parent,
    ownerId: session.userId,
  });

  // const c = await cookies();
  // c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export async function renameFolder(folderId: number, newName: string) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  if (!newName || newName.trim().length === 0) {
    return { error: "Folder name is required" };
  }

  const [folder] = await db
    .select()
    .from(folders_table)
    .where(
      and(
        eq(folders_table.id, folderId),
        eq(folders_table.ownerId, session.userId),
      ),
    );

  if (!folder) {
    return { error: "Folder not found" };
  }

  await db
    .update(folders_table)
    .set({ name: newName.trim() })
    .where(eq(folders_table.id, folderId));

  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export async function renameFile(fileId: number, newName: string) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  if (!newName || newName.trim().length === 0) {
    return { error: "File name is required" };
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );

  if (!file) {
    return { error: "File not found" };
  }

  await db
    .update(files_table)
    .set({ name: newName.trim() })
    .where(eq(files_table.id, fileId));

  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
