"use client";

import { Fieldset } from "@/components/Fieldset";
import { ReturnToHome } from "@/components/ReturnToHome";
import { signUp } from "@/services/authentication";
import { useActionState } from "react";

export default function SignInPage() {
  const [state, action] = useActionState(signUp, { error: null });
  return (
    <main className="max-w-7xl min-h-screen mx-auto flex flex-col justify-center items-center bg-slate-900">
      <div className="max-w-xl w-full p-4 bg-slate-700">
        <ReturnToHome />
        <h1>Login</h1>
        <form action={action} className="flex flex-col gap-2">
          <Fieldset label="E-mail" type="email" />
          <Fieldset label="Password" type="password" />
          <button type="submit" className="py-1 cursor-pointer bg-slate-800">
            Confirm
          </button>
          {state && <p>{state.error}</p>}
        </form>
      </div>
    </main>
  );
}
