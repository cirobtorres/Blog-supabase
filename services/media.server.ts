"use server";

import { createServerAppClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

export async function getFiles({
  bucket,
  folder,
  options,
}: {
  bucket: string;
  folder?: string;
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: {
      column: string;
      order: string;
    };
  };
}) {
  const supabase = await createServerAppClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, options);

  if (error) {
    console.error(error);
    return [];
  }

  const imagesSup: SupabaseBucketImage[] = data
    // TODO: (WARN) ".emptyFolderPlaceholder" is a supabase artifact left behind after the last file of a bucket has been deleted
    // It might lead to bugs with "getImageDimensionsByString" (cards never displayed because promises keeps pending nonstop)
    .filter((file) => file.name !== ".emptyFolderPlaceholder")
    .map((file) => {
      const {
        data: { publicUrl: url },
      } = supabase.storage.from(bucket).getPublicUrl(`${folder}${file.name}`);
      return { ...file, url };
    });

  return imagesSup;
}

export async function getCountFiles({
  bucket,
  folder,
}: {
  bucket: string;
  folder?: string;
}) {
  const supabase = await createServerAppClient();

  const { data, error } = await supabase.storage.from(bucket).list(folder);

  if (error) {
    console.error(error);
    return 0;
  }

  return data.length;
}

export async function deleteFiles(
  prevState: MediaStateProps,
  formData: FormData
) {
  const stringOfUrlObjects = formData.get("checkBoxList")?.toString();

  if (stringOfUrlObjects === undefined || stringOfUrlObjects === null)
    return {
      ok: false,
      success: null,
      error: `formData "checkBoxList" value is undefined`,
      data: null,
    };

  const arrayOfUrlObjects = JSON.parse(stringOfUrlObjects);
  const bucket = "articles";

  const arrayOfUrls = arrayOfUrlObjects.map((obj: ImageStateProps) => {
    const path = obj.url.split(`${bucket}/`)[1];
    return path;
  });

  const supabase = await createServerAppClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .remove(arrayOfUrls);

  if (error) {
    console.error(error);
    return {
      ok: false,
      success: null,
      error: "Error deleting files",
      data: null,
    };
  }

  revalidatePath("/");

  return { ok: true, success: "File(s) deleted", error: null, data: null };
}

export async function deleteFile(
  prevState: MediaStateProps,
  formData: FormData
) {
  const fileURL = formData.get("fileURL")?.toString();
  console.log(fileURL);

  if (fileURL === undefined || fileURL === null)
    return {
      ok: false,
      success: null,
      error: `formData "fileURL" value is undefined`,
      data: null,
    };

  const bucket = "articles";
  const path = fileURL.split(`${bucket}/`)[1];

  const supabase = await createServerAppClient();

  const { data, error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error(error);
    return {
      ok: false,
      success: null,
      error: "Error deleting file",
      data: null,
    };
  }

  revalidatePath("/");

  return { ok: true, success: "File deleted", error: null, data: null };
}
