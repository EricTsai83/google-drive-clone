import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function AuthButtons() {
  return (
    <div className="h-7 w-7">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
