import { createServerAppClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import sizeOf from "buffer-image-size"; // TODO: untested

export const runtime = "nodejs"; // FormData + File

// Rename to filename + "-copia", "-copia-2", ...
// Ex.: filename turns into filename-copia
// Ex.: filename-copia turns into filename-copia-2
async function generateUniquePathName(
  supabase: SupabaseClient,
  bucket: string,
  originalName: string
) {
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

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("filesToSubmit") as File[];
  const supabase = await createServerAppClient();
  const bucket = "articles";
  const metadataTable = "media_metadata";

  const metadataEntries = Array.from(formData.entries())
    .filter(([key]) => key.startsWith("metadata_"))
    .map(([, value]) => JSON.parse(value as string));

  const usedNames = new Set<string>();

  console.log(files);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const meta = metadataEntries[i];
    const contentType = file.type;
    const arrayBuffer = await file.arrayBuffer();

    // ---------------===========---------------
    let originalName = meta.filename || file.name;
    let pathName = originalName;

    console.log("1.1 ---");
    console.log(pathName, usedNames.has(pathName));

    if (usedNames.has(pathName)) {
      const dotIndex = pathName.lastIndexOf(".");
      const baseName = dotIndex !== -1 ? pathName.slice(0, dotIndex) : pathName;
      const extension = dotIndex !== -1 ? pathName.slice(dotIndex) : "";
      let counter = 1;

      console.log("1.2 ---");
      console.log(pathName);

      do {
        pathName = `${baseName}-copia${
          counter > 1 ? `-${counter}` : ""
        }${extension}`;
        counter++;
      } while (usedNames.has(pathName));
    }

    console.log("1.3 ---");
    console.log(pathName);

    console.log("Antes do generateUniquePathName:", pathName);
    pathName = await generateUniquePathName(supabase, bucket, pathName);
    console.log("Depois do generateUniquePathName:", pathName);
    usedNames.add(pathName);
    console.log("usedNames:", [...usedNames]);

    console.log("2. ---");

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(pathName, arrayBuffer, { contentType });

    if (uploadError) {
      console.error("API ROUTE uploadError", uploadError);
      throw uploadError;
    }

    console.log("3. ---");

    // ---------------===========---------------
    let width = null;
    let height = null;
    if (contentType.startsWith("image/")) {
      const size = sizeOf(Buffer.from(arrayBuffer)); // TODO: untested
      width = size.width;
      height = size.height;
    }

    console.log("4. ---");

    // ---------------===========---------------
    const { error: metaDataError } = await supabase.from(metadataTable).insert({
      storage_path: `${bucket}/${pathName}`,
      caption: meta.caption,
      mime_type: contentType,
      metadata: { width, height, altText: meta.altText },
    });

    console.log("5. ---");
    console.log(pathName);

    // ---------------===========---------------
    // Manual Rollback if media_metadata insert is failed
    if (metaDataError) {
      console.log("6. ---");
      console.error("API ROUTE metaDataError");

      // Try to delete image from storage
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([pathName]);

      if (deleteError) {
        console.log("7. ---");
        console.error(
          "API ROUTE deleteError (rollback). Image delete failed after trying to insert metadatas:",
          deleteError
        );
      }

      throw metaDataError;
    }

    console.log("8. ---");
  }

  revalidatePath("/admin/media");
  return NextResponse.json({ ok: true });
}
