"use client";

import { cn } from "@/utils/classnames";
import { CancelIcon, PencilIcon, PlusIcon, TrashBinIcon } from "../Icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { ReactNode, useRef, useState } from "react";
import { HazardBorder } from "../HazardBorder";
import { formatType } from "@/utils/strings";
import { buttonVariants, focusVisibleThemeRing } from "../../styles/classNames";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const className =
  "w-40 cursor-pointer flex justify-center items-center gap-2 rounded px-2 py-1 text-sm border duration-300 outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:border-transparent";

export default function MediaHeader() {
  return (
    <div className="flex justify-between">
      <h1 className="text-5xl font-extrabold text-neutral-300">Bucket</h1>
      <div className="flex justify-center items-center gap-1">
        <button
          type="submit"
          onClick={() => console.log("Criar Pasta")}
          className={cn(
            className,
            "text-theme-color border-neutral-800 bg-neutral-900"
          )}
        >
          <PlusIcon className="size-4" /> Criar Pasta
        </button>
        <AddMedia />
      </div>
    </div>
  );
}

const AddMedia = () => {
  const [openStep, setOpenStep] = useState<"upload" | "preview" | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(newFiles);
    setOpenStep("preview"); // fecha upload e abre preview
  };

  const removeFiles = (fileToRemove: File) => {
    setFiles((prev) => {
      const filteredFiles = prev.filter((file) => file !== fileToRemove);
      if (filteredFiles.length === 0) {
        setOpenStep(null);
      }
      return filteredFiles;
    });
  };

  return (
    <AlertDialog
      open={!!openStep}
      onOpenChange={(boolean) => !boolean && setOpenStep(null)}
    >
      <AlertDialogTrigger asChild>
        <button
          type="submit"
          onClick={() => setOpenStep("upload")}
          className={cn(
            className,
            "text-neutral-100 border-theme-color bg-theme-color-light"
          )}
        >
          <PlusIcon className="size-4" />
          Adicionar Asset
        </button>
      </AlertDialogTrigger>

      {openStep === "upload" && (
        <AlertDialogContent className="sm:max-w-3xl overflow-hidden">
          <AlertDialogTitle className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-800 flex justify-between items-center bg-neutral-950">
            <AlertDialogDescription>
              Adicionar novo&#40;s&#41; arquivo&#40;s&#41;
            </AlertDialogDescription>
            <AlertDialogCancel>
              <CancelIcon />
            </AlertDialogCancel>
          </AlertDialogTitle>
          <DragAndDropZone onFilesSelected={handleFilesSelected} />
          <AlertDialogFooter className="w-full flex justify-between sm:justify-between items-center relative after:absolute after:top-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-800 bg-neutral-950">
            <AlertDialogCancel className="mr-auto">Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}

      {openStep === "preview" && (
        <AlertDialogContent className="sm:max-w-3xl overflow-hidden">
          <AlertDialogTitle className="relative flex justify-between items-center after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-800 bg-neutral-950">
            <AlertDialogDescription>
              Adicione novos assets
            </AlertDialogDescription>
            <ConfirmExitButton onConfirm={() => setOpenStep(null)}>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                <CancelIcon />
              </button>
            </ConfirmExitButton>
          </AlertDialogTitle>
          <div className="grid grid-cols-3 gap-2 p-4">
            {files.map((file, index) => (
              <FilePreviewCard
                key={`${file.name}-${index}`}
                file={file}
                removeFiles={removeFiles}
              />
            ))}
          </div>
          <AlertDialogFooter className="w-full flex justify-between sm:justify-between items-center relative after:absolute after:top-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-800 bg-neutral-950">
            <ConfirmExitButton onConfirm={() => setOpenStep(null)}>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Cancelar
              </button>
            </ConfirmExitButton>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Enviar {files.length} assets ao bucket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

interface DragAndDropZoneProps {
  onFilesSelected: (files: File[]) => void;
}

interface FilePreviewCardProps {
  file: File;
  removeFiles: (file: File) => void;
}

const DragAndDropZone = ({ onFilesSelected }: DragAndDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ----------=== Drag events ===----------
  const handleDragOver = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
    // ...
  };

  // ----------=== Input control ===----------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    onFilesSelected(files);
  };

  // ----------=== Optional: button ===----------
  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="p-8">
      <form
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "h-72 rounded border-dashed outline-none transition-all duration-300 border border-neutral-700 bg-neutral-950",
          isDragging ? "ring-2 ring-theme-color" : ""
        )}
      >
        <label className="h-full relative flex flex-col gap-4 justify-center items-center">
          <input
            ref={inputRef}
            type="file"
            name="files"
            multiple
            aria-label="Arraste e solte os arquivos aqui"
            tabIndex={-1}
            onChange={handleInputChange}
            className="cursor-pointer absolute inset-0 outline-none opacity-0"
          />
          <PlusIcon className="rounded-full p-1 stroke-2 stroke-neutral-950 bg-theme-color" />
          <span className="font-bold text-neutral-500">
            Arraste e solte aqui
          </span>
          <button
            type="button"
            onClick={handleButtonClick}
            className={cn(
              className,
              "w-fit text-neutral-100 border-theme-color bg-theme-color-light"
            )}
          >
            Buscar arquivos
          </button>
        </label>
      </form>
    </div>
  );
};

const FilePreviewCard = ({ file, removeFiles }: FilePreviewCardProps) => {
  const isImage = file.type.startsWith("image/");
  const previewUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <>
      <article
        className={
          "w-60 h-40 min-w-0 cursor-pointer duration-300 overflow-hidden outline-none rounded " +
          "grid grid-rows-[1fr_minmax(0,calc(16px_*_3_+_16px_+_1px))] " +
          "border border-neutral-700 " +
          "group "
        }
      >
        <div className="relative">
          <div className="z-10 absolute top-1 right-1 flex gap-2 group-focus-within:[&_button]:opacity-100">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => console.log("Editar")}
                  className={cn(
                    "cursor-pointer shrink-0 rounded outline-none border border-neutral-700 bg-neutral-800 hover:bg-neutral-900 opacity-0 group-hover:opacity-100 focus-visible:ring-2 focus-visible:ring-theme-color",
                    focusVisibleThemeRing
                  )}
                >
                  <PencilIcon className="size-7 p-1.5 stroke-neutral-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>Editar</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => removeFiles(file)}
                  className={cn(
                    "cursor-pointer shrink-0 rounded outline-none border border-neutral-700 bg-neutral-800 hover:bg-neutral-900 opacity-0 group-hover:opacity-100 focus-visible:ring-2 focus-visible:ring-theme-color",
                    focusVisibleThemeRing
                  )}
                >
                  <TrashBinIcon className="size-7 p-1.5 stroke-neutral-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>Remover</TooltipContent>
            </Tooltip>
          </div>
          <HazardBorder />
          <Image
            src={previewUrl ?? "/images/no-image-avaiable.png"}
            alt={file.name}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="absolute object-contain"
          />
        </div>
        <div className="px-3 py-2 flex justify-between gap-2 items-start border-t border-neutral-700 bg-neutral-900">
          <p className="text-xs text-neutral-300 font-medium line-clamp-3">
            {file.name}
          </p>
          <div className="w-fit h-fit p-1.5 text-[10px] text-neutral-500 font-[600] flex justify-center items-center rounded bg-neutral-800">
            <p>{formatType(file.type)}</p>
          </div>
        </div>
      </article>
    </>
  );
};

interface ConfirmExitButtonProps {
  onConfirm: () => void;
  children: ReactNode;
}

const ConfirmExitButton = ({ onConfirm, children }: ConfirmExitButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="overflow-hidden">
        <AlertDialogTitle className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-800 flex justify-between items-center bg-neutral-950">
          Sair sem salvar?
          <AlertDialogCancel>
            <CancelIcon />
          </AlertDialogCancel>
        </AlertDialogTitle>
        <AlertDialogDescription className="min-h-20 flex items-center text-neutral-500">
          Os arquivos selecionados serão descartados. Deseja realmente sair?
        </AlertDialogDescription>
        <AlertDialogFooter className="w-full flex justify-between sm:justify-between items-center relative after:absolute after:top-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-800 bg-neutral-950">
          <AlertDialogCancel
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Voltar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Sair mesmo assim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
