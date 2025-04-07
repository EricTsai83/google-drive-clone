export default function HomePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">{children}</div>
    </div>
  );
}
