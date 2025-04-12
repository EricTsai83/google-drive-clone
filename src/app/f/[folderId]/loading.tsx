import { BreadcrumbNavSkeleton } from "./_components/skeletons/breadcrumb-nav-skeleton";
import { CreateFolderDialogSkeleton } from "./_components/skeletons/create-folder-dialog-skeleton";
import { FileUploadDropzoneDialogSkeleton } from "./_components/skeletons/file-upload-dropzone-dialog-skeleton";
import { TableBodySkeleton } from "./_components/skeletons/item-row-skeleton";

import { TableHeader } from "./_components/table-header";

export default function Loading() {
  return (
    <>
      <BreadcrumbNavSkeleton />
      <div className="mt-6 mb-4 flex justify-between">
        <CreateFolderDialogSkeleton />
        <FileUploadDropzoneDialogSkeleton />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg shadow-xl">
        <div className="bg-primary flex-shrink-0 border-b px-6 py-4">
          <TableHeader />
        </div>
        <ul className="bg-popover flex h-full flex-col overflow-y-auto">
          <TableBodySkeleton />
        </ul>
      </div>
    </>
  );
}
