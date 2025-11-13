"use client";

import { HazardBorder } from "@/components/HazardBorder";
import { Checkbox as ShadcnUICheckbox } from "@/components/ui/checkbox";
import NextImage from "next/image";
import {
  AlertIcon,
  DownloadIcon,
  LinkIcon,
  PencilIcon,
  TrashBinIcon,
  UploadIcon,
} from "../../Icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogCancelIcon,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import {
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
} from "../../Fieldsets";
import React, { Dispatch, SetStateAction } from "react";
import {
  ImageDataInfo,
  ImageEditorButton,
  ImageEditorButtonLi,
  ImageEditorButtonList,
} from "../../Editors/ImageEditor";
import { formatType } from "../../../utils/strings";
import {
  buttonVariants,
  focusVisibleWhiteRing,
  hoverWhiteRing,
} from "../../../styles/classNames";
import { cn } from "../../../utils/classnames";
import { deleteFile, deleteFiles } from "../../../services/media.server";
import { sonnerToastPromise } from "../../../toasters";
import { Skeleton } from "../../../components/ui/skeleton";
import Link from "next/link";
import { useRenderCount } from "../../../utils/renderCount";

const initState: MediaStateProps = {
  ok: false,
  success: null,
  error: null,
  data: null,
};

export const ImagePreviewCard = React.memo(function ({
  image,
  handleCheckbox,
}: {
  image: SupabaseBucketImage;
  handleCheckbox: Dispatch<SetStateAction<{ url: string }[]>>;
}) {
  useRenderCount("ImagePreviewCard"); // DEBUG

  const Checkbox = () => (
    <fieldset className="size-6 absolute left-3 top-3 z-10">
      <label htmlFor={image.id} className="cursor-pointer size-6 absolute">
        <ShadcnUICheckbox
          id={image.id}
          name="checkboxList[]"
          value={image.url}
          className="cursor-pointer"
          onCheckedChange={(check) => {
            if (check) handleCheckbox((prev) => [...prev, { url: image.url }]);
            else
              handleCheckbox((prev) =>
                prev.filter((obj) => obj.url !== image.url)
              );
            return !check;
          }}
        />
        <p className="sr-only">{`Arquivo (${image.name})`}</p>
      </label>
    </fieldset>
  );

  return image ? (
    <article className="relative w-full h-56 min-w-0 grid grid-rows-1 group">
      <Checkbox />
      <ImagePreview image={image} />
      <ImageButtonList image={image} />
    </article>
  ) : (
    <Skeleton className="w-full h-56 min-w-0" />
  );
});
ImagePreviewCard.displayName = "ImagePreviewCard";

const ImagePreview = ({ image }: { image: SupabaseBucketImage }) => {
  const AbsoluteImagePreview = () => (
    <NextImage
      src={image.url}
      alt={image.name}
      fill
      sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="absolute object-contain"
    />
  );

  useRenderCount("ImagePreview"); // DEBUG

  return (
    <Link
      href={image.url}
      target="_blank"
      className={cn(
        "cursor-pointer w-full h-full grid grid-rows-[1fr_60px] transition-shadow duration-300 overflow-hidden rounded outline-none border border-neutral-700",
        hoverWhiteRing,
        focusVisibleWhiteRing
      )}
    >
      <div className="h-full relative">
        <HazardBorder />
        <AbsoluteImagePreview />
      </div>
      <div className="px-3 flex justify-between items-center border-t border-neutral-700 bg-neutral-900">
        <div className="flex flex-col text-left">
          <p className="text-xs text-neutral-300">{image.name}</p>
          <p className="text-xs text-neutral-500">
            {image.metadata.mimetype.split("/")[1]}
          </p>
        </div>
        <div className="w-fit h-fit px-2.5 py-1.5 text-xs text-neutral-500 font-[600] flex justify-center items-center rounded bg-neutral-800">
          <p>{formatType(image.metadata.mimetype)}</p>
        </div>
      </div>
    </Link>
  );
};

const ImageButtonList = ({ image }: { image: SupabaseBucketImage }) => {
  const [, delAction, isDelPending] = React.useActionState(
    async (state: MediaStateProps) => {
      try {
        const formData = new FormData();
        const url = image.url;
        formData.set("fileURL", url);

        // TODO (SUGESTÃO???): ??? criar um botão de desfazer a exclusão do arquivo ???
        const success = (serverResponse: ArticleActionStateProps) => {
          // console.log(serverResponse); // DEBUG
          return <p>Arquivo excluído!</p>;
        };

        const error = (serverResponse: ArticleActionStateProps) => {
          // console.log(serverResponse); // DEBUG
          return <p>Arquivo não excluído</p>;
        };

        const result = deleteFile(state, formData);

        const promise = new Promise((resolve, reject) => {
          result.then((data) => {
            if (data.ok) {
              resolve(result);
            } else {
              reject(result);
            }
          });
        });

        sonnerToastPromise(promise, success, error, "Excluindo arquivos...");

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
    },
    initState
  );

  useRenderCount("ImageButtonList"); // DEBUG

  return (
    <ImageEditorButtonList className="transition-opacity duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100">
      <AlertDialog>
        <ImageEditorButtonLi tooltip="Editar">
          <AlertDialogTrigger asChild>
            <ImageEditorButton
              onClick={(e) => e.stopPropagation()}
              className={cn("size-8", focusVisibleWhiteRing)}
            >
              <PencilIcon className="size-7 p-1.5 stroke-neutral-500" />
            </ImageEditorButton>
          </AlertDialogTrigger>
        </ImageEditorButtonLi>
        <AlertDialogContentEditMedia image={image} />
      </AlertDialog>
      <AlertDialog>
        <ImageEditorButtonLi tooltip="Excluir">
          <AlertDialogTrigger asChild>
            <ImageEditorButton
              onClick={(e) => e.stopPropagation()}
              className={cn("size-8", focusVisibleWhiteRing)}
            >
              <TrashBinIcon className="size-7 p-1.5 stroke-neutral-500" />
            </ImageEditorButton>
          </AlertDialogTrigger>
        </ImageEditorButtonLi>
        <AlertDialogContent>
          <AlertDialogTitle className="flex justify-between items-center px-3 bg-neutral-950">
            Excluir
            <AlertDialogCancelIcon />
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Excluir arquivo
          </AlertDialogDescription>
          <div className="flex items-center p-3 min-h-20 border-y border-neutral-800">
            <p className="text-sm flex items-center gap-2">
              <AlertIcon className="stroke-red-500" />{" "}
              <span className="text-red-500 font-medium">
                Confirmar a exclusão do arquivo?
              </span>
            </p>
          </div>
          <AlertDialogFooter className="flex flex-row sm:flex-row justify-between sm:justify-between items-center p-2 bg-neutral-950">
            <AlertDialogCancel className="text-xs sm:text-sm p-2">
              Cancelar
            </AlertDialogCancel>
            <form>
              <AlertDialogAction
                type="submit"
                formAction={delAction}
                disabled={isDelPending}
              >
                Confirmar
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ImageEditorButtonList>
  );
};

const AlertDialogContentEditMedia = ({
  image,
}: {
  image: SupabaseBucketImage;
}) => {
  useRenderCount("AlertDialogContentEditMedia"); // DEBUG

  return (
    <AlertDialogContent className="sm:max-w-sm lg:max-w-3xl overflow-hidden">
      <AlertDialogTitle className="flex justify-between items-center px-3 border-b border-neutral-800 bg-neutral-950">
        Detalhes
        <AlertDialogCancelIcon />
      </AlertDialogTitle>
      <AlertDialogContentMediaBody image={image} />
      <AlertDialogFooter className="flex flex-row sm:flex-row justify-between items-center p-2 border-t border-neutral-800 bg-neutral-950">
        <AlertDialogCancel className="text-xs sm:text-sm p-2">
          Cancelar
        </AlertDialogCancel>
        <form className="flex-1 flex gap-2 justify-end">
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Trocar arquivo
          </AlertDialogAction>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Salvar
          </AlertDialogAction>
        </form>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

const AlertDialogContentMediaBody = ({
  image,
}: {
  image: SupabaseBucketImage;
}) => {
  const [filename, setFilename] = React.useState(image.name);
  const [alt, setAlt] = React.useState(image.name);
  const [caption, setCaption] = React.useState(""); // TODO: create caption table

  useRenderCount("AlertDialogContentMediaBody"); // DEBUG

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-3">
      <AlertDialogDescription className="sr-only">
        Trocar Media
      </AlertDialogDescription>
      <div className="w-full h-56 min-w-0 overflow-hidden rounded border border-neutral-700">
        <div className="relative w-full h-full flex justify-center items-center">
          <HazardBorder />
          <NextImage
            src={image.url}
            alt={image.name}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="absolute object-contain"
          />
          <ImageEditorButtonList>
            <ImageEditorButtonLi tooltip="Excluir">
              <ImageEditorButton className="size-8">
                <TrashBinIcon className="size-4" />
              </ImageEditorButton>
            </ImageEditorButtonLi>

            <ImageEditorButtonLi tooltip="Copiar link">
              <ImageEditorButton className="size-8">
                <LinkIcon className="size-4" />
              </ImageEditorButton>
            </ImageEditorButtonLi>

            <ImageEditorButtonLi tooltip="Baixar">
              <ImageEditorButton className="size-8">
                <DownloadIcon className="size-4" />
              </ImageEditorButton>
            </ImageEditorButtonLi>

            <ImageEditorButtonLi tooltip="Enviar">
              <ImageEditorButton className="size-8">
                <UploadIcon className="size-4" />
              </ImageEditorButton>
            </ImageEditorButtonLi>
          </ImageEditorButtonList>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <ImageDataInfo
          imageData={{
            preview: null,
            filename: image.name,
            height: 1080, // TODO
            width: 1920, // TODO
            type: image.metadata.mimetype.replace("image/", ""),
            date: image.created_at,
            size: image.metadata.size,
          }}
        />
        <FloatingFieldset>
          <FloatingInput
            id="alert-dialog-replace-media-filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder=""
          />
          <FloatingLabel
            htmlFor="alert-dialog-replace-media-filename"
            label="Filename"
          />
        </FloatingFieldset>
        <div>
          <FloatingFieldset>
            <FloatingInput
              id="alert-dialog-replace-media-alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder=""
            />
            <FloatingLabel
              htmlFor="alert-dialog-replace-media-alt"
              label="Alt"
            />
          </FloatingFieldset>
          <p className="text-neutral-500 text-xs pt-1 px-1">
            Alt é o texto apresentado caso a imagem não possa ser renderizada.
          </p>
        </div>
        <FloatingFieldset>
          <FloatingInput
            id="alert-dialog-replace-media-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <FloatingLabel
            htmlFor="alert-dialog-replace-media-caption"
            label="Legenda"
          />
        </FloatingFieldset>
      </div>
    </div>
  );
};
