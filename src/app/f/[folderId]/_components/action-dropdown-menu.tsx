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
import { Button } from "@/components/ui/button";

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
              await deleteAction(id);
              toast.success(`${actionLabel} deleted successfully`);
            } catch (error) {
              setIsDeleting(false);
              toast.error(
                `Failed to delete ${type}: ${error instanceof Error ? error.message : "Unknown error"}`,
              );
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
