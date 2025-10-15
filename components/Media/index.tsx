"use client";

import MediaHeader from "./MediaHeader";
import MediaList from "./MediaList";
import MediaSorter from "./MediaSorter";
import { useImage } from "../../hooks/useImage";

export default function Media() {
  const { images } = useImage();

  return (
    <div className="w-full flex flex-col justify-center gap-4">
      <MediaHeader />
      <MediaSorter />
      <MediaList images={images} />
    </div>
  );
}
