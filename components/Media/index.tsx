"use client";

import { startTransition, useActionState, useState } from "react";
import { Checkbox as ShadcnUICheckbox } from "../ui/checkbox";
import MediaCard from "./MediaCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AlertIcon, FiltersIcon } from "../Icons";
import { cn } from "../../utils/classnames";
import { buttonVariants, focusVisibleWhiteRing } from "../../styles/classNames";
import AddFolder from "./AddFolder";
import AddMedia from "./AddMedia";
import { deleteFiles } from "../../services/media.server";
import { sonnerToastPromise } from "../../toasters";
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
import { LoadingSpinning } from "../LoadingSpinning";

const initState: MediaStateProps = {
  ok: false,
  success: null,
  error: null,
  data: null,
};

export default function Media({
  medias,
  totalFiles,
}: {
  medias: SupabaseBucketMedia[];
  totalFiles: number;
}) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOnCheck = (itemPath: string, checked: boolean) => {
    setCheckedIds((prev) => {
      if (checked) {
        if (prev.includes(itemPath)) return prev; // Prevents duplicates
        return [...prev, itemPath];
      }

      return prev.filter((storedPath) => storedPath !== itemPath);
    });
  };

  const handleCheckAll = (checked: boolean) => {
    setCheckedIds(
      checked ? medias.map((m) => m.media_metadata.storage_path) : []
    );
  };

  const [, delAction, isDelPending] = useActionState(
    async (state: MediaStateProps) => {
      try {
        const formData = new FormData();
        const filePaths = JSON.stringify(checkedIds);
        formData.set("checkBoxPaths[]", filePaths);

        const success = () => {
          return <p>Arquivo excluído!</p>;
        };

        const error = () => {
          return <p>Arquivo não excluído</p>;
        };

        const result = deleteFiles(state, formData);

        const promise = new Promise((resolve, reject) => {
          result.then((data) => {
            if (data.ok) {
              resolve(result);
              setOpenDialog(false);
              setCheckedIds([]);
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
    <>
      <div className="flex flex-col md:flex-row md:justify-between">
        <h1 className="text-5xl font-extrabold text-neutral-300 mb-8 md:mb-0">
          Bucket
        </h1>
        <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-1">
          <AddFolder />
          <AddMedia />
        </div>
      </div>
      <div className="flex flex-col gap-2 my-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <fieldset className="size-6">
              <label
                htmlFor="all-checkboxList[]"
                className="cursor-pointer size-6"
              >
                <ShadcnUICheckbox
                  id="all-checkboxList[]"
                  name="all-checkboxList[]"
                  value="all-checkboxList[]"
                  className="cursor-pointer"
                  onCheckedChange={handleCheckAll}
                />
                <p className="sr-only">Selecionar todas as imagens</p>
              </label>
            </fieldset>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder="Exemplo" // TODO
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Um Label {/*TODO*/}</SelectLabel>
                  <SelectItem value="exemplo">Exemplo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger>
                <FiltersIcon className="transition-color duration-300 stroke-neutral-500 group-focus-within:stroke-neutral-100" />
                Filtros
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-96 flex flex-col gap-2 p-3 bg-neutral-900 border border-neutral-700"
              >
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="Exemplo" // TODO
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Um Label {/*TODO*/}</SelectLabel>
                      <SelectItem value="exemplo">Exemplo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="Exemplo" // TODO
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Um Label {/*TODO*/}</SelectLabel>
                      <SelectItem value="exemplo">Exemplo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="Exemplo" // TODO
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Um Label {/*TODO*/}</SelectLabel>
                      <SelectItem value="exemplo">Exemplo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <button
                  className={cn(
                    "cursor-pointer py-2 px-3 text-sm rounded-xs text-theme-color font-medium w-full border border-neutral-700 bg-neutral-900 transition-shadow duration-300 focus-visible:text-theme-color",
                    focusVisibleWhiteRing
                  )}
                >
                  Aplicar filtros
                </button>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-xs size-8 border border-neutral-800 bg-neutral-900"></div>
            <div className="rounded-xs size-8 border border-neutral-800 bg-neutral-900"></div>
            <div className="rounded-xs size-8 border border-neutral-800 bg-neutral-900"></div>
          </div>
        </div>
        <div className="h-10 flex items-center gap-4">
          <p className="text-neutral-500">
            {checkedIds.length} arquivo{checkedIds.length > 1 && "s"}
          </p>
          {checkedIds.length > 0 && (
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
              <AlertDialogTrigger
                disabled={checkedIds.length === 0 || isDelPending}
                className={cn(buttonVariants({ variant: "destructive" }))}
              >
                Excluir
              </AlertDialogTrigger>
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
                    <AlertIcon className="stroke-orange-700" />{" "}
                    <span className="text-orange-700 font-medium">
                      Tem certeza que deseja excluir o
                      {checkedIds.length > 1 && "s"} arquivo
                      {checkedIds.length > 1 && "s"}?
                    </span>
                  </p>
                </div>
                <AlertDialogFooter className="flex flex-row sm:flex-row justify-between sm:justify-between items-center p-2 bg-neutral-950">
                  <AlertDialogCancel className="text-xs sm:text-sm p-2">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    type="button"
                    disabled={isDelPending}
                    onClick={(e) => {
                      e.preventDefault();
                      startTransition(() => {
                        delAction();
                      });
                    }}
                  >
                    Confirmar {isDelPending && <LoadingSpinning />}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <h2 className="flex gap-1 items-center text-xl font-extrabold text-neutral-300">
          Assets {totalFiles}
        </h2>
      </div>
      {medias.length > 0 && (
        <ul className="grid grid-cols-1 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-2">
          {medias.map((media) => (
            <MediaCard
              key={media.id}
              data={media}
              isChecked={checkedIds.includes(media.media_metadata.storage_path)}
              onCheck={(checked: boolean) =>
                handleOnCheck(media.media_metadata.storage_path, checked)
              }
            />
          ))}
        </ul>
      )}
      {medias.length === 0 && (
        <p className="text-neutral-500">Nenhuma imagem ainda</p>
      )}
    </>
  );
}
