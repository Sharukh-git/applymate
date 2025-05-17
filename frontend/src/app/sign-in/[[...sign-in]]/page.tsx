import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}
// This code is a simple sign-in page using Clerk for authentication in a Next.js application.
// It imports the SignIn component from Clerk and renders it within a centered div.