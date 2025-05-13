import Link from "next/link";
import { unauthorized } from "next/navigation";
import { QUERIES } from "@/server/db/queries";
import { ChevronRight } from "lucide-react";
import { tryCatch } from "@/lib/try-catch";
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
  const { data: parents, error } = await tryCatch(
    QUERIES.getAllParentsForFolder(folderId),
  );

  if (error) {
    console.error("Database error while fetching parent folders:", error);
    throw new Error("無法載入資料夾資訊，請稍後再試");
  }

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
