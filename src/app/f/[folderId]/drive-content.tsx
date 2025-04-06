import { ChevronRight } from "lucide-react";
import { ItemRow } from "./_components/item-row";
import type { files_table, folders_table } from "@/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { CreateFolderDialog } from "@/app/f/[folderId]/_components/create-folder-dialog";
import { FileUploadDropzoneDialog } from "./_components/file-upload-dropzone-dialog";
import ModeToggle from "@/components/mode-toggle";

type DriveContentsProps = {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
};

export default function DriveContents({
  files,
  folders,
  parents,
  currentFolderId,
}: DriveContentsProps) {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <BreadcrumbNav parents={parents} />
          <div className="flex items-center gap-6">
            <AuthButtons />
            <ModeToggle />
          </div>
        </header>

        <div className="mb-4 flex justify-between">
          <CreateFolderDialog currentFolderId={currentFolderId} />
          <FileUploadDropzoneDialog currentFolderId={currentFolderId} />
        </div>

        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b bg-primary px-6 py-4">
            <TableHeader />
          </div>
          <ul className="bg-popover">
            {folders.map((folder) => (
              <ItemRow key={folder.id} item={folder} type="folder" />
            ))}
            {files.map((file) => (
              <ItemRow key={file.id} item={file} type="file" />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BreadcrumbNav({
  parents,
}: {
  parents: DriveContentsProps["parents"];
}) {
  return (
    <div className="flex items-center">
      <Link href="/" className="mr-2 cursor-pointer">
        My Drive
      </Link>
      {parents.map((folder) => (
        <div key={folder.id} className="flex items-center">
          <ChevronRight className="mx-2" size={16} />
          <Link href={`/f/${folder.id}`} className="">
            {folder.name}
          </Link>
        </div>
      ))}
    </div>
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
