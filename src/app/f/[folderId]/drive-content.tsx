import { ChevronRight } from "lucide-react";
import { ItemRow } from "./_components/item-row";
import type { files_table, folders_table } from "@/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { CreateFolderDialog } from "@/app/f/[folderId]/_components/create-folder-dialog";
import { FileUploadDropzoneDialog } from "./_components/file-upload-dropzone-dialog";
import ModeToggle from "@/components/mode-toggle";
import { Footer } from "@/components/footer";

type TableBodyProps = {
  folders: (typeof folders_table.$inferSelect)[];
  files: (typeof files_table.$inferSelect)[];
};

type DriveContentsProps = {
  files: TableBodyProps["files"];
  folders: TableBodyProps["folders"];
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
    // 使用 h-screen 確保有明確的視窗高度
    <div className="flex h-screen flex-col">
      {/* 主要內容區域使用 padding 並限制溢出 */}
      <div className="flex-1 overflow-hidden p-8">
        <div className="mx-auto flex h-full max-w-6xl flex-col">
          <header className="flex items-center justify-between">
            <BreadcrumbNav parents={parents} />
            <div className="flex items-center gap-6">
              <AuthButtons />
              <ModeToggle />
            </div>
          </header>

          <div className="mt-6 mb-4 flex justify-between">
            <CreateFolderDialog currentFolderId={currentFolderId} />
            <FileUploadDropzoneDialog currentFolderId={currentFolderId} />
          </div>

          {/* 表格容器使用剩餘空間 */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-lg shadow-xl">
            <div className="bg-primary flex-shrink-0 border-b px-6 py-4">
              <TableHeader />
            </div>
            <TableBody files={files} folders={folders} />
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

// function TableBody({ folders, files }: TableBodyProps) {
//   return (
//     <ul className="bg-popover flex-1 overflow-y-auto">
//       <div className="h-20 border-b"></div>
//       <div className="h-20 border-b"></div>
//       <div className="h-20 border-b"></div>
//       <div className="h-20 border-b"></div>
//       <div className="h-20 border-b"></div>
//       <div className="h-20 border-b"></div>
//       <div className="h-20 border-b"></div>
//       <div className="h-20 border-b"></div>
//       <div className="h-20 border-b"></div>
//       <div className="h-20 border-b"></div>
//       <div className="h-20 border-b"></div>
//       <div className="h-20 border-b"></div>
//     </ul>
//   );
// }

function TableBody({ folders, files }: TableBodyProps) {
  return (
    <ul className="bg-popover flex h-full flex-col overflow-y-auto">
      {folders.map((folder) => (
        <ItemRow key={folder.id} item={folder} type="folder" />
      ))}
      {files.map((file) => (
        <ItemRow key={file.id} item={file} type="file" />
      ))}
    </ul>
  );
}
