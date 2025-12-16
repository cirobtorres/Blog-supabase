"use server";

import { SupabaseClient } from "@supabase/supabase-js";
import { createServerAppClient } from "../supabase/server";
import { revalidatePath } from "next/cache";
import sizeOf from "buffer-image-size";

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

  const filtered = data.filter(
    // (WARN) ".emptyFolderPlaceholder" is a supabase artifact left behind after the last file of a bucket has been deleted
    // It might lead to bugs with "getImageDimensionsByString" (cards never displayed because promises keeps pending nonstop)
    (file) => file.name !== ".emptyFolderPlaceholder"
  );

  const imagesSup = await Promise.all(
    filtered.map(async (file) => {
      // URL pública
      const {
        data: { publicUrl: url },
      } = supabase.storage.from(bucket).getPublicUrl(`${folder}${file.name}`);

      // Path completo
      const fullPath =
        folder && folder.length > 0
          ? `${bucket}/${folder}${file.name}`
          : `${bucket}/${file.name}`;

      // Busca metadados
      const { data: media_metadata } = await supabase
        .from("media_metadata")
        .select("*")
        .eq("storage_path", fullPath)
        .single();

      return { ...file, url, media_metadata };
    })
  );

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

  const medias = data?.filter((f) => f.name !== ".emptyFolderPlaceholder");

  return medias.length;
}

export async function updateFile(
  prevState: MediaStateProps,
  formData: FormData
) {
  const bucket = formData.get("bucket")?.toString();
  const fileToSubmit = formData.get("fileToSubmit")?.toString();
  const filename = formData.get("filename")?.toString();
  const metadata = formData.get("media_metadata")?.toString();

  if (!fileToSubmit) {
    console.error(Array(50).join("-") + "\n", "No file to update was given");
    return {
      ok: false,
      success: null,
      error: "Error updating file. No file to update was given",
      data: null,
    };
  }

  if (!metadata) {
    console.error(Array(50).join("-") + "\n", "No file metadata was given");
    return {
      ok: false,
      success: null,
      error: "Error updating file. No file metadata was given",
      data: null,
    };
  }

  const parsedImage = JSON.parse(fileToSubmit);
  const parsedMetadata = JSON.parse(metadata);

  if (!bucket) {
    console.error(Array(50).join("-") + "\n", "Bucket not found");
    return {
      ok: false,
      success: null,
      error: "Error updating file. Bucket not found",
      data: null,
    };
  }

  const path = parsedImage.name;
  const supabase = await createServerAppClient();

  const { data: imageExist } = await supabase.storage.from(bucket).exists(path);

  const { data: imageMetadataExist } = await supabase
    .from("media_metadata")
    .select("*")
    .eq("id", parsedImage.media_metadata.id)
    .single();

  if (!imageExist) {
    console.error(Array(50).join("-") + "\n", "Image does not exist");
    return {
      ok: false,
      success: null,
      error: "Error updating file. Image does not exist",
      data: null,
    };
  }

  if (!imageMetadataExist) {
    console.error(Array(50).join("-") + "\n", "Image metadata does not exist");
    return {
      ok: false,
      success: null,
      error: "Error updating file. Image metadata does not exist",
      data: null,
    };
  }

  // [BEGIN] CODE BELOW: if filename is changed
  // Supabase does not provide an update path function built in
  // We need to copy previous file data, then delete it so we may finally insert a new file with all data that came from that previous file but now with its new filename path
  const newFilename = filename?.trim() || parsedImage.name; // If empty, keeps current pathname
  const isSameName = newFilename === parsedImage.name; // If name hasn't change, updates only the metadata

  if (!isSameName) {
    const uniqueName = await generateUniquePathName(
      supabase,
      bucket,
      newFilename
    );

    // Copy
    const { error: copyError } = await supabase.storage
      .from(bucket)
      .copy(parsedImage.name, uniqueName);

    if (copyError) {
      console.error(copyError);
      return {
        ok: false,
        success: null,
        error: "Error renaming file (copy failed)",
        data: null,
      };
    }

    // Delete
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([parsedImage.name]);

    if (deleteError) {
      console.error(deleteError);
      return {
        ok: false,
        success: null,
        error: "Error renaming file (delete failed)",
        data: null,
      };
    }

    // Update media_metadata (it is another table)
    await supabase
      .from("media_metadata")
      .update({
        storage_path: `${bucket}/${uniqueName}`,
      })
      .eq("id", parsedImage.media_metadata.id);
  }
  // [END]

  const { error: metadataError } = await supabase
    .from("media_metadata")
    .update({
      metadata: { ...imageMetadataExist.metadata, ...parsedMetadata },
      updated_at: new Date().toISOString(),
    })
    .eq("id", imageMetadataExist.id)
    .select("*")
    .single();

  if (metadataError) {
    console.error(metadataError);
    return {
      ok: false,
      success: null,
      error: "Error updating file metadata",
      data: null,
    };
  }

  await supabase.storage.from(bucket).remove([".emptyFolderPlaceholder"]); // TODO: test

  revalidatePath("/admin/media");

  return { ok: true, success: "File updated", error: null, data: null };
}

export async function deleteFiles(
  prevState: MediaStateProps,
  formData: FormData
) {
  const paths = formData.get("checkBoxPaths[]")?.toString();

  if (paths === undefined || paths === null)
    return {
      ok: false,
      success: null,
      error: `formData "checkBoxPaths[]" value is undefined`,
      data: null,
    };

  const parsedPaths = JSON.parse(paths);
  const supabase = await createServerAppClient();

  const groupedPaths: Record<string, string[]> = parsedPaths.reduce(
    (acc: Record<string, string[]>, path: string) => {
      console.log(path);
      const [bucket, ...rest] = path.split("/");
      if (!bucket || rest.length === 0) return acc;
      const name = rest.join("/"); // subfolders
      if (!acc[bucket]) acc[bucket] = [];
      acc[bucket].push(name);
      return acc;
    },
    {}
  );

  await Promise.all(
    Object.entries(groupedPaths).map(async ([bucket, paths]) => {
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove(paths);

      if (storageError) {
        console.error(storageError);
        return {
          ok: false,
          success: null,
          error: "Error deleting files",
          data: null,
        };
      }

      const { error: mediaMetadataError } = await supabase
        .from("media_metadata")
        .delete()
        .in(
          "storage_path",
          paths.map((p) => `${bucket}/${p}`)
        );

      if (mediaMetadataError) {
        console.error(mediaMetadataError);
        return {
          ok: false,
          success: null,
          error: "Error deleting metadata",
          data: null,
        };
      }

      await supabase.storage.from(bucket).remove([".emptyFolderPlaceholder"]); // TODO: test
    })
  );

  revalidatePath("/admin/media");

  return { ok: true, success: "File(s) deleted", error: null, data: null };
}

export async function deleteFile(
  prevState: MediaStateProps,
  formData: FormData
) {
  const filePath = formData.get("filePath")?.toString();

  if (filePath === undefined || filePath === null)
    return {
      ok: false,
      success: null,
      error: `formData "filePath" value is undefined`,
      data: null,
    };

  const [bucket, path] = filePath.split("/"); // filePath = bucket/path
  const supabase = await createServerAppClient();

  const { error: mediaError } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (mediaError) {
    console.error(mediaError);
    return {
      ok: false,
      success: null,
      error: "Error deleting file",
      data: null,
    };
  }

  const { error: mediaMetadataError } = await supabase
    .from("media_metadata")
    .delete()
    .eq("storage_path", filePath);

  if (mediaMetadataError) {
    console.error(mediaMetadataError);
    return {
      ok: false,
      success: null,
      error: "Error deleting media_metadata",
      data: null,
    };
  }

  revalidatePath("/admin/media");

  return { ok: true, success: "File deleted", error: null, data: null };
}

export async function postFiles(formData: FormData) {
  const files = formData.getAll("filesToSubmit") as File[];
  const supabase = await createServerAppClient();
  const bucket = "articles";
  const metadataTable = "media_metadata";

  const metadataEntries = Array.from(formData.entries())
    .filter(([key]) => key.startsWith("metadata_"))
    .map(([, value]) => JSON.parse(value as string));

  const usedNames = new Set<string>();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const meta = metadataEntries[i];
    const contentType = file.type;
    const arrayBuffer = await file.arrayBuffer();

    let originalName = meta.filename || file.name;
    let pathName = originalName;

    if (usedNames.has(pathName)) {
      const dotIndex = pathName.lastIndexOf(".");
      const baseName = dotIndex !== -1 ? pathName.slice(0, dotIndex) : pathName;
      const extension = dotIndex !== -1 ? pathName.slice(dotIndex) : "";
      let counter = 1;

      do {
        pathName = `${baseName}-copia${
          counter > 1 ? `-${counter}` : ""
        }${extension}`;
        counter++;
      } while (usedNames.has(pathName));
    }

    pathName = await generateUniquePathName(supabase, bucket, pathName);
    usedNames.add(pathName);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(pathName, arrayBuffer, { contentType });

    if (uploadError) {
      console.error("API ROUTE uploadError", uploadError);
      throw uploadError;
    }

    let width = null;
    let height = null;
    if (contentType.startsWith("image/")) {
      const size = sizeOf(Buffer.from(arrayBuffer));
      width = size.width;
      height = size.height;
    }

    const { error: metaDataError } = await supabase.from(metadataTable).insert({
      storage_path: `${bucket}/${pathName}`,
      mime_type: contentType,
      metadata: { width, height, altText: meta.altText, caption: meta.caption },
    });

    // ---------------=====ROLLBACK=====---------------
    if (metaDataError) {
      console.error("API ROUTE metaDataError");

      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([pathName]);

      if (deleteError) {
        console.error(
          "API ROUTE deleteError (rollback). Image delete failed after trying to insert metadatas:",
          deleteError
        );
      }

      throw metaDataError;
    }
  }

  revalidatePath("/admin/media");

  return { ok: true, success: "File(s) uploaded", error: null, data: null };
}

// HELPERS
async function generateUniquePathName(
  supabase: SupabaseClient,
  bucket: string,
  originalName: string
) {
  // Rename to filename + "-copia", "-copia-2", "-copia-3", ...
  // Ex.: filename turns into filename-copia
  // Ex.: filename-copia turns into filename-copia-2
  // Ex.: ...
  const dotIndex = originalName.lastIndexOf(".");
  const baseName =
    dotIndex !== -1 ? originalName.slice(0, dotIndex) : originalName;
  const extension = dotIndex !== -1 ? originalName.slice(dotIndex) : "";

  let candidate = originalName;
  let counter = 1;

  // Checks if exists
  while (true) {
    const { data, error } = await supabase.storage.from(bucket).list("", {
      search: candidate,
    });

    if (error) throw error;

    const exists = data?.some((item) => item.name === candidate);
    if (!exists) break;

    candidate = `${baseName}-copia${
      counter > 1 ? `-${counter}` : ""
    }${extension}`;
    counter++;
  }

  return candidate;
}
