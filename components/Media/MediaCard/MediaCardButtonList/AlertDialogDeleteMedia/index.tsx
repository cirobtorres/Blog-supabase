import { useActionState, useState } from "react";
import {
  ImageEditorButton,
  ImageEditorButtonLi,
} from "../../../../Editors/ImageEditor";
import { AlertIcon, TrashBinIcon } from "../../../../Icons";
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
} from "../../../../ui/alert-dialog";
import { deleteFile } from "../../../../../services/media.server";
import { focusVisibleWhiteRing } from "../../../../../styles/classNames";
import { sonnerToastPromise } from "../../../../../toasters";
import { cn } from "../../../../../utils/classnames";

const initState: MediaStateProps = {
  ok: false,
  success: null,
  error: null,
  data: null,
};

export default function AlertDialogDeleteMedia({
  media,
}: {
  media: SupabaseBucketMedia;
}) {
  const [openDelete, setOpenDelete] = useState(false);

  const [, delAction, isDelPending] = useActionState(
    async (state: MediaStateProps) => {
      try {
        const formData = new FormData();
        const path = media.media_metadata.storage_path;
        formData.set("filePath", path);

        const success = () => {
          return <p>Arquivo excluído!</p>;
        };

        const error = () => {
          return <p>Arquivo não excluído</p>;
        };

        const result = deleteFile(state, formData);

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
    <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
      <ImageEditorButtonLi tooltip="Excluir">
        <AlertDialogTrigger asChild>
          <ImageEditorButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpenDelete(true);
            }}
            className={cn("size-9", focusVisibleWhiteRing)}
          >
            <TrashBinIcon className="size-4" />
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
            <AlertIcon className="stroke-orange-700" />{" "}
            <span className="text-orange-700 font-medium">
              Tem certeza que deseja excluir o arquivo?
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
  );
}
