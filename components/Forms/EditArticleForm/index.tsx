"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { putArticle } from "@/services/article";
import { convertToLargeDate } from "@/utils/dates";
import {
  ConfirmFormButton,
  ReturnToHome,
  SaveFormButton,
} from "@/components/Buttons";
import {
  getEditorFormDataValue,
  getSubtitleFormDataValue,
  getTitleFormDataValue,
  SubtitleFieldset,
  TitleFieldset,
} from "@/components/Fieldsets";
import { BlockList, NewBlockButtons } from "../utils";
import Link from "next/link";

export const EditArticleForm = ({
  profileId,
  article: { id: article_id, title, sub_title, body },
}: {
  profileId: string;
  article: Article;
}) => {
  const [htmlTitle, setHtmlTitle] = useState(title);
  const [htmlDescription, setHtmlDescription] = useState(sub_title || "");
  const [blocks, setBlocks] = useState<Block[]>(JSON.parse(body));
  const router = useRouter();

  const [state, action, isPending] = useActionState(
    async () => {
      const formData = new FormData();

      formData.set(getTitleFormDataValue, htmlTitle);
      formData.set(getSubtitleFormDataValue, htmlDescription);
      formData.set("profile_id", profileId);
      formData.set(getEditorFormDataValue, JSON.stringify(blocks));

      const result = await putArticle(
        article_id,
        { ok: false, success: null, error: null, data: null },
        formData
      );

      if (!result.ok) {
        toast.error("Artigo não salvo!"); // { description: state.error }
      } else {
        const now = convertToLargeDate(new Date());
        toast("Artigo salvo!", {
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
    {
      ok: false,
      success: null,
      error: null,
      data: null,
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
            <BlockList blocks={blocks} setBlocks={setBlocks} />
            <NewBlockButtons blocks={blocks} setBlocks={setBlocks} />
          </div>
          <div className="flex flex-col gap-1">
            <ConfirmFormButton label="Publicar" isPending={isPending} />
            <SaveFormButton label="Salvar" isPending={isPending} />
            <Link
              href={`/articles/${article_id}`}
              className="h-[38px] py-2 text-sm text-center rounded-lg transition-all duration-300 text-[#b98351] border border-neutral-700 bg-neutral-800 hover:bg-neutral-800/75"
            >
              Visitar artigo
            </Link>
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
