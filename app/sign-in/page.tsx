import { SignInForm } from "@/components/Forms";

export default function SignInPage() {
  return (
    <main className="min-h-screen mx-auto grid grid-cols-2">
      <div className="h-full bg-neutral-800" />
      <SignInForm />
    </main>
  );
}
