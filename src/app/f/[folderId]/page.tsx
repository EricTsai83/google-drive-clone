import { z } from "zod";
import DriveContents from "./drive-content";
import { QUERIES } from "@/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const { data, success } = z
    .object({
      folderId: z.coerce.number(),
    })
    .safeParse(params);

  if (!success) return <div>Invalid folder ID</div>;

  const parsedFolderId = data.folderId;

  const currentFolderOwnerId = await QUERIES.getFolderOwner(parsedFolderId);
  const session = await auth();

  if (currentFolderOwnerId !== session.userId) {
    unauthorized();
  }

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getFiles(parsedFolderId),
    QUERIES.getAllParentsForFolder(parsedFolderId),
  ]);

  // Check ownership of all items
  const hasInvalidFolder = folders.some(
    (folder) => folder.ownerId !== currentFolderOwnerId,
  );
  const hasInvalidFile = files.some(
    (file) => file.ownerId !== currentFolderOwnerId,
  );
  const hasInvalidParent = parents.some(
    (parent) => parent.ownerId !== currentFolderOwnerId,
  );

  if (hasInvalidFolder || hasInvalidFile || hasInvalidParent) {
    unauthorized();
  }

  return (
    <DriveContents
      folders={folders}
      files={files}
      parents={parents}
      currentFolderId={parsedFolderId}
    />
  );
}
