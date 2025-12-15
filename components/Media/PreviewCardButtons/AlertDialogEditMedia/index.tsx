import {
  ImageDataInfo,
  ImageEditorButton,
  ImageEditorButtonLi,
  ImageEditorButtonList,
} from "../../../Editors/ImageEditor";
import {
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
} from "../../../Fieldsets";
import { HazardBorder } from "../../../HazardBorder";
import {
  DownloadIcon,
  LinkIcon,
  PencilIcon,
  TrashBinIcon,
  UploadIcon,
} from "../../../Icons";
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
} from "../../../ui/alert-dialog";
import { updateFile } from "../../../../services/media.server";
import {
  buttonVariants,
  focusVisibleWhiteRing,
} from "../../../../styles/classNames";
import { sonnerToastPromise } from "../../../../toasters";
import { cn } from "../../../../utils/classnames";
import NextImage from "next/image";
import { useActionState, useState } from "react";

const initState: MediaStateProps = {
  ok: false,
  success: null,
  error: null,
  data: null,
};

export default function AlertDialogEditMedia({
  media,
}: {
  media: SupabaseBucketMedia;
}) {
  const [filename, setFilename] = useState(media.name);
  const [altText, setAltText] = useState(
    media.media_metadata.metadata.altText ?? media.name
  );
  const [caption, setCaption] = useState(
    media.media_metadata.metadata.caption ?? ""
  );
  const [openEdit, setOpenEdit] = useState(false);

  const [, action] = useActionState(async (state) => {
    try {
      const formData = new FormData();

      formData.set("bucket", "articles"); // TODO
      formData.append("fileToSubmit", JSON.stringify(media));
      formData.append("filename", filename);
      formData.append(
        "media_metadata",
        JSON.stringify({
          caption: caption,
          altText: altText,
        })
      );

      // const success = (serverResponse: ArticleActionStateProps) => {
      const success = () => {
        return <p>Arquivo editado!</p>;
      };

      // const error = (serverResponse: ArticleActionStateProps) => {
      const error = () => {
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

  //   useRenderCount("AlertDialogContentEditMedia"); // DEBUG

  return (
    <AlertDialog open={openEdit} onOpenChange={setOpenEdit}>
      <ImageEditorButtonLi tooltip="Editar">
        <AlertDialogTrigger asChild>
          <ImageEditorButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpenEdit(true);
            }}
            className={cn("size-9", focusVisibleWhiteRing)}
          >
            <PencilIcon className="size-4" />
          </ImageEditorButton>
        </AlertDialogTrigger>
      </ImageEditorButtonLi>
      <AlertDialogContent className="sm:max-w-sm lg:max-w-3xl overflow-hidden">
        <AlertDialogTitle className="flex justify-between items-center px-3 border-b border-neutral-700 bg-neutral-950">
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
            media,
          }}
        />
        <AlertDialogFooter className="flex flex-row sm:flex-row justify-between items-center p-2 border-t border-neutral-700 bg-neutral-950">
          <AlertDialogCancel className="text-xs sm:text-sm p-2">
            Cancelar
          </AlertDialogCancel>
          <form className="flex-1 flex gap-2 justify-end">
            {/* <AlertDialogAction
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Trocar arquivo
            </AlertDialogAction> */}
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
    </AlertDialog>
  );
}

const AlertDialogContentMediaBody = ({
  filename,
  alt,
  caption,
  setFilename,
  setAlt,
  setCaption,
  media,
}: {
  filename: string;
  alt: string;
  caption: string;
  setFilename: (value: string) => void;
  setAlt: (value: string) => void;
  setCaption: (value: string) => void;
  media: SupabaseBucketMedia;
}) => {
  // useRenderCount("AlertDialogContentMediaBody"); // DEBUG

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-3">
      <AlertDialogDescription className="sr-only">
        Trocar Media
      </AlertDialogDescription>
      <div className="w-full h-56 min-w-0 overflow-hidden rounded border border-neutral-700">
        <div className="relative w-full h-full flex justify-center items-center">
          <HazardBorder />
          <NextImage
            src={media.url}
            alt={media.name}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="absolute object-contain"
          />
          <ImageEditorButtonList className="backdrop-blur bg-neutral-950/50">
            <ImageEditorButtonLi tooltip="Excluir">
              <ImageEditorButton className="size-8">
                <TrashBinIcon className="size-4" />
              </ImageEditorButton>
            </ImageEditorButtonLi>
            {/* <ImageEditorButtonLi tooltip="Copiar link">
              <ImageEditorButton className="size-8">
                <LinkIcon className="size-4" />
              </ImageEditorButton>
            </ImageEditorButtonLi> */}
            <ImageEditorButtonLi tooltip="Baixar">
              <ImageEditorButton className="size-8">
                <DownloadIcon className="size-4" />
              </ImageEditorButton>
            </ImageEditorButtonLi>
            {/* <ImageEditorButtonLi tooltip="Enviar">
              <ImageEditorButton className="size-8">
                <UploadIcon className="size-4" />
              </ImageEditorButton>
            </ImageEditorButtonLi> */}
          </ImageEditorButtonList>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <ImageDataInfo
          imageData={{
            preview: null,
            filename: media.name,
            height: media.media_metadata.metadata.height ?? null,
            width: media.media_metadata.metadata.width ?? null,
            type: media.metadata.mimetype.replace("image/", ""),
            date: media.updated_at,
            size: media.metadata.size,
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
