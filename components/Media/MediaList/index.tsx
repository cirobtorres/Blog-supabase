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
import React from "react";
import {
  ImageDataInfo,
  ImageEditorButton,
  ImageEditorButtonLi,
  ImageEditorButtonList,
} from "../../Fieldsets/ArticleEditor";
import { formatType } from "@/utils/strings";
import { buttonVariants, focusVisibleThemeRing } from "@/styles/classNames";
import { cn } from "../../../utils/classnames";
import { deleteFile, deleteFiles } from "../../../services/media";
import { sonnerToastPromise } from "../../../toasters";
import { convertToLargeDate } from "../../../utils/dates";
import { Skeleton } from "../../../components/ui/skeleton";
import { useImage } from "../../../hooks/useImage";
import Link from "next/link";

interface MediaStateProps {
  ok: boolean;
  success: string | null;
  error: string | null;
  data: File | null;
}

const initState: MediaStateProps = {
  ok: false,
  success: null,
  error: null,
  data: null,
};

export default function MediaList({
  images,
}: {
  images: SupabaseBucketImage[];
}) {
  const [checkBoxList, setCheckBoxList] = React.useState<{ url: string }[]>([]);

  console.log("MediaList renderizou"); // TODO: remover

  const [checkedItemsState, deleteCheckedItemsAction] = React.useActionState(
    async (state: MediaStateProps) => {
      try {
        const formData = new FormData();

        const success = () => {
          const now = convertToLargeDate(new Date()); // TODO
          return "Arquivo excluído!";
        };

        const error = () => {
          return "Arquivo não excluído!";
        };

        formData.set("checkBoxList", JSON.stringify(checkBoxList));

        const result = deleteFiles(state, formData);

        const promise = new Promise((resolve, reject) => {
          result.then((data) => {
            if (data.ok) {
              resolve(result);
              // removeFromCards(checkBoxList);
            } else {
              reject(result);
            }
          });
        });

        sonnerToastPromise(promise, success, error, "Excluindo arquivo...");

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

  return (
    <>
      <div className="flex items-center gap-2">
        <p className="text-neutral-500">
          {checkBoxList.length} arquivo{checkBoxList.length > 1 && "s"}
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              // disabled={checkBoxList.length === 0}
              disabled={false}
              className="cursor-pointer flex justify-center items-center gap-1 outline-none text-sm text-red-500 duration-300 rounded-xs font-medium px-3 py-1.5 border border-neutral-800 hover:border-neutral-700 bg-neutral-950 hover:bg-neutral-900 disabled:cursor-auto disabled:border-neutral-800 disabled:text-neutral-600 disabled:bg-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:bg-neutral-900 group"
            >
              <TrashBinIcon className="size-4 duration-300 stroke-red-500 group-disabled:stroke-neutral-600" />
              Excluir
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="overflow-hidden">
            <AlertDialogTitle className="text-neutral-300 flex justify-between bg-neutral-950">
              Confirmação
              <AlertDialogCancelIcon />
            </AlertDialogTitle>
            <AlertDialogDescription className="flex gap-2 items-center min-h-20 border-y border-neutral-800">
              <AlertIcon className="stroke-red-500" />{" "}
              <span className="text-red-500 font-medium">
                Confirmar a exclusão{" "}
                {checkBoxList.length > 1 ? "dos arquivos" : "do arquivo"}?
              </span>
            </AlertDialogDescription>
            <AlertDialogFooter className="flex justify-between sm:justify-between bg-neutral-950">
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <form>
                <AlertDialogAction
                  type="submit"
                  disabled={checkBoxList.length === 0}
                  formAction={deleteCheckedItemsAction}
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  Confirmar
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <h2 className="text-xl font-extrabold text-neutral-300">
        Assets ({images.length})
      </h2>
      <ul className="grid grid-cols-1 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-2">
        {images.map((image) => (
          <ImagePreviewCard key={image.id} image={image} />
        ))}
      </ul>
    </>
  );
}

export const ImagePreviewCard = React.memo(
  ({ image }: { image: SupabaseBucketImage }) => {
    console.log("ImagePreviewCard renderizou"); // TODO: remover

    const Checkbox = () => (
      <fieldset className="size-6 absolute left-3 top-3 z-10">
        <label htmlFor={image.id} className="cursor-pointer size-6 absolute">
          <ShadcnUICheckbox
            id={image.id}
            name="checkboxList[]"
            value={image.url}
            className="cursor-pointer"
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
  }
);

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

  return (
    <Link
      href={image.url}
      target="_blank"
      className="cursor-pointer w-full h-full grid grid-rows-[1fr_60px] duration-300 overflow-hidden rounded outline-none border border-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:border-transparent hover:ring-2 hover:ring-neutral-100"
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
            {/* - {image.width}x{image.height} */}
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
  const { removeFromCards } = useImage();

  const [deleteState, deleteStateAction] = React.useActionState(
    async (state: MediaStateProps) => {
      try {
        const formData = new FormData();
        const url = image.url;
        formData.set("fileURL", url);

        const success = () => {
          const now = convertToLargeDate(new Date()); // TODO
          return "Arquivo excluído!";
        };

        const error = () => {
          return "Arquivo não excluído!";
        };

        const result = deleteFile(state, formData);

        const promise = new Promise((resolve, reject) => {
          result.then((data) => {
            if (data.ok) {
              resolve(result);
              removeFromCards([{ url }]);
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

  return (
    <ImageEditorButtonList className="transition-opacity duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100">
      <AlertDialog>
        <ImageEditorButtonLi tooltip="Editar">
          <AlertDialogTrigger asChild>
            <ImageEditorButton
              onClick={(e) => e.stopPropagation()}
              className={cn("size-8", focusVisibleThemeRing)}
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
              className={cn("size-8", focusVisibleThemeRing)}
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
              <AlertDialogAction type="submit" formAction={deleteStateAction}>
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
}) => (
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

const AlertDialogContentMediaBody = ({
  image,
}: {
  image: SupabaseBucketImage;
}) => {
  const [filename, setFilename] = React.useState(image.name);
  const [alt, setAlt] = React.useState(image.name);
  // const [caption, setCaption] = React.useState(image.caption);

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
        {/* <FloatingFieldset>
          <FloatingInput
            id="alert-dialog-replace-media-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder=""
          />
          <FloatingLabel
            htmlFor="alert-dialog-replace-media-caption"
            label="Caption"
          />
        </FloatingFieldset> */}
      </div>
    </div>
  );
};
