"use client";

import {
  ConfirmFormButton,
  SaveFormButton,
  ReturnToHome,
} from "@/components/Buttons";
import { ProvidersRowButtons } from "@/components/Buttons/client";
import {
  DisplayNameFieldset,
  EmailFieldset,
  getSubtitleFormDataValue,
  PasswordFieldset,
  SubtitleFieldset,
} from "@/components/Fieldsets";
import { signIn, signUp } from "@/services/authentication";
import {
  EditorFieldset,
  getEditorFormDataValue,
  getTitleFormDataValue,
  TitleFieldset,
} from "@/components/Fieldsets";
import { putArticle, postArticle } from "@/services/article";
import { useActionState, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { convertToLargeDate } from "@/utils/dates";
import { useRouter } from "next/navigation";

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

export const CreateArticleForm = ({ profileId }: { profileId: string }) => {
  const [htmlTitle, setHtmlTitle] = useState("");
  const [htmlDescription, setHtmlDescription] = useState("");
  const [htmlBody, setHtmlBody] = useState("");

  const [state, action, isPending] = useActionState(
    async () => {
      const formData = new FormData();
      formData.set(getTitleFormDataValue, htmlTitle);
      formData.set(getSubtitleFormDataValue, htmlDescription);
      formData.set(getEditorFormDataValue, htmlBody);
      formData.set("profile_id", profileId);
      const result = await postArticle(
        { ok: false, success: null, error: null },
        formData
      );
      if (!result.ok) {
        toast(result.error);
      } else {
        toast(result.success);
      }
      return result;
    },
    { ok: false, success: null, error: null }
  );

  const [saveState, saveAction, isPendingSave] = useActionState(
    async () => {
      const formData = new FormData();
      formData.set(getTitleFormDataValue, htmlTitle);
      formData.set(getSubtitleFormDataValue, htmlDescription);
      formData.set(getEditorFormDataValue, htmlBody);
      formData.set("profile_id", profileId);
      const result = await postArticle(
        { ok: false, success: null, error: null },
        formData
      );
      if (!result.ok) {
        toast(result.error);
      } else {
        toast(result.success);
      }
      return result;
    },
    { ok: false, success: null, error: null }
  );

  return (
    <main className="w-full max-w-7xl mx-auto flex justify-center items-center">
      <div className="w-full py-10 mx-4">
        <ReturnToHome />
        <form
          action={action}
          className="grid gap-2 grid-cols-1 md:grid-cols-[1fr_300px]"
        >
          <div className="flex flex-col gap-2">
            <TitleFieldset value={htmlTitle} setVal={setHtmlTitle} />
            <SubtitleFieldset
              value={htmlDescription}
              setVal={setHtmlDescription}
            />
            <EditorFieldset setVal={setHtmlBody} />
          </div>
          <div className="flex flex-col gap-1">
            <ConfirmFormButton label="Publicar" isPending={isPending} />
            <SaveFormButton label="Salvar" isPending={isPending} />
          </div>
        </form>
        {state.error && <p>Error: {state.error}</p>}
        {/* {state.success && <p>Success: {state.success}</p>} */}
      </div>
    </main>
  );
};

export const EditArticleForm = ({
  id,
  title,
  sub_title,
  body,
}: {
  id: string;
  title: string;
  sub_title: string | null;
  body: string;
}) => {
  const [htmlTitle, setHtmlTitle] = useState(title);
  const [htmlDescription, setHtmlDescription] = useState(sub_title || "");
  const [htmlBody, setHtmlBody] = useState(body);
  const router = useRouter();

  const [state, action, isPending] = useActionState(
    async () => {
      const formData = new FormData();

      formData.set(getTitleFormDataValue, htmlTitle);
      formData.set(getSubtitleFormDataValue, htmlDescription);
      formData.set(getEditorFormDataValue, htmlBody);

      const result = await putArticle(
        id,
        { ok: false, success: null, error: null },
        formData
      );

      if (result.ok)
        toast.success("Artigo atualizado", {
          description: convertToLargeDate(new Date()),
          action: {
            label: "Visitar artigo",
            onClick: () => router.push(`/articles/${id}`),
          },
        });

      return result;
    },
    {
      ok: false,
      success: null,
      error: null,
    }
  );

  return (
    <main className="pt-10 max-w-7xl mx-auto flex justify-center items-center">
      <div className="w-full mx-4">
        <ReturnToHome />
        <form
          action={action}
          className="grid gap-2 grid-cols-1 md:grid-cols-[1fr_300px]"
        >
          <div className="flex flex-col gap-2">
            <TitleFieldset value={htmlTitle} setVal={setHtmlTitle} />
            <SubtitleFieldset
              value={htmlDescription}
              setVal={setHtmlDescription}
            />
            <EditorFieldset setVal={setHtmlBody} defaultValue={htmlBody} />
          </div>
          <div className="flex flex-col gap-1">
            <ConfirmFormButton label="Publicar" isPending={isPending} />
            <SaveFormButton label="Salvar" />
          </div>
        </form>
        {state.error && <p>Error: {state.error}</p>}
        {/* {state.success && <p>Success: {state.success}</p>} */}
      </div>
    </main>
  );
};
