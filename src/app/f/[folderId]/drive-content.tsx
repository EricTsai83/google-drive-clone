import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import type { folders_table } from "@/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { CreateFolderDialog } from "@/app/f/[folderId]/_components/create-folder-dialog";
import { FileUploadDropzoneDialog } from "./_components/file-upload-dropzone-dialog";
import ModeToggle from "@/components/mode-toggle";
import { Footer } from "@/components/footer";
// Skeleton components
import { BreadcrumbNavSkeleton } from "./_components/skeletons/breadcrumb-nav-skeleton";
import { AuthButtonsSkeleton } from "./_components/skeletons/auth-buttons-skeleton";
import { CreateFolderDialogSkeleton } from "./_components/skeletons/create-folder-dialog-skeleton";
import { FileUploadDropzoneDialogSkeleton } from "./_components/skeletons/file-upload-dropzone-dialog-skeleton";
import { TableHeaderSkeleton } from "./_components/skeletons/table-header-skeleton";
import { ItemRowSkeletonList } from "./_components/skeletons/item-row-skeleton";
import ModeToggleSkeleton from "@/components/skeletons/mode-toggle-skeleton";
import TableBody from "./_components/table-body";

type DriveContentsProps = {
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
  currentFolderOwnerId: string;
};

export default function DriveContents({
  parents,
  currentFolderId,
  currentFolderOwnerId,
}: DriveContentsProps) {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-hidden p-8">
        <div className="mx-auto flex h-full max-w-6xl flex-col">
          <header className="flex items-center justify-between">
            <Suspense fallback={<BreadcrumbNavSkeleton />}>
              <BreadcrumbNav parents={parents} />
            </Suspense>
            <div className="flex items-center gap-6">
              <Suspense fallback={<AuthButtonsSkeleton />}>
                <AuthButtons />
              </Suspense>
              <Suspense fallback={<ModeToggleSkeleton />}>
                <ModeToggle />
              </Suspense>
            </div>
          </header>

          <div className="mt-6 mb-4 flex justify-between">
            <Suspense fallback={<CreateFolderDialogSkeleton />}>
              <CreateFolderDialog currentFolderId={currentFolderId} />
            </Suspense>
            <Suspense fallback={<FileUploadDropzoneDialogSkeleton />}>
              <FileUploadDropzoneDialog currentFolderId={currentFolderId} />
            </Suspense>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden rounded-lg shadow-xl">
            <div className="bg-primary flex-shrink-0 border-b px-6 py-4">
              <Suspense fallback={<TableHeaderSkeleton />}>
                <TableHeader />
              </Suspense>
            </div>
            <Suspense fallback={<ItemRowSkeletonList count={6} />}>
              <TableBody
                folderId={currentFolderId}
                currentFolderOwnerId={currentFolderOwnerId}
              />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function BreadcrumbNav({
  parents,
}: {
  parents: DriveContentsProps["parents"];
}) {
  return (
    <nav>
      <ol className="inline-flex items-center space-x-2">
        <li>
          <Link href="/" className="cursor-pointer">
            My Drive
          </Link>
        </li>
        {parents.map((folder) => (
          <li key={folder.id} className="inline-flex items-center">
            <ChevronRight size={16} className="mx-2" />
            <Link href={`/f/${folder.id}`}>{folder.name}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function AuthButtons() {
  return (
    <div className="h-7 w-7">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
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
