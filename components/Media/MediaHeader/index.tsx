"use client";

import { cn } from "@/utils/classnames";
import { CancelIcon, PencilIcon, PlusIcon, TrashBinIcon } from "../../Icons";
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
import React from "react";
import { HazardBorder } from "../../HazardBorder";
import { formatType } from "@/utils/strings";
import {
  buttonVariants,
  focusVisibleThemeRing,
  focusVisibleWhiteRing,
} from "../../../styles/classNames";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import {
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
} from "@/components/Fieldsets";
import { sonnerToastPromise } from "@/toasters";
import { Spinner } from "@/components/ui/spinner";
import { postFiles } from "@/services/media.client";

const className = cn(
  "w-40 cursor-pointer flex justify-center items-center gap-2 rounded px-2 py-1 text-sm border duration-300 outline-none",
  focusVisibleWhiteRing
);

interface DragAndDropZoneProps {
  onFilesSelected: (files: File[]) => void;
}

type FileWithMetadata = {
  file: File;
  filename: string;
  caption: string;
  altText: string;
};

interface FilePreviewCardProps {
  data: FileWithMetadata;
  index: number;
  updateFiles: (index: number, updates: Partial<FileWithMetadata>) => void;
  removeFiles: (file: File) => void;
}

interface ConfirmExitButtonProps {
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function MediaHeader() {
  return (
    <div className="flex flex-col md:flex-row md:justify-between">
      <h1 className="text-5xl font-extrabold text-neutral-300 mb-8 md:mb-0">
        Bucket
      </h1>
      <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-1">
        <CreateFile />
        <AddFile />
      </div>
    </div>
  );
}

const CreateFile = () => (
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
);

const AddFile = () => {
  const [openStep, setOpenStep] = React.useState<"upload" | "preview" | null>(
    null
  );
  const [files, setFiles] = React.useState<FileWithMetadata[]>([]);
  const [isPending, setIsPending] = React.useState(false);

  const handleFilesSelected = (newFiles: File[]) => {
    const mapped = newFiles.map((f) => ({
      file: f,
      filename: f.name,
      caption: "",
      altText: f.name,
    }));
    setFiles(mapped);
    setOpenStep("preview");
  };

  const updateFiles = React.useCallback(
    (index: number, updates: Partial<FileWithMetadata>) => {
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = { ...newFiles[index], ...updates };
        return newFiles;
      });
    },
    []
  );

  const removeFiles = (fileToRemove: File) => {
    setFiles((prev) => prev.filter(({ file }) => file !== fileToRemove));
  };

  const handleSubmitFiles = async () => {
    setIsPending(true);
    try {
      const formData = new FormData();

      files.forEach((item, index) => {
        formData.append("filesToSubmit", item.file);
        formData.append(
          `metadata_${index}`,
          JSON.stringify({
            filename: item.filename,
            caption: item.caption,
            altText: item.altText,
          })
        );
      });

      // console.log([...formData.entries()]); // DEBUG

      const promise = postFiles(formData);

      sonnerToastPromise(
        promise,
        () => "Arquivos enviados!",
        () => "Falha ao enviar arquivos",
        "Enviando arquivos..."
      );

      await promise;
      setOpenStep(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog
      open={!!openStep}
      onOpenChange={(boolean) => !boolean && setOpenStep(null)}
    >
      <AlertDialogTrigger asChild>
        <button
          type="button"
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
            <AlertDialogCancelIcon />
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
          <div className="px-2 py-4">
            <div className="max-h-[502px] px-2 grid grid-cols-1 gap-2 scrollbar overflow-y-auto">
              {files.map((item, index) => (
                <FilePreviewCard
                  key={`${item.file.name}-${index}`}
                  data={item}
                  index={index}
                  updateFiles={updateFiles}
                  removeFiles={removeFiles}
                />
              ))}
            </div>
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
            <form>
              <button
                type="submit"
                onClick={handleSubmitFiles}
                disabled={isPending}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Enviar {files.length} assets ao bucket{" "}
                {isPending && <Spinner />}
              </button>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

const DragAndDropZone = ({ onFilesSelected }: DragAndDropZoneProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

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

const FilePreviewCard = React.memo(
  ({ data, index, updateFiles, removeFiles }: FilePreviewCardProps) => {
    const { file, filename, caption, altText } = data;
    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : null;

    console.log("FilePreviewCard RENDERIZEI!");

    return (
      <div className="w-full rounded grid grid-cols-[240px_1fr] border border-neutral-700 overflow-hidden">
        <article
          className={
            "w-60 h-40 min-w-0 cursor-pointer duration-300 overflow-hidden outline-none " +
            "grid grid-rows-[1fr_minmax(0,calc(16px_*_3_+_16px_+_1px))] " +
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
                      "cursor-pointer shrink-0 transition-all duration-300 rounded outline-none border border-neutral-700 bg-neutral-800 hover:bg-neutral-900 opacity-0 group-hover:opacity-100",
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
                      "cursor-pointer shrink-0 transition-all duration-300 rounded outline-none border border-neutral-700 bg-neutral-800 hover:bg-neutral-900 opacity-0 group-hover:opacity-100",
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
        <div className="w-full flex flex-col gap-2 p-2 border-l border-neutral-700">
          <FloatingFieldset>
            <FloatingInput
              value={filename}
              id={`floating-filename-text-${file.name}-${index}`}
              placeholder="Escreva um subtítulo"
              onChange={(e) => updateFiles(index, { filename: e.target.value })}
            />
            <FloatingLabel
              htmlFor={`floating-filename-text-${file.name}-${index}`}
              label="Nome"
            />
          </FloatingFieldset>
          <FloatingFieldset>
            <FloatingInput
              value={caption}
              id={`floating-caption-text-${file.name}-${index}`}
              placeholder="Escreva uma legenda"
              onChange={(e) => updateFiles(index, { caption: e.target.value })}
            />
            <FloatingLabel
              htmlFor={`floating-caption-text-${file.name}-${index}`}
              label="Legenda"
            />
          </FloatingFieldset>
          <FloatingFieldset>
            <FloatingInput
              id={`floating-alt-text-${file.name}-${index}`}
              value={altText}
              placeholder="Escreva um texto alternativo"
              onChange={(e) => updateFiles(index, { altText: e.target.value })}
            />
            <FloatingLabel
              htmlFor={`floating-alt-text-${file.name}-${index}`}
              label="Alt"
            />
          </FloatingFieldset>
          <p className="text-neutral-500 text-xs">
            Alt é o texto apresentado caso a imagem não possa ser renderizada.
          </p>
        </div>
      </div>
    );
  }
);

FilePreviewCard.displayName = "FilePreviewCard";

const ConfirmExitButton = ({ onConfirm, children }: ConfirmExitButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="overflow-hidden">
        <AlertDialogTitle className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-800 flex justify-between items-center bg-neutral-950">
          Sair sem salvar?
          <AlertDialogCancelIcon />
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
