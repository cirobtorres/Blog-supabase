"use client";

import React from "react";
import { CancelIcon, PlusIcon } from "../../../../components/Icons";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogCancelIcon,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../components/ui/alert-dialog";
import { cn } from "../../../../utils/classnames";
import { postFiles } from "../../../../services/media.server";
import { sonnerToastPromise } from "../../../../toasters";
import { DragAndDropZone } from "./DragAndDropZone";
import {
  buttonVariants,
  focusVisibleWhiteRing,
} from "../../../../styles/classNames";
import { FilePreviewCard } from "../../FilePreviewCard";
import { Spinner } from "../../../../components/ui/spinner";
import { ExitButton } from "./ExitButton";

const AddFile = React.memo(() => {
  const MAX_SIZE = 5 * 1024 * 1024;
  const [openStep, setOpenStep] = React.useState<"upload" | "preview" | null>(
    null
  );
  const [files, setFiles] = React.useState<FileWithMetadataTemp[]>([]);
  const [isPending, setIsPending] = React.useState(false);

  const handleFilesSelected = (newFiles: File[]) => {
    const mapped: FileWithMetadataTemp[] = [];

    let filesSize = 0;

    for (const file of newFiles) {
      filesSize += file.size;

      if (filesSize > MAX_SIZE) {
        mapped.push({
          file,
          filename: file.name,
          altText: file.name,
          caption: "",
          blocked: true,
        });

        continue;
      }

      mapped.push({
        file,
        filename: file.name,
        altText: file.name,
        caption: "",
        blocked: false,
      });
    }

    setFiles((prev) => [...prev, ...mapped]);
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
    setFiles((prev) => {
      const remainingFiles = prev.filter(({ file }) => file !== fileToRemove);
      if (remainingFiles.length === 0) setOpenStep("upload");
      return remainingFiles;
    });
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

      // const success = (serverResponse: ArticleActionStateProps) => {
      const success = () => {
        return <p>Arquivos enviados!</p>;
      };

      // const error = (serverResponse: ArticleActionStateProps) => {
      const error = () => {
        return <p>Falha ao enviar arquivos</p>;
      };

      const promise = postFiles(formData);

      sonnerToastPromise(promise, success, error, "Enviando arquivos...");

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
            "w-40 cursor-pointer flex justify-center items-center gap-2 rounded px-2 py-1 text-sm border duration-300 outline-none text-neutral-100 border-theme-color bg-theme-color-light",
            focusVisibleWhiteRing
          )}
        >
          <PlusIcon className="size-4" />
          Adicionar Asset
        </button>
      </AlertDialogTrigger>

      {openStep === "upload" && (
        <AlertDialogContent className="sm:max-w-3xl overflow-hidden">
          <AlertDialogTitle className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-neutral-700 flex justify-between items-center bg-neutral-950">
            <AlertDialogDescription>
              Adicionar novo&#40;s&#41; arquivo&#40;s&#41;
            </AlertDialogDescription>
            <AlertDialogCancelIcon />
          </AlertDialogTitle>
          <DragAndDropZone onFilesSelected={handleFilesSelected} />
          <AlertDialogFooter className="w-full flex justify-between sm:justify-between items-center relative after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-neutral-700 bg-neutral-950">
            <AlertDialogCancel className="mr-auto">Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}

      {openStep === "preview" && (
        <AlertDialogContent className="min-[768px]:max-w-[calc(1024px-2rem)] md:max-w-[calc(768px-2rem)] sm:max-w-[calc(100%-2rem)] overflow-hidden">
          <AlertDialogTitle className="relative flex justify-between items-center after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-neutral-700 bg-neutral-950">
            <AlertDialogDescription>
              Adicione novos assets
            </AlertDialogDescription>
            <ExitButton onConfirm={() => setOpenStep(null)}>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                <CancelIcon />
              </button>
            </ExitButton>
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
              <DragAndDropZone onFilesSelected={handleFilesSelected} />
            </div>
          </div>
          <AlertDialogFooter className="w-full flex justify-between sm:justify-between items-center relative after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-neutral-700 bg-neutral-950">
            <ExitButton onConfirm={() => setOpenStep(null)}>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Cancelar
              </button>
            </ExitButton>
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
});

AddFile.displayName = "AddFile";

export default AddFile;
