import Link from "next/link";
import { unauthorized } from "next/navigation";
import { QUERIES } from "@/server/db/queries";
import { ChevronRight } from "lucide-react";

interface Folder {
  id: number;
  name: string;
  ownerId: string;
}

interface BreadcrumbNavProps {
  folderId: number;
  currentFolderOwnerId: string;
}

// 此函式負責取得所有父資料夾並驗證 owner
async function getValidatedParents(
  folderId: number,
  currentFolderOwnerId: string,
): Promise<Folder[]> {
  const parents = await QUERIES.getAllParentsForFolder(folderId);
  const hasInvalidParent = parents.some(
    (parent: Folder) => parent.ownerId !== currentFolderOwnerId,
  );
  if (hasInvalidParent) {
    unauthorized();
  }
  return parents;
}

export async function BreadcrumbNav({
  folderId,
  currentFolderOwnerId,
}: BreadcrumbNavProps) {
  const parents = await getValidatedParents(folderId, currentFolderOwnerId);

  return (
    <nav className="flex items-center">
      <div>My Drive</div>
      <div className="flex items-center">
        {parents.map((folder) => (
          <div key={folder.id} className="inline-flex items-center">
            <ChevronRight size={16} className="mx-2" />
            <Link href={`/f/${folder.id}`}>{folder.name}</Link>
          </div>
        ))}
      </div>
    </nav>
  );
}
