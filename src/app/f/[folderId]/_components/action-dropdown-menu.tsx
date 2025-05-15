"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteFile, deleteFolder } from "@/server/actions";
import { MoreHorizontal, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { RenameDialog } from "@/app/f/[folderId]/_components/rename-dialog";
import { api } from "@/trpc/react";
import { tryCatch } from "@/lib/try-catch";
import { DatabaseError, InternalServerError } from "@/lib/exceptions";
export type ActionDropdownMenuProps = {
  id: number;
  name: string;
  type: "folder" | "file";
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ActionDropdownMenu({
  id,
  name,
  type,
  setIsDeleting,
}: ActionDropdownMenuProps) {
  const deleteAction = type === "folder" ? deleteFolder : deleteFile;
  const actionLabel = type === "folder" ? "Folder" : "File";
  const utils = api.useUtils();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div aria-label={`Open ${type}'s row actions`}>
          <MoreHorizontal className="h-5 w-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-red-400"
          onClick={async () => {
            setIsDeleting(true);
            try {
              const { error: deleteError } = await tryCatch(deleteAction(id));

              if (deleteError) {
                throw new DatabaseError(
                  `Failed to delete ${type}: ${deleteError.message}`,
                );
              }

              const { error: invalidateError } = await tryCatch(
                utils.folder.getFolderContents.invalidate(),
              );

              if (invalidateError) {
                throw new InternalServerError(
                  `Failed to invalidate folder contents: ${invalidateError.message}`,
                );
              }

              toast.success(`${actionLabel} deleted successfully`);
            } catch (error) {
              setIsDeleting(false);
              if (
                error instanceof DatabaseError ||
                error instanceof InternalServerError
              ) {
                toast.error(error.message);
              } else {
                toast.error(
                  `Failed to delete ${type}: ${
                    error instanceof Error ? error.message : "Unknown error"
                  }`,
                );
              }
            }
          }}
          aria-label={`Delete ${actionLabel}`}
        >
          <Trash2Icon className="text-red-400" /> Delete
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <RenameDialog id={id} name={name} type={type} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
