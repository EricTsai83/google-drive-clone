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
  const contents = await QUERIES.getFolderContents(folderId);

  // 驗證 folders 與 files 中所有項目的 ownerId 是否與 currentFolderOwnerId 相同
  const hasInvalidContents = contents.some(
    (content) => content.ownerId !== currentFolderOwnerId,
  );

  if (hasInvalidContents) {
    unauthorized();
  }

  return (
    <ul className="bg-popover flex h-full flex-col overflow-y-auto">
      {contents.map((content) => (
        <ItemRow key={content.id} item={content} type={content.type} />
      ))}
    </ul>
  );
}
