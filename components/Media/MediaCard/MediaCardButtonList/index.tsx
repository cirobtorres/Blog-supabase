"use client";

import { ImageEditorButtonList } from "../../../Editors/ImageEditor";
import AlertDialogEditMedia from "./AlertDialogEditMedia";
import AlertDialogDeleteMedia from "./AlertDialogDeleteMedia";
import AlertDialogDownloadMedia from "./AlertDialogDownloadMedia";

export default function MediaCardButtonList({
  data,
}: {
  data: SupabaseBucketMedia;
}) {
  return (
    <ImageEditorButtonList className="[&_button]:size-8 transition-opacity duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 backdrop-blur bg-neutral-950/50">
      <AlertDialogEditMedia media={data} />
      <AlertDialogDownloadMedia />
      <AlertDialogDeleteMedia media={data} />
    </ImageEditorButtonList>
  );
}
