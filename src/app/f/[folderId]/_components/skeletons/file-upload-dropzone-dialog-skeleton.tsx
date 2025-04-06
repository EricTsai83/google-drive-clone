import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";

export function FileUploadDropzoneDialogSkeleton() {
  return (
    <Button>
      <CloudUpload /> Upload File(s)
    </Button>
  );
}
