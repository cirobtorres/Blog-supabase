import {
  ImageEditorButton,
  ImageEditorButtonLi,
} from "../../../../../components/Editors/ImageEditor";
import { DownloadIcon } from "../../../../../components/Icons";

export default function AlertDialogDownloadMedia({
  media,
}: {
  media: SupabaseBucketMedia;
}) {
  const handleDownload = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      const response = await fetch(media.url);
      if (!response.ok)
        throw new Error("Error when trying to download media file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = media.name;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ImageEditorButtonLi tooltip="Baixar">
      <ImageEditorButton className="size-8" onClick={handleDownload}>
        <DownloadIcon className="size-4" />
      </ImageEditorButton>
    </ImageEditorButtonLi>
  );
}
