import { z } from "zod";
import DriveContents from "./drive-content";
import { QUERIES } from "@/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";
import { BreadcrumbNav, AuthButtons } from "./header";
import { ModeToggleButton } from "@/components/mode-toggle";

export default async function DrivePage(props: {
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

  // 取得上層資料夾
  const parents = await QUERIES.getAllParentsForFolder(parsedFolderId);

  // 驗證所有上層父資料夾的 owner 是否正確
  const hasInvalidParent = parents.some(
    (parent) => parent.ownerId !== currentFolderOwnerId,
  );
  if (hasInvalidParent) {
    unauthorized();
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-hidden p-8">
        <div className="mx-auto flex h-full max-w-6xl flex-col">
          <header className="flex items-center justify-between">
            <BreadcrumbNav parents={parents} />
            <div className="flex items-center gap-6">
              <AuthButtons />
              <ModeToggleButton />
            </div>
          </header>
          <DriveContents
            currentFolderId={parsedFolderId}
            currentFolderOwnerId={currentFolderOwnerId}
          />
        </div>
      </div>
    </div>
  );
}
