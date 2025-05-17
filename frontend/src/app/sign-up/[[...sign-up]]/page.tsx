import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}
// This code is a simple sign-up page using Clerk for authentication in a Next.js application.
// It imports the SignUp component from Clerk and renders it within a centered div.