import { Progress } from "@/components/ui/progress";

interface LoadingToastProps {
  title: string;
  description?: string;
  progress?: number;
}

export function LoadingToast({
  title,
  description,
  progress,
}: LoadingToastProps) {
  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-zinc-900 dark:text-zinc-50">{title}</p>
        </div>
        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      <span className="fixed bottom-1 right-2 text-sm text-zinc-500 dark:text-zinc-400">
        {progress}%
      </span>

      <div className="fixed bottom-0 left-0 right-0 rounded-md">
        <Progress
          value={progress}
          className="h-1 w-full bg-zinc-100 dark:bg-zinc-800"
        />
      </div>
    </>
  );
}
