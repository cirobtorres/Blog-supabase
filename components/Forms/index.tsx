"use client";

import { ConfirmFormButton, ReturnToHome } from "@/components/Buttons";
import { ProvidersRowButtons } from "@/components/Buttons/client";
import {
  DisplayNameFieldset,
  EmailFieldset,
  PasswordFieldset,
} from "@/components/Fieldsets";
import { signIn, signUp } from "@/services/authentication";
import { useActionState, useState } from "react";
import Link from "next/link";

export const SignUpForm = () => {
  const [state, action, isPending] = useActionState(signUp, { error: null });
  return (
    <div className="max-w-lg w-full mx-auto p-4 my-[var(--header-height)]">
      <ReturnToHome />
      <h1 className="font-bold text-3xl text-center">Create Account</h1>
      <form action={action} className="flex flex-col gap-2">
        <DisplayNameFieldset />
        <EmailFieldset />
        <PasswordFieldset />
        <p className="text-red-500">TODO: checkboxes</p>
        <p className="text-red-500">TODO: captcha</p>
        <ConfirmFormButton label="Confirmar" isPending={isPending} />
        {state.error && <p>{state.error}</p>}
      </form>
      <ProvidersRowButtons />
      <div className="py-4">
        <p className="text-center text-sm">
          Fazer{" "}
          <Link href="/sign-in" className="text-blue-500">
            login
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export const SignInForm = () => {
  const [state, action, isPending] = useActionState(signIn, { error: null });
  return (
    <div className="max-w-lg w-full mx-auto p-4 my-[var(--header-height)]">
      <ReturnToHome />
      <h1 className="font-bold text-3xl text-center">Login</h1>
      <form action={action} className="flex flex-col gap-2">
        <EmailFieldset />
        <PasswordFieldset />
        <ConfirmFormButton label="Confirmar" isPending={isPending} />
        {state.error && <p className="text-sm text-warning">{state.error}</p>}
      </form>
      <ProvidersRowButtons />
      <p className="text-red-500">TODO: phone</p>
      <p className="text-red-500">TODO: magicklink</p>
      <div className="py-4">
        <p className="text-center text-sm">
          Fazer{" "}
          <Link href="/sign-up" className="text-blue-500">
            cadastro
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
