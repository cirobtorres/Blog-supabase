import { CancelIcon, PlusIcon } from "../../../../components/Icons";
import { LoadingSpinning } from "../../../../components/LoadingSpinning";
import MediaCard from "../../../Media/MediaCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../components/ui/alert-dialog";
import { AspectRatio } from "../../../../components/ui/aspect-ration";
import { getFiles } from "../../../../services/media.server";
import {
  buttonVariants,
  focusVisibleWhiteRing,
} from "../../../../styles/classNames";
import { cn } from "../../../../utils/classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import DragAndDropZoneButtons from "./DragAndDropZoneButtons";

export default function DragAndDropZone({
  imageFile,
  openStep,
  previewUrl,
  setImageFile,
  setOpenStep,
  setPreviewUrl,
  onFileSelected,
}: DragAndDropZoneProp) {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [files, setFiles] = useState<SupabaseBucketMedia[] | [] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCoverId, setSelectedCoverId] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] =
    useState<SupabaseBucketMedia | null>(null);

  function handleSelect(file: SupabaseBucketMedia) {
    setSelectedCoverId(file.id);
    setSelectedMedia(file);
  }

  // ----------=== Drag events ===----------
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = Array.from(e.dataTransfer.files)[0];
    onFileSelected(file);
  };

  const handleOnClick = () => {
    setOpenStep("preview");
    setPreviewUrl(selectedMedia?.url ?? null);
  };

  useEffect(() => {
    if (!imageFile) return;
    const { file } = imageFile;
    const isImage = file.type.startsWith("image/");
    if (!isImage) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    if (!files && openDialog === true) {
      (async () => {
        try {
          setLoading(true);
          const bucket = "articles";
          const folder = "";
          const queriedFiles = await getFiles({ bucket, folder });
          setFiles(queriedFiles.map((fil) => fil));
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [openDialog]);

  // useRenderCount("DragAndDropZone"); // DEBUG

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      {openStep === "upload" && !previewUrl && (
        <AlertDialogTrigger
          className={cn(
            "w-full rounded-sm cursor-pointer min-h-72 p-8 flex items-center overflow-hidden border outline-none transition-all duration-300 border-neutral-700 bg-neutral-950",
            focusVisibleWhiteRing
          )}
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "cursor-pointer w-full h-full flex flex-col gap-4 justify-center rounded items-center transition-all duration-300 border border-dashed border-neutral-700",
              isDragging
                ? "ring-2 ring-theme-color bg-theme-color-backdrop"
                : ""
            )}
          >
            <PlusIcon className="shrink-0 rounded-full p-1 stroke-2 stroke-neutral-950 bg-theme-color" />
            <span className="text-xs font-bold text-neutral-500">
              Clique e selecione uma imagem do banco ou arraste e solte um
              arquivo de imagem aqui.
            </span>
          </div>
        </AlertDialogTrigger>
      )}
      {openStep === "preview" && previewUrl && (
        <div className="w-full flex flex-col items-center rounded-sm border border-neutral-700 bg-neutral-950">
          <AspectRatio
            ratio={25 / 9}
            className="w-full min-h-40 p-8 flex items-center overflow-hidden outline-none transition-all duration-300"
          >
            <Image
              src={previewUrl}
              alt={
                selectedMedia?.media_metadata.metadata.altText ??
                selectedMedia?.name ??
                "Capa do artigo"
              } // TODO
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="absolute object-contain p-8 pb-4"
            />
            <DragAndDropZoneButtons
              {...{
                media: selectedMedia,
                exclude: () => {
                  setImageFile(null);
                  setOpenStep("upload");
                  setSelectedMedia(null);
                  setSelectedCoverId(null);
                  setPreviewUrl(null);
                },
              }}
            />
          </AspectRatio>
          <div className="text-neutral-500 text-sm pb-4">
            <p>{selectedMedia?.name}</p>
          </div>
        </div>
      )}
      <AlertDialogContent className="h-full flex flex-col max-h-9/12 sm:max-w-5xl overflow-hidden">
        {loading ? (
          <AlertDialogHeader>
            <AlertDialogTitle className="sr-only">
              Carregando...
            </AlertDialogTitle>
            <LoadingSpinning className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
          </AlertDialogHeader>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-neutral-700 flex items-center justify-between p-4 bg-neutral-950">
                Adicionar capa de artigo
                <AlertDialogCancel
                  className="has-[>svg]:px-1 h-fit py-1"
                  onClick={() => setOpenDialog(false)}
                >
                  <CancelIcon />
                </AlertDialogCancel>
              </AlertDialogTitle>
            </AlertDialogHeader>
            {files && files.length > 0 ? (
              <div className="h-full grid grid-cols-4 gap-4 p-8 m-2 overflow-y-auto scrollbar">
                {files.map((file) => (
                  <MediaCard
                    key={file.id}
                    data={file}
                    options={{ linkClassname: "h-60" }}
                    isChecked={selectedCoverId === file.id}
                    onCheck={() => handleSelect(file)}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full p-8 m-2 flex items-center justify-center pointer-events-none">
                <p className="text-neutral-500">
                  Você ainda não possui imagens
                </p>
              </div>
            )}
            <AlertDialogFooter className="h-fit relative flex flex-row sm:flex-row justify-between sm:justify-between gap-2 p-4 after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-neutral-700 bg-neutral-950">
              <AlertDialogCancel
                onClick={() => {
                  setOpenDialog(false);
                  setSelectedCoverId(null);
                  setSelectedMedia(null);
                }}
                className={buttonVariants({ variant: "default" })}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                type="button"
                onClick={handleOnClick}
                disabled={!selectedMedia || !selectedCoverId}
                className={
                  !selectedMedia || !selectedCoverId
                    ? buttonVariants({ variant: "disabled" })
                    : buttonVariants({ variant: "outline" })
                }
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
