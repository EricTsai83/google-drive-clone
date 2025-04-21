import { CreateFolderDialog } from "@/app/f/[folderId]/_components/create-folder-dialog";
import { FileUploadDropzoneDialog } from "./_components/file-upload-dropzone-dialog";

import TableBody from "./_components/table-body";
import { TableHeader } from "./_components/table-header";

type DriveContentsProps = {
  currentFolderId: number;
};

export default function DriveContents({ currentFolderId }: DriveContentsProps) {
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
        <TableBody folderId={currentFolderId} />
      </div>
    </>
  );
}
