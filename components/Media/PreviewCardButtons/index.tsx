"use client";

import { ImageEditorButtonList } from "../../../components/Editors/ImageEditor";
import AlertDialogEditMedia from "./AlertDialogEditMedia";
import AlertDialogDeleteMedia from "./AlertDialogDeleteMedia";

export default function PreviewCardButtons({
  data,
}: {
  data: SupabaseBucketMedia;
}) {
  return (
    <ImageEditorButtonList className="[&_button]:size-8 transition-opacity duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 backdrop-blur bg-neutral-950/50">
      <AlertDialogEditMedia media={data} />
      <AlertDialogDeleteMedia media={data} />
    </ImageEditorButtonList>
  );
}
