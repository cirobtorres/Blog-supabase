"use client";

import { ConfirmFormButton } from "@/components/Buttons";
import { ProvidersRowButtons } from "@/components/Buttons/client";
import { EmailFieldset, PasswordFieldset } from "@/components/Fieldsets";
import { ReturnToHome } from "@/components/ReturnToHome";
import { signIn } from "@/services/authentication";
import { useActionState } from "react";

export default function SignInPage() {
  const [state, action] = useActionState(signIn, { error: null });
  return (
    <main className="max-w-7xl min-h-screen mx-auto flex flex-col justify-center items-center">
      <div className="max-w-xl w-full p-4">
        <ReturnToHome />
        <h1>Login</h1>
        <form action={action} className="flex flex-col gap-2">
          <EmailFieldset />
          <PasswordFieldset />
          <ConfirmFormButton label="Confirm" />
          {state && <p>{state.error}</p>}
        </form>
        <ProvidersRowButtons />
      </div>
    </main>
  );
}
