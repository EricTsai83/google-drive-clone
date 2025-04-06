"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { renameFolder, renameFile } from "@/server/actions";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { DropdownMenuItem } from "../../../../components/ui/dropdown-menu";

export type RenameDialogProps = {
  id: number;
  name: string;
  type: "folder" | "file";
};

export function RenameDialog({ id, name, type }: RenameDialogProps) {
  const [newName, setNewName] = useState(name);
  const [isOpen, setIsOpen] = useState(false);

  async function onRename(id: number, newName: string) {
    if (!newName || newName.trim().length === 0) {
      toast.error(`${type === "folder" ? "Folder" : "File"} name is required`);
      return;
    }
    setIsOpen(false);
    try {
      const response =
        type === "folder"
          ? await renameFolder(id, newName)
          : await renameFile(id, newName);

      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success(
        `${type === "folder" ? "Folder" : "File"} renamed successfully`,
      );
    } catch (error) {
      toast.error(
        `Failed to rename ${type}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <PencilIcon /> Rename
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-gray-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Rename {type === "folder" ? "Folder" : "File"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Name your {type}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              className="col-span-3"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex w-full justify-between">
          <Button
            type="submit"
            className="bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-gray-800"
            onClick={() => onRename(id, newName)}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
