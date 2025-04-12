import { Header } from "./header";
import { Footer } from "@/components/footer";

export default function FolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1 overflow-hidden p-8">
        <div className="mx-auto flex h-full max-w-6xl flex-col">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
