import { Suspense } from "react";
import { CreateFolderDialog } from "@/app/f/[folderId]/_components/create-folder-dialog";
import { FileUploadDropzoneDialog } from "./_components/file-upload-dropzone-dialog";
import { Footer } from "@/components/footer";
import TableBody from "./_components/table-body";
// Skeleton components
import { ItemRowSkeletonList } from "./_components/skeletons/item-row-skeleton";

type DriveContentsProps = {
  currentFolderId: number;
  currentFolderOwnerId: string;
};

export default function DriveContents({
  currentFolderId,
  currentFolderOwnerId,
}: DriveContentsProps) {
  return (
    <>
      <div className="mt-6 mb-4 flex justify-between">
        <CreateFolderDialog currentFolderId={currentFolderId} />

        <FileUploadDropzoneDialog currentFolderId={currentFolderId} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-lg shadow-xl">
        <div className="bg-primary flex-shrink-0 border-b px-6 py-4">
          <TableHeader />
        </div>
        <Suspense fallback={<ItemRowSkeletonList count={9} />}>
          <TableBody
            folderId={currentFolderId}
            currentFolderOwnerId={currentFolderOwnerId}
          />
        </Suspense>
      </div>

      <Footer />
    </>
  );
}

function TableHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 text-sm font-medium">
      <div className="col-span-6">Name</div>
      <div className="col-span-2">Last Modified</div>
      <div className="col-span-3">Size</div>
      <div className="col-span-1"></div>
    </div>
  );
}
