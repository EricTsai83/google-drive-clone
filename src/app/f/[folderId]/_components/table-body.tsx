import { unauthorized } from "next/navigation";
import { QUERIES } from "@/server/db/queries";
import { ItemRow } from "./item-row";

export type TableBodyProps = {
  folderId: number;
  currentFolderOwnerId: string;
};

export default async function TableBody({
  folderId,
  currentFolderOwnerId,
}: TableBodyProps) {
  // 同時發送請求取得資料夾與檔案
  const [folders, files] = await Promise.all([
    QUERIES.getFolders(folderId),
    QUERIES.getFiles(folderId),
  ]);

  // 驗證 folders 與 files 中所有項目的 ownerId 是否與 currentFolderOwnerId 相同
  const hasInvalidFolder = folders.some(
    (folder) => folder.ownerId !== currentFolderOwnerId,
  );
  const hasInvalidFile = files.some(
    (file) => file.ownerId !== currentFolderOwnerId,
  );

  if (hasInvalidFolder || hasInvalidFile) {
    unauthorized();
  }

  return (
    <ul className="bg-popover flex h-full flex-col overflow-y-auto">
      {folders.map((folder) => (
        <ItemRow key={folder.id} item={folder} type="folder" />
      ))}
      {files.map((file) => (
        <ItemRow key={file.id} item={file} type="file" />
      ))}
    </ul>
  );
}
