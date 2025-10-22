import { createServerAppClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import sizeOf from "buffer-image-size"; // TODO: untested

export const runtime = "nodejs"; // FormData + File

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("filesToSubmit") as File[];
  const supabase = await createServerAppClient();
  const bucket = "articles";
  const metadataTable = "media_metadata";

  const metadataEntries = Array.from(formData.entries())
    .filter(([key]) => key.startsWith("metadata_"))
    .map(([, value]) => JSON.parse(value as string));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const meta = metadataEntries[i];

    const pathName = meta.filename || file.name;
    const contentType = file.type;
    const arrayBuffer = await file.arrayBuffer();

    // ---------------===========---------------
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(pathName, arrayBuffer, { contentType });

    if (uploadError) {
      console.error(uploadError);
      throw uploadError;
    }

    // ---------------===========---------------
    let width = null;
    let height = null;
    if (contentType.startsWith("image/")) {
      const size = sizeOf(Buffer.from(arrayBuffer)); // TODO: untested
      width = size.width;
      height = size.height;
    }

    // ---------------===========---------------
    const { error: metaDataError } = await supabase.from(metadataTable).insert({
      storage_path: `${bucket}/${pathName}`,
      caption: meta.caption,
      mime_type: contentType,
      metadata: { width, height, altText: meta.altText },
    });

    // ---------------===========---------------
    // Manual Rollback if media_metadata insert is failed
    if (metaDataError) {
      console.error(metaDataError);

      // Try to delete image from storage
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([pathName]);

      if (deleteError) {
        console.error(
          "Rollback error. Image delete failed after trying to insert metadatas:",
          deleteError
        );
      }

      throw metaDataError;
    }
  }

  revalidatePath("/admin/media");
  return NextResponse.json({ ok: true });
}
