import { CloudUpload } from "lucide-react";
import { AuthButtons } from "./auth-buttons";
import { ModeToggleButton } from "@/components/client-mode-toggle";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-8 py-4">
      <Logo />
      <div className="flex items-center gap-6">
        <AuthButtons />
        <ModeToggleButton />
      </div>
    </header>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 rounded-full p-2 shadow-sm transition-colors">
        <CloudUpload className="text-primary h-6 w-6" />
      </div>

      <div className="flex items-baseline gap-2">
        <div className="flex flex-col">
          <h1 className="dark:from-primary dark:to-secondary/90 dark:via-primary/90 text-primary text-2xl font-semibold dark:bg-gradient-to-b dark:bg-clip-text dark:text-transparent">
            Google Drive
          </h1>
          <div className="dark:from-primary/50 dark:to-secondary/50 h-0.5 w-full dark:bg-gradient-to-r" />
        </div>
      </div>
    </Link>
  );
}

{
  /* <div className="group flex items-center gap-4">
        <div className="bg-primary/5 group-hover:bg-primary/10 transform rounded-lg p-2.5 transition-all duration-300 group-hover:scale-105">
          <CloudUpload className="text-primary h-8 w-8 transition-transform group-hover:rotate-12" />
        </div>
        <h1 className="text-foreground/90 group-hover:text-primary text-2xl font-bold transition-colors">
          GDC
        </h1>
      </div> */
}

{
  /* <div className="flex items-center gap-4">
        <div className="border-primary/20 hover:border-primary/40 rounded-xl border-2 p-2 shadow-sm transition-colors">
          <CloudUpload className="text-primary h-8 w-8" />
        </div>
        <h1 className="after:bg-primary/20 relative text-2xl font-medium after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:content-['']">
          GDC
        </h1>
      </div> */
}
