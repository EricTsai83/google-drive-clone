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

export async function BreadcrumbNav({
  folderId,
  currentFolderOwnerId,
}: BreadcrumbNavProps) {
  const { data: parents, error } = await tryCatch(
    QUERIES.getAllParentsForFolder(folderId),
  );

  if (error) {
    throw new Error(
      "Connection error. We’re working on it. Please try again later.",
    );
  }

  const hasInvalidParent = parents.some(
    (parent: Folder) => parent.ownerId !== currentFolderOwnerId,
  );
  if (hasInvalidParent) {
    unauthorized();
  }

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
