import { BreadcrumbNavSkeleton } from "./_components/skeletons/breadcrumb-nav-skeleton";
import { AuthButtonsSkeleton } from "./_components/skeletons/auth-buttons-skeleton";
import { CreateFolderDialogSkeleton } from "./_components/skeletons/create-folder-dialog-skeleton";
import { FileUploadDropzoneDialogSkeleton } from "./_components/skeletons/file-upload-dropzone-dialog-skeleton";
import { TableHeaderSkeleton } from "./_components/skeletons/table-header-skeleton";
import { ItemRowSkeletonList } from "./_components/skeletons/item-row-skeleton";
import ModeToggleSkeleton from "@/components/skeletons/mode-toggle-skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-hidden p-8">
        <div className="mx-auto flex h-full max-w-6xl flex-col">
          <header className="flex items-center justify-between">
            <BreadcrumbNavSkeleton />
            <div className="flex items-center gap-6">
              <AuthButtonsSkeleton />
              <ModeToggleSkeleton />
            </div>
          </header>

          <div className="mt-6 mb-4 flex justify-between">
            <CreateFolderDialogSkeleton />
            <FileUploadDropzoneDialogSkeleton />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden rounded-lg shadow-xl">
            <div className="bg-primary flex-shrink-0 border-b px-6 py-4">
              <TableHeaderSkeleton />
            </div>
            <ul className="bg-popover flex h-full flex-col overflow-y-auto">
              <ItemRowSkeletonList count={6} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
