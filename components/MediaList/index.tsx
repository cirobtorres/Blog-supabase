"use client";

import { HazardBorder } from "@/components/HazardBorder";
import { Checkbox as ShadcnUICheckbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  CancelIcon,
  DownloadIcon,
  LinkIcon,
  PencilIcon,
  TrashBinIcon,
  UploadIcon,
} from "../Icons";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { FloatingFieldset, FloatingInput, FloatingLabel } from "../Fieldsets";
import { useState } from "react";
import {
  ImageDataInfo,
  ImageEditorButton,
  ImageEditorButtonLi,
  ImageEditorButtonList,
} from "../Fieldsets/ArticleEditor";
import { formatType } from "@/utils/strings";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { focusVisibleThemeRing } from "@/styles/classNames";
import { cn } from "@/utils/classnames";

interface ImageProps {
  id: string;
  url: string;
  alt: string;
  name: string;
  size: number;
  width: number;
  height: number;
  date: string;
  type: string;
  caption: string;
}

// TODO: corrigir tipo de images
export default function MediaList({ images }: { images: ImageProps[] }) {
  const [checkBoxList, setCheckBoxList] = useState(null);

  const handleCheckBoxList = () => {};

  return (
    <>
      <div className="flex items-center gap-2">
        <p className="text-neutral-500">1 asset</p>
        <button
          type="button"
          onClick={() => console.log("Excluir")}
          className="cursor-pointer flex justify-center items-center gap-1 text-sm text-rose-500 transition-[background-color] rounded px-4 py-2 border border-neutral-800 bg-neutral-950 hover:bg-neutral-900"
        >
          <TrashBinIcon className="size-4 stroke-rose-500" />
          Excluir
        </button>
      </div>
      <h2 className="text-xl font-extrabold text-neutral-300">
        Assets ({images.length})
      </h2>
      <ul className="grid grid-cols-1 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-2">
        {images.map((image) => (
          <AlertDialog key={image.id}>
            <ImagePreviewCard image={image} />
            <AlertDialogContentMedia image={image} />
          </AlertDialog>
        ))}
      </ul>
    </>
  );
}

export const ImagePreviewCard = ({ image }: { image: ImageProps }) => (
  <div className="relative w-full h-56 min-w-0 grid grid-rows-1 group">
    <Checkbox id={image.id} label={`Label do media page (${image.id})`} />
    <AlertDialogTrigger className="relative" tabIndex={-1}>
      <article className="w-full h-full grid grid-rows-[1fr_60px] cursor-pointer overflow-hidden rounded border border-neutral-700">
        <div className="h-full relative">
          <div className="z-10 absolute top-1 right-1 flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Editar");
                  }}
                  tabIndex={0}
                  className={cn(
                    "shrink-0 cursor-pointer opacity-0 bg-neutral-800 rounded border border-neutral-700 group-hover:opacity-100 hover:opacity-100 hover:bg-neutral-900 group-focus-within:opacity-100",
                    focusVisibleThemeRing
                  )}
                >
                  <PencilIcon className="size-7 p-1.5 stroke-neutral-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>Editar</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Remover");
                  }}
                  tabIndex={0}
                  className={cn(
                    "shrink-0 cursor-pointer opacity-0 bg-neutral-800 rounded border border-neutral-700 group-hover:opacity-100 hover:opacity-100 hover:bg-neutral-900 group-focus-within:opacity-100",
                    focusVisibleThemeRing
                  )}
                >
                  <TrashBinIcon className="size-7 p-1.5 stroke-neutral-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>Remover</TooltipContent>
            </Tooltip>
          </div>
          <HazardBorder />
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="absolute object-contain"
          />
        </div>
        <div className="px-3 flex justify-between items-center border-t border-neutral-700 bg-neutral-900">
          <div className="flex flex-col text-left">
            <p className="text-xs text-neutral-300">{image.name}</p>
            <p className="text-xs text-neutral-500">
              {image.type} - {image.width}x{image.height}
            </p>
          </div>
          <div className="w-fit h-fit px-2.5 py-1.5 text-xs text-neutral-500 font-[600] flex justify-center items-center rounded bg-neutral-800">
            <p>{formatType(image.type)}</p>
          </div>
        </div>
      </article>
    </AlertDialogTrigger>
  </div>
);

// TODO: Corrigir o checkbox
const Checkbox = ({ id, label }: { id: string; label: string }) => (
  <fieldset className="absolute left-3 top-3 z-10">
    <label htmlFor={id}>
      <ShadcnUICheckbox id={id} className="cursor-pointer" />
      <p className="sr-only">{label}</p>
    </label>
  </fieldset>
);

const AlertDialogContentMedia = ({ image }: { image: ImageProps }) => (
  <AlertDialogContent className="sm:max-w-sm overflow-hidden">
    <AlertDialogHeaderMedia />
    <AlertDialogContentMediaBody image={image} />
    <AlertDialogFooterMedia />
  </AlertDialogContent>
);

const AlertDialogHeaderMedia = () => (
  <AlertDialogTitle className="flex justify-between items-center px-3 border-b border-neutral-800 bg-neutral-950">
    Detalhes
    <AlertDialogCancel className="w-fit">
      <CancelIcon />
    </AlertDialogCancel>
  </AlertDialogTitle>
);

const AlertDialogContentMediaBody = ({ image }: { image: ImageProps }) => {
  const [filename, setFilename] = useState(image.name);
  const [alt, setAlt] = useState(image.alt);
  const [caption, setCaption] = useState(image.caption);

  return (
    <div className="p-3">
      <AlertDialogDescription className="sr-only">
        Trocar Media
      </AlertDialogDescription>
      <div className="w-full h-56 min-w-0 overflow-hidden rounded border border-neutral-700">
        <div className="relative w-full h-full flex justify-center items-center">
          <HazardBorder />
          <Image
            src={image.url}
            alt={image.alt}
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
            height: image.height,
            width: image.width,
            type: image.type,
            date: image.date,
            size: image.size,
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
        <FloatingFieldset>
          <FloatingInput
            id="alert-dialog-replace-media-alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder=""
          />
          <FloatingLabel htmlFor="alert-dialog-replace-media-alt" label="Alt" />
        </FloatingFieldset>
        <p className="text-neutral-500 text-xs">
          Alt é o texto apresentado caso a imagem não possa ser renderizada.
        </p>
        <FloatingFieldset>
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
        </FloatingFieldset>
      </div>
    </div>
  );
};

const AlertDialogFooterMedia = () => (
  <AlertDialogFooter className="flex flex-row sm:flex-row justify-between items-center p-2 border-t border-neutral-800 bg-neutral-950">
    <AlertDialogCancel className="text-xs sm:text-sm p-2">
      Cancelar
    </AlertDialogCancel>
    <div className="flex-1 flex gap-1 justify-end">
      <button
        type="button"
        onClick={() => console.log("TROCAR")}
        className={
          `inline-flex items-center justify-center gap-2 shrink-0 outline-none cursor-pointer whitespace-nowrap text-xs sm:text-sm font-medium rounded-md transition-all ` +
          `[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 bg-neutral-900 border border-neutral-800 ` +
          `focus-visible:ring-2 focus-visible:border-transparent focus-visible:ring-neutral-100 ` +
          `disabled:pointer-events-none disabled:opacity-50 p-2 has-[>svg]:px-3`
        }
      >
        Trocar Media
      </button>
      <button
        type="button"
        onClick={() => console.log("SALVAR")}
        className={
          `inline-flex items-center justify-center gap-2 shrink-0 outline-none cursor-pointer whitespace-nowrap text-xs sm:text-sm font-medium rounded-md transition-all ` +
          `[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 bg-neutral-900 border border-neutral-800 ` +
          `focus-visible:ring-neutral-100 focus-visible:ring-2 focus-visible:border-transparent ` +
          `disabled:pointer-events-none disabled:opacity-50 p-2 has-[>svg]:px-3`
        }
      >
        Salvar
      </button>
    </div>
  </AlertDialogFooter>
);
