import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin">
        <Loader className="h-full w-full text-primary" />
      </div>
    </div>
  );
}
