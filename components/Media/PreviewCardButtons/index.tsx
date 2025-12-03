"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { HazardBorder } from "../../../components/HazardBorder";
import {
  ImageDataInfo,
  ImageEditorButton,
  ImageEditorButtonLi,
  ImageEditorButtonList,
} from "../../../components/Editors/ImageEditor";
import {
  AlertIcon,
  DownloadIcon,
  LinkIcon,
  PencilIcon,
  TrashBinIcon,
  UploadIcon,
} from "../../../components/Icons";
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
} from "../../../components/ui/alert-dialog";
import { deleteFile, updateFile } from "../../../services/media.server";
import { sonnerToastPromise } from "../../../toasters";
import { cn } from "../../../utils/classnames";
import {
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
} from "../../../components/Fieldsets";
import {
  buttonVariants,
  focusVisibleWhiteRing,
} from "../../../styles/classNames";

const initState: MediaStateProps = {
  ok: false,
  success: null,
  error: null,
  data: null,
};

export default function PreviewCardButtons({
  data,
}: {
  data: SupabaseBucketMedia;
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [, delAction, isDelPending] = useActionState(
    async (state: MediaStateProps) => {
      try {
        const formData = new FormData();
        const url = data.url;
        formData.set("fileURL", url);

        const result = deleteFile(state, formData);

        const success = (serverResponse: ArticleActionStateProps) => {
          return <p>Arquivo excluído!</p>;
        };

        const error = (serverResponse: ArticleActionStateProps) => {
          return <p>Arquivo não excluído</p>;
        };

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

  return (
    <ImageEditorButtonList className="transition-opacity duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100">
      <AlertDialog open={openEdit} onOpenChange={setOpenEdit}>
        <ImageEditorButtonLi tooltip="Editar">
          <AlertDialogTrigger asChild>
            <ImageEditorButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenEdit(true);
              }}
              className={cn("size-8", focusVisibleWhiteRing)}
            >
              <PencilIcon className="size-7 p-1.5 stroke-neutral-500" />
            </ImageEditorButton>
          </AlertDialogTrigger>
        </ImageEditorButtonLi>
        {/* -------------------------------------------------------------------------------- */}
        <EditMediaContent data={data} />
        {/* -------------------------------------------------------------------------------- */}
      </AlertDialog>
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <ImageEditorButtonLi tooltip="Excluir">
          <AlertDialogTrigger asChild>
            <ImageEditorButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenDelete(true);
              }}
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
}

const EditMediaContent = ({ data }: { data: SupabaseBucketMedia }) => {
  const [filename, setFilename] = useState(data.name);
  const [altText, setAltText] = useState(
    data.media_metadata.metadata.altText ?? data.name
  );
  const [caption, setCaption] = useState(
    data.media_metadata.metadata.caption ?? ""
  );

  const [, action] = useActionState(async (state) => {
    try {
      const formData = new FormData();

      formData.set("bucket", "articles"); // TODO
      formData.append("fileToSubmit", JSON.stringify(data));
      formData.append("filename", filename);
      formData.append(
        "media_metadata",
        JSON.stringify({
          caption: caption,
          altText: altText,
        })
      );

      const success = (serverResponse: ArticleActionStateProps) => {
        return <p>Arquivo editado!</p>;
      };

      const error = (serverResponse: ArticleActionStateProps) => {
        return <p>Arquivo não editado</p>;
      };

      const result = updateFile(state, formData);

      const promise = new Promise((resolve, reject) => {
        result.then((data) => {
          if (data.ok) {
            resolve(result);
          } else {
            reject(result);
          }
        });
      });

      sonnerToastPromise(promise, success, error, "Editando arquivo...");

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
  }, initState);

  return (
    <AlertDialogContent className="sm:max-w-sm lg:max-w-3xl overflow-hidden">
      <AlertDialogTitle className="flex justify-between items-center px-3 border-b border-neutral-800 bg-neutral-950">
        Detalhes
        <AlertDialogCancelIcon />
      </AlertDialogTitle>
      <AlertDialogContentMediaBody
        {...{
          filename,
          alt: altText,
          caption,
          setFilename,
          setAlt: setAltText,
          setCaption,
          data,
        }}
      />
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
            type="submit"
            className={cn(buttonVariants({ variant: "default" }))}
            formAction={action}
          >
            Salvar
          </AlertDialogAction>
        </form>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

const AlertDialogContentMediaBody = ({
  filename,
  alt,
  caption,
  setFilename,
  setAlt,
  setCaption,
  data,
}: {
  filename: string;
  alt: string;
  caption: string;
  setFilename: (value: string) => void;
  setAlt: (value: string) => void;
  setCaption: (value: string) => void;
  data: SupabaseBucketMedia;
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-3">
      <AlertDialogDescription className="sr-only">
        Trocar Media
      </AlertDialogDescription>
      <div className="w-full h-56 min-w-0 overflow-hidden rounded border border-neutral-700">
        <div className="relative w-full h-full flex justify-center items-center">
          <HazardBorder />
          <Image
            src={data.url}
            alt={data.name}
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
            filename: data.name,
            height: data.media_metadata.metadata.height ?? null,
            width: data.media_metadata.metadata.width ?? null,
            type: data.metadata.mimetype.replace("image/", ""),
            date: data.updated_at,
            size: data.metadata.size,
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
