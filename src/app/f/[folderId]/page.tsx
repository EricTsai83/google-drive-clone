import { z } from "zod";
import DriveContents from "./drive-content";
import { QUERIES } from "@/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { BreadcrumbNavSkeleton } from "./_components/skeletons/breadcrumb-nav-skeleton";
import { Suspense } from "react";
import { hasPermission } from "@/lib/auth";

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

  // 取得該資料夾的 ownerId
  const currentFolderOwnerId = await QUERIES.getFolderOwner(parsedFolderId);
  const { userId, sessionClaims } = await auth();

  if (!userId || !sessionClaims || !currentFolderOwnerId) {
    unauthorized();
  }

  const user = {
    id: userId,
    roles: sessionClaims.roles || ["user"], // Since webhooks are not processed in real-time, if a user's roles are undefined, the claim should fall back to ["user"].
    blockedBy: ["1"],
  };

  console.log("======", user);

  hasPermission(user, "folders", "view", {
    id: parsedFolderId,
    ownerId: currentFolderOwnerId,
  });
  // if (currentFolderOwnerId !== session.userId) {
  //   unauthorized();
  // }

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
