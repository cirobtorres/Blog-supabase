"use server";

import { revalidatePath } from "next/cache";
import { createServerAppClient } from "@/supabase/server";
import {
  getEditorFormDataValue,
  getSubtitleFormDataValue,
  getTitleFormDataValue,
} from "@/components/Fieldsets";
import { slugify } from "@/utils/strings";
import { SupabaseClient } from "@supabase/supabase-js";

// Função para upload de imagens
const uploadImagesInBody = async (
  supabase: SupabaseClient,
  slug: string,
  body: Block[]
): Promise<Block[]> => {
  return await Promise.all(
    body.map(async (block) => {
      console.log("uploadImagesInBody");
      if (block.type === "image") {
        const imageBlock = block as any;
        console.log(
          "uploadImagesInBody -> imagem",
          typeof imageBlock,
          imageBlock,
          imageBlock.data.file
        );

        if (imageBlock.file) {
          console.log("imageBlock.file");
          const fileExt = imageBlock.file.name.split(".").pop();
          const fileName = `${slug}-${Date.now()}.${fileExt}`;
          const filePath = `articles/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("articles")
            .upload(filePath, imageBlock.file);

          if (uploadError) throw new Error(uploadError.message);
          console.log("Passei de uploadError");

          const {
            data: { publicUrl },
          } = supabase.storage.from("articles").getPublicUrl(filePath);
          console.log("RETORNADO");

          return { ...imageBlock, url: publicUrl, file: undefined };
        }

        // if (imageBlock.base64) {
        //   const blob = await fetch(imageBlock.base64).then((res) => res.blob());
        //   const fileName = `${slug}-${Date.now()}.png`;
        //   const filePath = `articles/${fileName}`;

        //   const { error: uploadError } = await supabase.storage
        //     .from("articles")
        //     .upload(filePath, blob);

        //   if (uploadError) throw new Error(uploadError.message);

        //   const {
        //     data: { publicUrl },
        //   } = supabase.storage.from("articles").getPublicUrl(filePath);

        //   return { ...imageBlock, url: publicUrl, base64: undefined };
        // }
      }

      return block; // blocos que não são imagem
    })
  );
};

export const postArticle = async (
  prevState: {
    ok: boolean;
    success: string | null;
    error: string | null;
    data: Article | null;
  },
  formData: FormData
): Promise<{
  ok: boolean;
  success: string | null;
  error: string | null;
  data: Article | null;
}> => {
  const title = formData.get(getTitleFormDataValue);
  const subtitle = formData.get(getSubtitleFormDataValue);
  const body = formData.get(getEditorFormDataValue) as string; // JSON string
  const profile_id = formData.get("profile_id");

  if (!title || !body)
    return {
      ok: false,
      success: null,
      error: "O título e o corpo são obrigatórios.",
      data: null,
    };

  const supabase = await createServerAppClient();

  // Pegando o autor
  const { data: author, error: authorError } = await supabase
    .from("authors")
    .select("id")
    .eq("profile_id", profile_id)
    .single();

  if (authorError) {
    console.error(authorError.message);
    return { ok: false, success: null, error: authorError.message, data: null };
  }

  const author_id = author.id;
  const slug = slugify(title as string);
  const sub_title = subtitle === "" ? null : subtitle;

  // Transformando o JSON string em array de blocos
  let blocks: Block[];
  try {
    blocks = JSON.parse(body as string) as Block[];
  } catch (err) {
    return { ok: false, success: null, error: "Corpo inválido", data: null };
  }

  // Faz upload das imagens e atualiza o body
  const updatedBody = await uploadImagesInBody(supabase, slug, blocks);

  // Inserindo artigo no banco
  const { data: article, error: articleError } = await supabase
    .from("articles")
    .insert([{ title, slug, sub_title, body: updatedBody, author_id }])
    .select("*")
    .single();

  if (articleError) {
    console.error(articleError);
    if (articleError.code === "23505")
      return {
        ok: false,
        success: null,
        error: "Já existe um artigo com esse mesmo título",
        data: null,
      };
    return {
      ok: false,
      success: null,
      error: articleError.message,
      data: null,
    };
  }

  revalidatePath("/");
  return { ok: true, success: "Artigo publicado!", error: null, data: article };
};

// type ImageBlock = {
//   type: "image";
//   file?: File; // se você receber um File
//   base64?: string; // ou se estiver em base64
//   url?: string; // URL final
//   alt?: string;
// };

// const uploadImagesInBody = async (
//   supabase: SupabaseClient,
//   slug: string,
//   body: Block[]
// ) => {
//   const newBody = await Promise.all(
//     body.map(async (block) => {
//       if (block.type === "image") {
//         const imageBlock = block as ImageBlock;

//         if (imageBlock.file) {
//           const fileExt = imageBlock.file.name.split(".").pop();
//           const fileName = `${slug}-${Date.now()}.${fileExt}`;
//           const filePath = `articles/${fileName}`;

//           const { error: uploadError } = await supabase.storage
//             .from("articles")
//             .upload(filePath, imageBlock.file);

//           if (uploadError) throw new Error(uploadError.message);

//           const {
//             data: { publicUrl },
//           } = supabase.storage.from("articles").getPublicUrl(filePath);

//           return { ...imageBlock, url: publicUrl, file: undefined };
//         }

//         if (imageBlock.base64) {
//           const blob = await fetch(imageBlock.base64).then((res) => res.blob());
//           const fileName = `${slug}-${Date.now()}.png`;
//           const filePath = `articles/${fileName}`;

//           const { error: uploadError } = await supabase.storage
//             .from("articles")
//             .upload(filePath, blob);

//           if (uploadError) throw new Error(uploadError.message);

//           const {
//             data: { publicUrl },
//           } = supabase.storage.from("articles").getPublicUrl(filePath);

//           return { ...imageBlock, url: publicUrl, base64: undefined };
//         }
//       }

//       return block; // blocos que não são imagem
//     })
//   );

//   return newBody;
// };

// export const postArticle = async (
//   prevState: {
//     ok: boolean;
//     success: string | null;
//     error: string | null;
//     data: Article | null;
//   },
//   formData: FormData
// ): Promise<{
//   ok: boolean;
//   success: string | null;
//   error: string | null;
//   data: Article | null;
// }> => {
//   const title = formData.get(getTitleFormDataValue);
//   const subtitle = formData.get(getSubtitleFormDataValue);
//   const body = formData.get(getEditorFormDataValue);

//   const profile_id = formData.get("profile_id");

//   if (!title || !body)
//     return {
//       ok: false,
//       success: null,
//       error: "O título e o subtítulo são obrigatórios.",
//       data: null,
//     };

//   const supabase = await createServerAppClient();

//   const { data: author, error: authorError } = await supabase
//     .from("authors")
//     .select("id")
//     .eq("profile_id", profile_id)
//     .single();

//   if (authorError) {
//     console.error(authorError.message);
//     return { ok: false, success: null, error: authorError.message, data: null };
//   }

//   const author_id = author.id;

//   const slug = slugify(title as string);
//   const sub_title = subtitle === "" ? null : subtitle;

//   const { data: article, error: articleError } = await supabase
//     .from("articles")
//     .insert([{ title, slug, sub_title, body, author_id }])
//     .select("*")
//     .single();

//   if (articleError) {
//     console.error(articleError);
//     if (articleError.code === "23505")
//       return {
//         ok: false,
//         success: null,
//         error: "Já existe um artigo com esse mesmo título",
//         data: null,
//       };
//     return {
//       ok: false,
//       success: null,
//       error: articleError.message,
//       data: null,
//     };
//   }

//   revalidatePath("/");
//   return { ok: true, success: "Artigo publicado!", error: null, data: article };
// };

export const putArticle = async (
  id: string,
  prevState: {
    ok: boolean;
    success: string | null;
    error: string | null;
    data: Article | null;
  },
  formData: FormData
): Promise<{
  ok: boolean;
  success: string | null;
  error: string | null;
  data: Article | null;
}> => {
  const title = formData.get(getTitleFormDataValue);
  const subTitle = formData.get(getSubtitleFormDataValue);
  const body = formData.get(getEditorFormDataValue);
  const profile_id = formData.get("profile_id");

  if (!title || !body)
    return {
      ok: false,
      success: null,
      error: "Title and body cannot be empty.",
      data: null,
    };

  const supabase = await createServerAppClient();

  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("id, author_id")
    .eq("id", id)
    .single();

  if (articleError) {
    console.error(articleError);
    // return {
    //   ok: false,
    //   success: null,
    //   error: articleError.message,
    //   data: null,
    // };
    throw new Error("A");
  }

  if (
    !isUserArticleAuthor({
      article_id: article.id,
      profile_id: profile_id as string,
      supabase,
    })
  )
    throw new Error();

  const { data: updatedArticle, error } = await supabase
    .from("articles")
    .update({
      title,
      sub_title: subTitle === "" ? null : subTitle,
      body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", article.id)
    .select("*")
    .single();

  if (error) {
    console.error(error);
    return { ok: false, success: null, error: error.message, data: null };
  }

  revalidatePath("/");
  return {
    ok: true,
    success: "Article updated!",
    error: null,
    data: updatedArticle,
  };
};

export const putPrivateArticle = async (id: string) => {
  const supabase = await createServerAppClient();

  const { error } = await supabase.rpc("toggle_article_privacy", {
    article_id: id,
  });

  if (error) {
    console.error(error);
    return { success: null, error: error.message };
  }

  revalidatePath("/");
  return { success: "Article updated!", error: null };
};

export const deleteArticle = async (formData: FormData) => {
  const articleId = formData.get("articleId") as string;
  const inputString = formData.get("inputString") as string;
  const expectedString = formData.get("expectedString") as string;

  if (inputString !== expectedString) return { error: "Confirme o input!" };

  const supabase = await createServerAppClient();

  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", articleId);

  if (error) console.error(error);

  revalidatePath("/");

  return null;
};

const isUserArticleAuthor = async ({
  article_id,
  profile_id,
  supabase,
}: {
  article_id: string;
  profile_id: string;
  supabase: SupabaseClient;
}) => {
  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("*")
    .eq("id", article_id)
    .single();

  if (articleError) {
    console.error(articleError);
    // return {
    //   ok: false,
    //   success: null,
    //   error: articleError.message,
    //   data: null,
    // };
    throw new Error("A");
  }

  const { data: author, error: authorError } = await supabase
    .from("authors")
    .select("*")
    .eq("profile_id", profile_id)
    .single();

  if (authorError) {
    console.error(authorError);
    // return {
    //   ok: false,
    //   success: null,
    //   error: authorError.message,
    //   data: null,
    // };
    throw new Error("B");
  }

  if (article.author_id !== author.id)
    // return {
    //   ok: false,
    //   success: null,
    //   error: "Você não tem permissões para editar o artigo.",
    //   data: null,
    // };
    return false;

  return true;
};
