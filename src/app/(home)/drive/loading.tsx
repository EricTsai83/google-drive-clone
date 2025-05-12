import { Loader } from "lucide-react";

export default async function Loading() {
  return (
    <div className="flex animate-spin items-center justify-center">
      <Loader className="text-primary h-12 w-12" />
    </div>
  );
}
