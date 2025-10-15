"use client";

import { getImageDimensionsByString } from "@/components/Fieldsets/ArticleEditor";
import { getFiles } from "@/services/media";
import React, { useCallback, useEffect, useState } from "react";

type ImageProviderProps = {
  images: ImageStateProps[];
  loading: boolean;
  removeFromCards: (urlsToRemove: { url: string }[]) => void;
};

export const ImageContext = React.createContext<ImageProviderProps>({
  images: [],
  loading: false,
  removeFromCards: () => [],
});

const useAsync = (
  func: (...args: any[]) => Promise<ImageStateProps[]>,
  dependencies: any[] = []
) => {
  const { execute, ...state } = useAsyncFn(func, dependencies, true);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
};

const useAsyncFn = (
  func: (...args: any[]) => Promise<ImageStateProps[]>,
  dependencies: any[] = [],
  initialLoading: boolean = false
) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<ImageStateProps[]>([]);

  const execute = useCallback(async (...params: any[]) => {
    try {
      setLoading(true);
      const data = await func(...params);
      setValue(data);
      setError(null);
    } catch (err) {
      setValue([]);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { loading, error, execute };
};

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [bucket, setBucket] = useState("articles");
  const [folder, setFolder] = useState(""); // Ex.: images/
  const [currPage, setCurrPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const offset = (currPage - 1) * limit;
  const sortBy = {
    column: "created_at",
    order: "asc",
  };

  const [images, setImages] = useState<ImageStateProps[]>([]);
  const { loading } = useAsync(async () => {
    const imagesFromServer: SupabaseBucketImage[] = await getFiles({
      bucket,
      folder,
      options: { limit, offset, sortBy },
    });

    const newArr: ImageStateProps[] = await Promise.all(
      imagesFromServer.map(async (image) => {
        const { width, height } = await getImageDimensionsByString(image.url);
        return { ...image, width, height };
      })
    );

    setImages(newArr);

    return newArr;
  }, [currPage]);

  const removeFromCards = (urls: { url: string }[]) => {
    setImages((prev) =>
      prev.filter((image) => !urls.some((u) => u.url === image.url))
    );
  };

  return (
    <ImageContext.Provider value={{ images, loading, removeFromCards }}>
      {children}
    </ImageContext.Provider>
  );
}
