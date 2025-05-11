import { SignInButton } from "@clerk/nextjs";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <SignInButton />
      <Footer />
    </>
  );
}
