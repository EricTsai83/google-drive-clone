export default function HomePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <main className="text-center">{children}</main>
    </div>
  );
}
