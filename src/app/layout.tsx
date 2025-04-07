import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./_providers/posthog-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/app/_providers/theme-provider";

export const metadata: Metadata = {
  title: "Google Drive Clone",
  description: "It's like Google Drive, but worse!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
        <body>
          <TRPCReactProvider>
            <PostHogProvider>
              <ThemeProvider attribute="class" defaultTheme="system">
                {children}
                {modal}
                <div id="modal-root" />
                <Toaster richColors icons={{ loading: <></> }} />
              </ThemeProvider>
            </PostHogProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
