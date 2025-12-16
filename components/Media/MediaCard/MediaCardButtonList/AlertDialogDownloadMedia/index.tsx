import {
  ImageEditorButton,
  ImageEditorButtonLi,
} from "../../../../../components/Editors/ImageEditor";
import { DownloadIcon } from "../../../../../components/Icons";

export default function AlertDialogDownloadMedia() {
  return (
    <ImageEditorButtonLi tooltip="Baixar">
      <ImageEditorButton className="size-8">
        <DownloadIcon className="size-4" />
      </ImageEditorButton>
    </ImageEditorButtonLi>
  );
}
