"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-red-100/80 blur" />
            <AlertCircle
              className="relative h-16 w-16 text-red-500"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Something went wrong!
            </h2>
            <p className="text-muted-foreground max-w-[500px]">
              We apologize for the inconvenience. An unexpected error occurred
              while processing your request.
            </p>
          </div>

          <Button
            onClick={() => reset()}
            className="min-w-[140px] bg-red-500 hover:bg-red-600"
            size="lg"
          >
            Try again
          </Button>

          {error.digest && (
            <p className="text-muted-foreground text-sm">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
