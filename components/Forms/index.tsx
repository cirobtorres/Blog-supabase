"use client";

import { ReturnToHome, SubmitFormButton } from "@/components/Buttons";
import { LinkButton, ProvidersRowButtons } from "@/components/Buttons/client";
import {
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
  FloatingPassTypeBtn,
} from "@/components/Fieldsets";
import { signIn, signUp } from "@/services/authentication";
import { useActionState, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { AlertEditorIcon } from "../Icons";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";

const iniSignUpState: {
  ok: boolean;
  success: string | null;
  error: Record<string, string[]>;
  data: User | null;
} = {
  ok: false,
  success: null,
  error: {},
  data: null,
};

export const SignUpForm = () => {
  const [state, action, isPending] = useActionState(async (state) => {
    const formData = new FormData();

    formData.set("floating-displayName-signUp", displayName);
    formData.set("floating-email-signUp", email);
    formData.set("floating-password-signUp", password);
    formData.set("floating-password-confirmation-signUp", passwordConfirm);

    return await signUp(state, formData);
  }, iniSignUpState);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [type, setType] = useState<"password" | "text">("password");
  const [confirmType, setConfirmType] = useState<"password" | "text">(
    "password"
  );

  return (
    <div className="max-w-lg w-full mx-auto p-4 my-[var(--header-height)]">
      <ReturnToHome />
      <h1 className="font-bold text-3xl text-center mb-6">Create Account</h1>
      <form action={action} className="flex flex-col gap-2">
        <FloatingFieldset error={!!state.error.displayName}>
          <FloatingInput
            id="floating-displayName-signUp"
            placeholder="Johndoe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <FloatingLabel
            htmlFor="floating-displayName-signUp"
            label="Nome"
            error={!!state.error.displayName}
          />
        </FloatingFieldset>
        {state.error.displayName && (
          <ul>
            {state.error.displayName.map((err, index) => (
              <li key={index} className="text-xs font-medium text-orange-700">
                {err}
              </li>
            ))}
          </ul>
        )}
        <FloatingFieldset error={!!state.error.email}>
          <FloatingInput
            id="floating-email-signUp"
            placeholder="johndoe@email.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FloatingLabel
            htmlFor="floating-email-signUp"
            label="Email"
            error={!!state.error.email}
          />
        </FloatingFieldset>
        {state.error.email && (
          <ul>
            {state.error.email.map((err, index) => (
              <li key={index} className="text-xs font-medium text-orange-700">
                {err}
              </li>
            ))}
          </ul>
        )}
        <FloatingFieldset error={!!state.error.password}>
          <FloatingInput
            id="floating-password-signUp"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={type}
          />
          <FloatingLabel
            htmlFor="floating-password-signUp"
            label="Senha"
            error={!!state.error.password}
          />
          <FloatingPassTypeBtn state={type} setState={setType} />
        </FloatingFieldset>
        {state.error.password && (
          <ul>
            {state.error.password.map((err, index) => (
              <li key={index} className="text-xs font-medium text-orange-700">
                {err}
              </li>
            ))}
          </ul>
        )}
        <FloatingFieldset error={!!state.error.passwordConfirm}>
          <FloatingInput
            id="floating-password-signUp-confirmation"
            type={confirmType}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <FloatingLabel
            htmlFor="floating-password-signUp-confirmation"
            label="Confirmação de Senha"
            error={!!state.error.passwordConfirm}
          />
          <FloatingPassTypeBtn state={confirmType} setState={setConfirmType} />
        </FloatingFieldset>
        {state.error.passwordConfirm && (
          <ul>
            {state.error.passwordConfirm.map((err, index) => (
              <li key={index} className="text-xs font-medium text-orange-700">
                {err}
              </li>
            ))}
          </ul>
        )}
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>A senha deve conter, ao menos:</AlertTitle>
          <AlertDescription>
            <ul className="list-inside list-disc text-sm">
              <li>6 caracteres</li>
              <li className="relative">
                1 caractere especial{" "}
                <HoverCard openDelay={0}>
                  <HoverCardTrigger className="absolute -right-6 top-1/2 -translate-y-1/2 cursor-default text-theme-color font-bold">
                    <AlertEditorIcon className="size-5" />
                  </HoverCardTrigger>
                  <HoverCardContent side="right">
                    <p>
                      Caracteres <b>válidos</b>:
                    </p>
                    <p>! @ # $ % ¨& * ^ ~ _ - + = §</p>
                  </HoverCardContent>
                </HoverCard>
              </li>
              <li>1 minúscula</li>
              <li>1 maiúscula</li>
              <li>1 dígito</li>
            </ul>
          </AlertDescription>
        </Alert>
        <SubmitFormButton label="Confirmar" isPending={isPending} />
        {state.error.server && (
          <ul>
            {state.error.server.map((err, index) => (
              <li
                key={index}
                className="p-1 text-center text-sm text-neutral-100 font-medium rounded-xs border border-orange-700 bg-orange-900"
              >
                {err}
              </li>
            ))}
          </ul>
        )}
      </form>
      <ProvidersRowButtons />
      <div className="py-4">
        <p className="text-center text-sm">
          Fazer <LinkButton label="login" href="/sign-in" />.
        </p>
      </div>
    </div>
  );
};

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<"password" | "text">("password");

  const [state, action, isPending] = useActionState(
    async () => {
      const formData = new FormData();

      formData.set("floating-email-signIn", email);
      formData.set("floating-password-signIn", password);

      const response = await signIn(state, formData);

      if (response.ok) redirect("/");

      return response;
    },
    { ok: false, success: null, error: {}, data: null }
  );
  return (
    <div className="max-w-lg w-full mx-auto p-4 my-[var(--header-height)]">
      <ReturnToHome />
      <h1 className="font-bold text-3xl text-center mb-6">Login</h1>
      <form action={action} className="flex flex-col gap-2">
        <FloatingFieldset error={!!state.error?.email}>
          <FloatingInput
            id="floating-email-signIn"
            placeholder="johndoe@email.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FloatingLabel
            htmlFor="floating-email-signIn"
            label="Email"
            error={!!state.error?.email}
          />
        </FloatingFieldset>
        {state.error?.email && (
          <ul className="text-sm text-orange-700">
            {state.error.email.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
        <FloatingFieldset error={!!state.error?.email}>
          <FloatingInput
            id="floating-password-signIn"
            value={password}
            type={type}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FloatingLabel
            htmlFor="floating-password-signIn"
            label="Senha"
            error={!!state.error?.email}
          />
          <FloatingPassTypeBtn state={type} setState={setType} />
        </FloatingFieldset>
        {state.error?.password && (
          <ul className="text-sm text-orange-700">
            {state.error.password.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
        <SubmitFormButton label="Confirmar" isPending={isPending} />
        {state.error?.server && (
          <ul className="text-sm text-orange-700">
            {state.error.server.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
      </form>
      <ProvidersRowButtons />
      <div className="py-4">
        <p className="text-center text-sm">
          Fazer <LinkButton label="cadastro" href="/sign-up" />.
        </p>
      </div>
    </div>
  );
};
