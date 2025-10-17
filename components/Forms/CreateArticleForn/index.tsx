"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import {
  ReturnToHome,
  ReturnToProfile,
  SubmitFormButton,
} from "@/components/Buttons";
import { SubtitleFieldset, TitleFieldset } from "@/components/Fieldsets";
import { postArticlePublic, postArticleSave } from "@/services/article";
import { BlockList, NewBlockButtons } from "../utils";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import { convertToLargeDate } from "@/utils/dates";
import { AspectRatio } from "@/components/ui/aspect-ration";
import {
  DropPlaceholder,
  ImageEditorButton,
  ImageEditorButtonLi,
  ImageEditorButtonList,
} from "@/components/Fieldsets/ArticleEditor";
import {
  CancelIcon,
  DownloadIcon,
  EllipsisIcon,
  LinkIcon,
  TrashBinIcon,
  UploadIcon,
} from "@/components/Icons";
import { sonnerToastPromise } from "@/toasters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { focusVisibleWhiteRing } from "@/styles/classNames";
import { cn } from "@/utils/classnames";

const initialPostState = {
  ok: false,
  success: null,
  error: null,
  data: null,
};

const initialSaveState = {
  ok: false,
  success: null,
  error: null,
  data: null,
};

export const CreateArticleForm = ({ profileId }: { profileId: string }) => {
  const [htmlTitle, setHtmlTitle] = useState("");
  const [htmlSubtitle, setHtmlSubtitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isOpenState, setIsOpenState] = useState(false);
  const router = useRouter();

  const [postState, postAction, isPendingPost] = useActionState(async () => {
    try {
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

      const result = postArticlePublic(
        {
          ok: false,
          success: null,
          error: null,
          data: null,
        },
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
    } catch (e) {
      console.error(e);
      const error = {
        ok: false,
        success: null,
        error: null,
        data: null,
      };
      return error;
    }
  }, initialPostState);

  // TODO
  const [saveState, saveAction, isPendingSave] = useActionState(async () => {
    try {
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

      const result = postArticleSave(
        {
          ok: false,
          success: null,
          error: null,
          data: null,
        },
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
    } catch (e) {
      console.error(e);
      const error = {
        ok: false,
        success: null,
        error: null,
        data: null,
      };
      return error;
    }
  }, initialSaveState);

  const PostArticleErrors = () =>
    isOpenState &&
    postState.error && (
      <div className="flex items-center justify-between p-2 pl-3 mb-4 rounded-sm border border-red-500 bg-red-950">
        <p className="text-red-200 font-medium">{postState.error}</p>
        <button
          type="button"
          onClick={() => setIsOpenState(!isOpenState)}
          className="p-0.5 cursor-pointer rounded-sm border border-red-500 bg-red-900"
        >
          <CancelIcon className="stroke-red-200" />
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
            <AuthorAvatar />
          </div>
          <AspectRatio
            ratio={25 / 9}
            className="relative rounded-sm overflow-hidden border border-neutral-700"
          >
            <ImageEditorButtonList>
              <ImageEditorButtonLi>
                <ImageEditorButton className="size-9">
                  <TrashBinIcon className="size-4" />
                </ImageEditorButton>
              </ImageEditorButtonLi>
              <ImageEditorButtonLi>
                <ImageEditorButton className="size-9">
                  <LinkIcon className="size-4" />
                </ImageEditorButton>
              </ImageEditorButtonLi>
              <ImageEditorButtonLi>
                <ImageEditorButton className="size-9">
                  <DownloadIcon className="size-4" />
                </ImageEditorButton>
              </ImageEditorButtonLi>
              <ImageEditorButtonLi>
                <ImageEditorButton className="size-9">
                  <UploadIcon className="size-4" />
                </ImageEditorButton>
              </ImageEditorButtonLi>
            </ImageEditorButtonList>
            {/* <Image
                src="https://placehold.co/1920x1080/000000/FFFFFF.png"
                alt="Photo by placehold.co"
                fill
                className="h-full w-full rounded-lg object-cover dark:brightness-[0.2]"
              /> */}
            <DropPlaceholder />
          </AspectRatio>
          <BlockList blocks={blocks} setBlocks={setBlocks} />
          <NewBlockButtons blocks={blocks} setBlocks={setBlocks} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-1 p-4 rounded-sm border border-neutral-700 bg-neutral-900">
            <div className="w-full flex gap-1">
              <SubmitFormButton
                label="Publicar"
                formAction={postAction}
                isPending={isPendingPost}
              />
              <Popover>
                <PopoverTrigger className="relative w-12 h-[38px] [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:left-1/2 [&_svg]:-translate-y-1/2 [&_svg]:-translate-x-1/2 rounded-xs border border-neutral-700 bg-neutral-800 outline-none focus-within:ring-2 focus-within:ring-neutral-100 focus-within:border-transparent">
                  <EllipsisIcon />
                </PopoverTrigger>
                <PopoverContent>
                  <ul>
                    <li>Despublicar</li>
                    <li>Preview</li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
            <SubmitFormButton
              label="Salvar"
              formAction={saveAction}
              isPending={isPendingSave}
              className={cn(
                "transition-all duration-300 border-neutral-700 bg-neutral-900 hover:border-neutral-600 hover:bg-[#202020] focus-visible:bg-[#202020]",
                focusVisibleWhiteRing
              )}
            />
          </div>
          <div className="min-h-48 p-3 rounded-lg border border-neutral-700">
            <p>Sumário???</p>
          </div>
        </div>
      </form>
    </div>
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
