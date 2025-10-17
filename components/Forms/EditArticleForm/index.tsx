"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { putArticlePublic, putArticleSave } from "@/services/article";
import { convertToLargeDate } from "@/utils/dates";
import { ReturnToHome, SubmitFormButton } from "@/components/Buttons";
import { SubtitleFieldset, TitleFieldset } from "@/components/Fieldsets";
import { BlockList, NewBlockButtons } from "../utils";
import Link from "next/link";
import { sonnerToastPromise } from "@/toasters";
import { cn } from "@/utils/classnames";
import { focusVisibleWhiteRing } from "@/styles/classNames";

export const EditArticleForm = ({
  profileId,
  article: { id: article_id, title, sub_title, body },
}: {
  profileId: string;
  article: Article;
}) => {
  const [htmlTitle, setHtmlTitle] = useState(title);
  const [htmlSubtitle, setHtmlSubtitle] = useState(sub_title || "");
  const [blocks, setBlocks] = useState<Block[]>(JSON.parse(body));
  const [isOpenState, setIsOpenState] = useState(false);
  const router = useRouter();

  const [postState, postAction, isPendingPost] = useActionState(
    async () => {
      const formData = new FormData();

      formData.set("profile_id", profileId);

      formData.set("article_title", htmlTitle);
      formData.set("article_subtitle", htmlSubtitle);
      formData.set("article_body", JSON.stringify(blocks));

      const success = () => {
        const now = convertToLargeDate(new Date());
        return "Artigo publicado!";
      };

      const error = () => {
        setIsOpenState(true);
        return "Artigo não publicado!";
      };

      const result = putArticlePublic(
        article_id,
        { ok: false, success: null, error: null, data: null },
        formData
      );

      const promise = new Promise((resolve, reject) => {
        result.then((data) => {
          if (data.ok) resolve(result);
          else reject(result);
        });
      });

      sonnerToastPromise(promise, success, error, "Publicando artigo...");

      return result;
    },
    {
      ok: false,
      success: null,
      error: null,
      data: null,
    }
  );

  const [saveState, saveAction, isPendingSave] = useActionState(
    async () => {
      const formData = new FormData();

      formData.set("profile_id", profileId);

      formData.set("article_title", htmlTitle);
      formData.set("article_subtitle", htmlSubtitle);
      formData.set("article_body", JSON.stringify(blocks));

      const success = () => {
        const now = convertToLargeDate(new Date());
        return "Artigo salvo!";
      };

      const error = () => {
        setIsOpenState(true);
        return "Artigo não salvo!";
      };

      const result = putArticleSave(
        article_id,
        { ok: false, success: null, error: null, data: null },
        formData
      );

      const promise = new Promise((resolve, reject) => {
        result.then((data) => {
          if (data.ok) resolve(result);
          else reject(result);
        });
      });

      sonnerToastPromise(promise, success, error, "Salvando artigo...");

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
        <form className="grid gap-2 grid-cols-1 md:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-3">
            <TitleFieldset value={htmlTitle} setVal={setHtmlTitle} />
            <SubtitleFieldset value={htmlSubtitle} setVal={setHtmlSubtitle} />
            <BlockList blocks={blocks} setBlocks={setBlocks} />
            <NewBlockButtons blocks={blocks} setBlocks={setBlocks} />
          </div>
          <div className="flex flex-col gap-1">
            <SubmitFormButton
              formAction={postAction}
              label="Publicar"
              isPending={isPendingPost}
            />
            <SubmitFormButton
              formAction={saveAction}
              label="Salvar"
              isPending={isPendingSave}
              className={cn(
                "transition-all duration-300 border-neutral-700 bg-neutral-900 hover:border-neutral-600 hover:bg-[#202020] focus-visible:bg-[#202020]",
                focusVisibleWhiteRing
              )}
            />
            <Link
              href={`/articles/${article_id}`}
              className="h-[38px] py-2 text-sm text-center rounded-lg transition-all duration-300 text-[#b98351] border border-neutral-700 bg-neutral-800 hover:bg-neutral-800/75"
            >
              Visitar artigo
            </Link>
            <div className="min-h-48 p-3 rounded-lg border border-neutral-700">
              {postState.error && (
                <p className="text-red-500 font-medium">{postState.error}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};
