import { z } from "zod";
import DriveContents from "./drive-content";
import { QUERIES } from "@/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { BreadcrumbNavSkeleton } from "./_components/skeletons/breadcrumb-nav-skeleton";
import { Suspense } from "react";
import { tryCatch } from "@/lib/try-catch";
import { DatabaseError } from "@/lib/exceptions";

export default async function ForderPage(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const { data, success } = z
    .object({
      folderId: z.coerce.number(),
    })
    .safeParse(params);

  // TODO: Improve the error handling
  if (!success) return <div>Invalid folder ID</div>;

  const parsedFolderId = data.folderId;

  // // 取得該資料夾的 ownerId
  const { data: currentFolderOwnerId, error } = await tryCatch(
    QUERIES.getFolderOwner(parsedFolderId),
  );

  if (error) {
    throw new DatabaseError();
  }

  const { userId } = await auth();

  if (!userId || !currentFolderOwnerId || userId !== currentFolderOwnerId) {
    unauthorized();
  }

  return (
    <>
      <Suspense fallback={<BreadcrumbNavSkeleton />}>
        <BreadcrumbNav
          folderId={parsedFolderId}
          currentFolderOwnerId={currentFolderOwnerId}
        />
      </Suspense>
      <DriveContents currentFolderId={parsedFolderId} />
    </>
  );
}
