import { z } from "zod";
import DriveContents from "./drive-content";
import { QUERIES } from "@/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";
import { AuthButtons } from "./auth-buttons";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { ModeToggleButton } from "@/components/client-mode-toggle";
import { BreadcrumbNavSkeleton } from "./_components/skeletons/breadcrumb-nav-skeleton";
import { Suspense } from "react";

export default async function ForderPage(props: {
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

  // 取得該資料夾的 ownerId
  const currentFolderOwnerId = await QUERIES.getFolderOwner(parsedFolderId);
  const session = await auth();

  if (currentFolderOwnerId !== session.userId) {
    unauthorized();
  }

  return (
    <>
      <header className="flex items-center justify-between">
        <Suspense fallback={<BreadcrumbNavSkeleton />}>
          <BreadcrumbNav
            folderId={parsedFolderId}
            currentFolderOwnerId={currentFolderOwnerId}
          />
        </Suspense>
        <div className="flex items-center gap-6">
          <AuthButtons />
          <ModeToggleButton />
        </div>
      </header>
      <DriveContents
        currentFolderId={parsedFolderId}
        currentFolderOwnerId={currentFolderOwnerId}
      />
    </>
  );
}
