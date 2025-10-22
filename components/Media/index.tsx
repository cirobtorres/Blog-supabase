"use client";

import { useState } from "react";
import MediaHeader from "./MediaHeader";
import MediaList from "./MediaList";
import MediaPagination from "./MediaPagination";
import MediaSorter from "./MediaSorter";
import { ImageProvider } from "@/providers/ImageProvider";

// TODO: corrigir pagination
export default function Media({ images }: { images: SupabaseBucketImage[] }) {
  const [check, setCheck] = useState<{ url: string }[]>([]);

  // const { images: providerImages } = useImage();

  return (
    <ImageProvider>
      <div className="w-full h-full flex flex-col justify-center gap-4">
        <MediaHeader />
        <MediaSorter images={images} setCheckedCards={setCheck} />
        <MediaList
          images={images}
          checkedCards={check}
          setCheckedCards={setCheck}
        />
        <MediaPagination />
      </div>
    </ImageProvider>
  );
}
