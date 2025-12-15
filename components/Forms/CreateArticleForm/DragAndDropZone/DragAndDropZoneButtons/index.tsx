import {
  ImageEditorButton,
  ImageEditorButtonLi,
  ImageEditorButtonList,
} from "../../../../../components/Editors/ImageEditor";
import AlertDialogEditMedia from "../../../../Media/PreviewCardButtons/AlertDialogEditMedia";
import { DownloadIcon, TrashBinIcon } from "../../../../../components/Icons";

export default function DragAndDropZoneButtons({
  media,
  exclude,
}: {
  media: SupabaseBucketMedia | null;
  exclude: () => void;
}) {
  return (
    <ImageEditorButtonList>
      <ImageEditorButtonLi tooltip="Excluir">
        <ImageEditorButton
          className="size-9"
          onClick={(e) => {
            e.stopPropagation();
            exclude();
          }}
        >
          <TrashBinIcon className="size-4" />
        </ImageEditorButton>
      </ImageEditorButtonLi>
      {media && <AlertDialogEditMedia media={media} />}
      <ImageEditorButtonLi tooltip="Download">
        <ImageEditorButton
          className="size-9"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DownloadIcon className="size-4" />
        </ImageEditorButton>
      </ImageEditorButtonLi>
    </ImageEditorButtonList>
  );
}
