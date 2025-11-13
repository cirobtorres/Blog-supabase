"use client";

import React from "react";
import MediaHeader from "./MediaHeader";
import { ImagePreviewCard } from "./MediaList";
import MediaPagination from "./MediaPagination";
import MediaSorter from "./MediaSorter";
import { ArticleBreadcrumb } from "../Breadcrumb";
import { deleteFiles, getCountFiles, getFiles } from "@/services/media.server";
import { Skeleton } from "../ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "../ui/alert-dialog";
import { AlertIcon, TrashBinIcon } from "../Icons";
import { cn } from "@/utils/classnames";
import { buttonVariants } from "@/styles/classNames";
import { sonnerToastPromise } from "@/toasters";
import { useRenderCount } from "@/utils/renderCount";

const initState: MediaStateProps = {
  ok: false,
  success: null,
  error: null,
  data: null,
};

const Media = React.memo(function () {
  const [bucket, setBucket] = React.useState("articles");
  const [folder, setFolder] = React.useState(""); // Ex.: images/
  const [images, setImages] = React.useState<SupabaseBucketImage[]>([]);
  const pageParamStr = useSearchParams().get("page");
  let currentPage = parseInt(pageParamStr || "1", 10);
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1;
  const [limit, setLimit] = React.useState<number>(16);
  const [totalImages, setTotalImages] = React.useState<number | null>(null);
  const router = useRouter();

  const totalPages = React.useMemo(
    () => (totalImages ? Math.ceil(totalImages / limit) : null),
    [totalImages, limit]
  );
  const [sortBy, setSortBy] = React.useState<{
    column: "created_at" | "updated_at";
    order: "asc" | "desc";
  }>({
    column: "created_at",
    order: "desc",
  });
  const [check, setCheck] = React.useState<{ url: string }[]>([]);

  const offset = React.useMemo(
    () => (currentPage - 1) * limit,
    [currentPage, limit]
  );

  const delCardsCallback = React.useCallback(
    async (state: MediaStateProps) => {
      try {
        const formData = new FormData();

        // TODO (SUGESTÃO???): ??? criar um botão de desfazer a exclusão do arquivo ???
        const success = (serverResponse: ArticleActionStateProps) => {
          // console.log(serverResponse); // DEBUG
          return <p>Arquivo excluído!</p>;
        };

        const error = (serverResponse: ArticleActionStateProps) => {
          // console.log(serverResponse); // DEBUG
          return <p>Arquivo não excluído</p>;
        };

        formData.set("checkBoxList", JSON.stringify(check));

        const result = deleteFiles(state, formData);

        const promise = new Promise((resolve, reject) => {
          result.then((data) => {
            if (data.ok) {
              resolve(result);
              setCheck([]);
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
    [check]
  );

  const [, delCheckedAction, isDelCheckedPending] = React.useActionState(
    delCardsCallback,
    initState
  );

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [queriedImages, totalMedia] = await Promise.all([
          getFiles({ bucket, folder, options: { limit, offset, sortBy } }),
          getCountFiles({ bucket, folder }),
        ]);
        if (!mounted) return;

        // If someone manually change to a non existent page
        const totalPages = Math.max(1, Math.ceil(totalMedia / limit));
        if (currentPage > totalPages) {
          router.replace(`?page=${totalPages}`);
          return; // Prevents loop
        }

        setImages(queriedImages);
        setTotalImages(totalMedia);
      } catch (e) {
        // console.error(e) // DEBUG
      }
    })();
    return () => {
      mounted = false;
    };
  }, [bucket, folder, limit, offset, sortBy]);

  useRenderCount("Media");

  return (
    <>
      <ArticleBreadcrumb />
      <div className="w-full h-full flex flex-col justify-center gap-4">
        <MediaHeader />
        <MediaSorter images={images} setCheck={setCheck} />
        <div className="flex items-center gap-2">
          <p className="text-neutral-500">
            {check.length} arquivo{check.length > 1 && "s"}
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={check.length === 0}
                className={cn(buttonVariants({ variant: "destructive" }))}
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
                  {check.length > 1 ? "dos arquivos" : "do arquivo"}?
                </span>
              </AlertDialogDescription>
              <AlertDialogFooter className="flex justify-between sm:justify-between bg-neutral-950">
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <form>
                  <AlertDialogAction
                    type="submit"
                    disabled={check.length === 0 || isDelCheckedPending}
                    formAction={delCheckedAction}
                  >
                    Confirmar
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <h2 className="flex gap-1 items-center text-xl font-extrabold text-neutral-300">
          Assets{" "}
          {!totalImages ? (
            <Skeleton className="inline-block size-7 rounded border border-neutral-700" />
          ) : (
            `(${totalImages})` // &#40; &#41;
          )}
        </h2>
        {images.length === 0 && (
          <div className="grid grid-cols-1 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-56 border border-neutral-700"
              />
            ))}
          </div>
        )}
        {images.length > 0 && (
          <ul className="grid grid-cols-1 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-2">
            {images.map((image) => (
              <ImagePreviewCard
                key={image.id}
                image={image}
                handleCheckbox={setCheck}
              />
            ))}
          </ul>
        )}
        {!(images.length > 0 && totalPages) && (
          <div className="mx-auto flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="size-[34px] rounded border border-neutral-700"
              />
            ))}
          </div>
        )}
        {images.length > 0 && totalPages && totalPages > 1 && (
          <MediaPagination {...{ offset, currentPage, totalPages }} />
        )}
      </div>
    </>
  );
});

export default Media;
