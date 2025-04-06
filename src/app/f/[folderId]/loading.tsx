import { BreadcrumbNavSkeleton } from "./_components/skeletons/breadcrumb-nav-skeleton";
import { AuthButtonsSkeleton } from "./_components/skeletons/auth-buttons-skeleton";
import { CreateFolderDialogSkeleton } from "./_components/skeletons/create-folder-dialog-skeleton";
import { FileUploadDropzoneDialogSkeleton } from "./_components/skeletons/file-upload-dropzone-dialog-skeleton";
import { TableHeaderSkeleton } from "./_components/skeletons/table-header-skeleton";
import { ItemRowSkeletonList } from "./_components/skeletons/item-row-skeleton";
import ModeToggleSkeleton from "@/components/skeletons/mode-toggle-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        {/* 複製相同的布局，但使用骨架屏 */}
        <header className="mb-6 flex items-center justify-between">
          <BreadcrumbNavSkeleton />
          <div className="flex items-center gap-6">
            <AuthButtonsSkeleton />
            <ModeToggleSkeleton />
          </div>
        </header>

        <div className="mb-4 flex justify-between">
          <CreateFolderDialogSkeleton />
          <FileUploadDropzoneDialogSkeleton />
        </div>
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b bg-primary px-6 py-4">
            <TableHeaderSkeleton />
          </div>
          <ul className="bg-popover">
            <ItemRowSkeletonList count={3} />
          </ul>
        </div>
      </div>
    </div>
  );
}
