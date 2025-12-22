"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { putArticlePublic, putArticleSave } from "../../../services/article";
import {
  ReturnToHome,
  ReturnToProfile,
  SubmitFormButton,
} from "../../../components/Buttons";
import { SubtitleFieldset, TitleFieldset } from "../../../components/Fieldsets";
import { CancelIcon } from "../../../components/Icons";
import { BlockList, NewBlockButtons } from "../../Editors/blocks";
import { focusVisibleWhiteRing } from "../../../styles/classNames";
import { sonnerToastPromise } from "../../../toasters";
import { convertToLargeDate } from "../../../utils/dates";
import { cn } from "../../../utils/classnames";

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

      const success = (serverResponse: ArticleActionStateProps) => {
        const now = convertToLargeDate(
          new Date(serverResponse.data?.updated_at ?? new Date())
        );
        return (
          <>
            <div className="flex flex-col">
              <p>{serverResponse.success}</p>
              <p className="text-xs text-neutral-500">{now}</p>
            </div>
            {serverResponse.data && (
              <button
                type="button"
                onClick={() =>
                  router.push(`/articles/${serverResponse.data?.id}`)
                }
                className={cn(
                  "cursor-pointer size-fit text-theme-color/85 hover:text-theme-color transition-all duration-300 text-xs font-semibold px-2 py-1 rounded border border-neutral-700 bg-neutral-800 hover:border-neutral-600 hover:bg-[#202020]",
                  focusVisibleWhiteRing
                )}
              >
                Artigo
              </button>
            )}
          </>
        );
      };

      const error = () => {
        setIsOpenState(true);
        return <p>Artigo não publicado</p>;
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

  // TODO
  const [saveState, saveAction, isPendingSave] = useActionState(
    async () => {
      const formData = new FormData();

      formData.set("profile_id", profileId);

      formData.set("article_title", htmlTitle);
      formData.set("article_subtitle", htmlSubtitle);
      formData.set("article_body", JSON.stringify(blocks));

      const success = (data: ArticleActionStateProps) => {
        return <p>{data.success}</p>; // TODO
      };

      const error = (data: ArticleActionStateProps) => {
        setIsOpenState(true);
        return <p>{data.error}</p>; // TODO
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

  const PostArticleErrors = () =>
    isOpenState &&
    postState.error && (
      <div className="flex items-center justify-between p-2 pl-3 mb-4 rounded-sm border border-red-500 bg-red-950">
        <p className="text-red-200 font-medium">{postState.error}</p>
        <button
          type="button"
          onClick={() => setIsOpenState(!isOpenState)}
          className={cn(
            "transition-all duration-300 p-0.5 cursor-pointer rounded-sm border border-red-500 bg-red-900 hover:border-red-400 hover:bg-red-800",
            focusVisibleWhiteRing
          )}
        >
          <CancelIcon className="stroke-red-100" />
        </button>
      </div>
    );

  const SaveArticleErrors = () =>
    isOpenState &&
    saveState.error && (
      <div className="flex items-center justify-between p-2 pl-3 mb-4 rounded-sm border border-red-500 bg-red-950">
        <p className="text-red-200 font-medium">{saveState.error}</p>
        <button
          type="button"
          onClick={() => setIsOpenState(!isOpenState)}
          className="p-0.5 cursor-pointer rounded-sm border border-red-500 bg-red-900"
        >
          <CancelIcon className="stroke-red-200" />
        </button>
      </div>
    );

  return (
    <div className="w-full mx-4">
      <div className="flex gap-10 max-sm:flex-col max-sm:gap-0 border-neutral-600">
        <ReturnToHome />
        <ReturnToProfile />
      </div>
      <PostArticleErrors />
      <SaveArticleErrors />
      <form className="grid gap-2 grid-cols-1 md:grid-cols-[minmax(450px,1fr)_minmax(200px,400px)]">
        <div className="w-full flex flex-col items-center gap-3">
          <div className="w-full flex flex-col gap-4">
            <TitleFieldset value={htmlTitle} setVal={setHtmlTitle} />
            <SubtitleFieldset value={htmlSubtitle} setVal={setHtmlSubtitle} />
          </div>
          <BlockList blocks={blocks} setBlocks={setBlocks} />
          <NewBlockButtons blocks={blocks} setBlocks={setBlocks} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-1 p-4 rounded-sm border border-neutral-700 bg-neutral-900">
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
              className={cn(
                "h-[38px] py-2 text-sm text-center rounded-xs transition-all duration-300 text-[#b98351] hover:text-theme-color border border-neutral-700 hover:border-neutral-600 bg-neutral-900 hover:bg-[#242424]",
                focusVisibleWhiteRing
              )}
            >
              Visitar artigo
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};
