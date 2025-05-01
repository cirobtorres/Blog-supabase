"use client";

import { ConfirmFormButton } from "@/components/Buttons";
import {
  DisplayNameFieldset,
  EmailFieldset,
  PasswordFieldset,
} from "@/components/Fieldsets";
import { ReturnToHome } from "@/components/ReturnToHome";
import { signUp } from "@/services/authentication";
import { useActionState } from "react";

export default function SignUpPage() {
  const [state, action] = useActionState(signUp, { error: null });
  return (
    <main className="max-w-7xl min-h-screen mx-auto flex flex-col justify-center items-center">
      <div className="max-w-xl w-full p-4">
        <ReturnToHome />
        <h1>Create Account</h1>
        <form action={action} className="flex flex-col gap-2">
          <DisplayNameFieldset />
          <EmailFieldset />
          <PasswordFieldset />
          <ConfirmFormButton label="Confirm" />
          {state && <p>{state.error}</p>}
        </form>
      </div>
    </main>
  );
}
