import { SignUpForm } from "@/components/Forms";

export default function SignUpPage() {
  return (
    <main className="min-h-screen mx-auto grid grid-cols-2">
      <SignUpForm />
      <div className="h-full bg-neutral-800" />
    </main>
  );
}
