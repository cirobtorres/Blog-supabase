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

export const CreateArticleForm = ({ profileId }: { profileId: string }) => {
  const [htmlTitle, setHtmlTitle] = useState("");
  const [htmlDescription, setHtmlDescription] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isOpenState, setIsOpenState] = useState(false);
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
        setIsOpenState(true);
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
    <div className="w-full py-10 mx-4">
      <div className="flex gap-10 max-sm:flex-col max-sm:gap-0 border-neutral-600">
        <ReturnToHome />
        <ReturnToProfile />
      </div>

      {isOpenState && state.error && (
        <div className="flex items-center justify-between p-2 pl-3 mb-4 rounded-sm border border-red-500 bg-red-950">
          <p className="text-red-200 font-medium">{state.error}</p>
          <button
            type="button"
            onClick={() => setIsOpenState(!isOpenState)}
            className="p-0.5 cursor-pointer rounded-sm border border-red-500 bg-red-900"
          >
            <CancelIcon className="stroke-red-200" />
          </button>
        </div>
      )}

      <form
        action={action}
        className="grid gap-2 grid-cols-1 md:grid-cols-[minmax(450px,1fr)_minmax(200px,400px)]"
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-4">
            <TitleFieldset value={htmlTitle} setVal={setHtmlTitle} />
            <SubtitleFieldset
              value={htmlDescription}
              setVal={setHtmlDescription}
            />
            <AuthorAvatar />
          </div>
          <AspectRatio
            ratio={16 / 9}
            className="relative rounded-sm overflow-hidden border border-neutral-700"
          >
            <ImageEditorButtonList
            // className="top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ml-0"
            >
              <ImageEditorButtonLi>
                <ImageEditorButton>
                  <TrashBinIcon className="size-4" />
                </ImageEditorButton>
              </ImageEditorButtonLi>
              <ImageEditorButtonLi>
                <ImageEditorButton>
                  <LinkIcon className="size-4" />
                </ImageEditorButton>
              </ImageEditorButtonLi>
              <ImageEditorButtonLi>
                <ImageEditorButton>
                  <DownloadIcon className="size-4" />
                </ImageEditorButton>
              </ImageEditorButtonLi>
              <ImageEditorButtonLi>
                <ImageEditorButton>
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
              <ConfirmFormButton label="Publicar" isPending={isPending} />
              <button
                type="button"
                className="relative w-12 h-[38px] [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:left-1/2 [&_svg]:-translate-y-1/2 [&_svg]:-translate-x-1/2 rounded-xs border border-neutral-700 bg-neutral-800 outline-none focus-within:ring-2 focus-within:ring-theme-color focus-within:border-transparent"
              >
                <EllipsisIcon />
              </button>
            </div>
            <SaveFormButton label="Salvar" isPending={isPending} />
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
