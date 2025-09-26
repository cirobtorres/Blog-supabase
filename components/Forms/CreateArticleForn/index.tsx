"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  ConfirmFormButton,
  ReturnToHome,
  ReturnToProfile,
  SaveFormButton,
} from "@/components/Buttons";
import {
  getEditorFormDataValue,
  getSubtitleFormDataValue,
  getTitleFormDataValue,
  SubtitleFieldset,
  TitleFieldset,
} from "@/components/Fieldsets";
import { postArticle } from "@/services/article";
import { BlockList, NewBlockButtons } from "../utils";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import { convertToLargeDate } from "@/utils/dates";

export const CreateArticleForm = ({ profileId }: { profileId: string }) => {
  const [htmlTitle, setHtmlTitle] = useState("");
  const [htmlDescription, setHtmlDescription] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const router = useRouter();

  const [state, action, isPending] = useActionState(
    async () => {
      const formData = new FormData();
      formData.set(getTitleFormDataValue, htmlTitle);
      formData.set(getSubtitleFormDataValue, htmlDescription);
      formData.set("profile_id", profileId);
      formData.set(getEditorFormDataValue, JSON.stringify(blocks));

      const result = await postArticle(
        { ok: false, success: null, error: null, data: null },
        formData
      );

      if (!result.ok) {
        toast.error("Artigo não publicado!"); // { description: state.error }
      } else {
        const now = convertToLargeDate(new Date());
        toast("Artigo publicado!", {
          description: `${now}`,
          action: {
            label: "Link",
            onClick: () => router.push(`/articles/${result.data?.id}`),
            actionButtonStyle: {
              color: "f5f5f5",
              border: "1px solid #525252",
              borderRadius: "6px",
              padding: "2px 4px",
              backgroundColor: "#171717",
            },
          },
        });
      }
      return result;
    },
    { ok: false, success: null, error: null, data: null }
  );

  // TODO
  // const [saveState, saveAction, isPendingSave] = useActionState(
  //   async () => {
  //     const formData = new FormData();
  //     formData.set(getTitleFormDataValue, htmlTitle);
  //     formData.set(getSubtitleFormDataValue, htmlDescription);
  //     formData.set(getEditorFormDataValue, htmlBody);
  //     formData.set("profile_id", profileId);
  //     const result = await postArticle(
  //       { ok: false, success: null, error: null },
  //       formData
  //     );
  //     if (!result.ok) {
  //       toast.error(result.error);
  //     } else {
  //       toast(result.success);
  //     }
  //     return result;
  //   },
  //   { ok: false, success: null, error: null }
  // );

  return (
    <main className="w-full max-w-7xl mx-auto flex justify-center items-center">
      <div className="w-full py-10 mx-4">
        <div className="flex gap-10 max-sm:flex-col max-sm:gap-0 border-neutral-600">
          <ReturnToHome />
          <ReturnToProfile />
        </div>
        <form
          action={action}
          className="grid gap-2 grid-cols-1 md:grid-cols-[1fr_300px]"
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4 p-10 max-sm:p-4 rounded-xl border border-neutral-800 bg-neutral-900">
              <TitleFieldset value={htmlTitle} setVal={setHtmlTitle} />
              <SubtitleFieldset
                value={htmlDescription}
                setVal={setHtmlDescription}
              />
              <AuthorAvatar />
            </div>
            <BlockList blocks={blocks} setBlocks={setBlocks} />
            <NewBlockButtons blocks={blocks} setBlocks={setBlocks} />
          </div>
          <div className="flex flex-col gap-1">
            <ConfirmFormButton label="Publicar" isPending={isPending} />
            <SaveFormButton label="Salvar" isPending={isPending} />
            <div className="min-h-48 p-3 rounded-lg border border-neutral-700">
              {state.error && (
                <p className="text-red-500 font-medium">{state.error}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

const AuthorAvatar = () => {
  const { loggedProfile } = useProfile();
  const avatar_url = loggedProfile?.avatar_url;
  const username = loggedProfile?.username;

  return (
    <div className="flex items-center gap-2 px-2 py-0.5">
      <Image
        src={avatar_url ? avatar_url : "/images/not-authenticated.png"}
        alt={`Avatar de ${username ?? "Excluído"}`}
        width={32}
        height={32}
        className="rounded-full"
      />
      <p>{username ?? "Excluído"}</p>
    </div>
  );
};
