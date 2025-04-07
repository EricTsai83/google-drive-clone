import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "mt-16 w-full text-center text-sm text-neutral-500",
        className,
      )}
    >
      © {new Date().getFullYear()} Eric Tsai. All rights reserved.
    </footer>
  );
}
