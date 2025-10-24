"use server";

import { revalidatePath } from "next/cache";
import { createServerAppClient } from "@/supabase/server";
import { slugify } from "@/utils/strings";
import { SupabaseClient } from "@supabase/supabase-js";

export const postArticlePublic = async (
  prevState: ArticleActionStateProps,
  formData: FormData
): Promise<ArticleActionStateProps> => {
  const profile_id = formData.get("profile_id");
  const title = formData.get("article_title");
  const subtitle = formData.get("article_subtitle");
  const body = formData.get("article_body") as string; // JSON string

  if (!title || !body) {
    return {
      ok: false,
      success: null,
      error: "O título e o corpo são obrigatórios.",
      data: null,
    };
  }

  const supabase = await createServerAppClient();

  const { data: author, error: authorError } = await supabase
    .from("authors")
    .select("id")
    .eq("profile_id", profile_id)
    .single();

  if (authorError) {
    console.error(authorError.message);
    return {
      ok: false,
      success: null,
      error: `"profile_id" de "authors" não encontrado.`,
      data: null,
    };
  }

  const author_id = author.id;
  const slug = slugify(title as string);
  const sub_title = subtitle === "" ? null : subtitle;

  const { data: article, error: articleError } = await supabase
    .from("articles")
    .insert([{ title, slug, sub_title, body, author_id }])
    .select("*")
    .single();

  if (articleError) {
    console.error(articleError);
    if (articleError.code === "23505")
      return {
        ok: false,
        success: null,
        error: `Um "articles" com este mesmo "title"/"slug" já existe.`,
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

export const postArticleSave = async (
  prevState: ArticleActionStateProps,
  formData: FormData
): Promise<ArticleActionStateProps> => {
  const profile_id = formData.get("profile_id");
  const title = formData.get("article_title");
  const subtitle = formData.get("article_subtitle");
  const body = formData.get("article_body") as string;

  // TODO: ...

  const supabase = await createServerAppClient();

  return {
    ok: false,
    success: null,
    error: null,
    data: null,
  };
};

// ---
export const putArticlePublic = async (
  id: string,
  prevState: ArticleActionStateProps,
  formData: FormData
): Promise<ArticleActionStateProps> => {
  const profile_id = formData.get("profile_id");
  const title = formData.get("article_title");
  const subtitle = formData.get("article_subtitle");
  const body = formData.get("article_body") as string;

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
    console.error("articleError", articleError);
    // "profile_id" de "authors" não encontrado.
    return {
      ok: false,
      success: null,
      // error: `"profile_id" de "authors" não encontrado.`,
      error: "Não foi possível alterar o artigo.",
      data: null,
    };
  }

  if (
    !isUserArticleAuthor({
      article_id: article.id,
      profile_id: profile_id as string,
      supabase,
    })
  )
    return {
      ok: true,
      success: null,
      error: "Não foi possível alterar o artigo.",
      data: null,
    };

  const { data: updatedArticle, error } = await supabase
    .from("articles")
    .update({
      title,
      sub_title: subtitle === "" ? null : subtitle,
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
    success: "Artigo atualizado!",
    error: null,
    data: updatedArticle,
  };
};

export const putArticleSave = async (
  id: string,
  prevState: ArticleActionStateProps,
  formData: FormData
): Promise<ArticleActionStateProps> => {
  // TODO

  const supabase = await createServerAppClient();

  return {
    ok: false,
    success: null,
    error: null,
    data: null,
  };
};

// ---
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

// ---
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
    return false;
  }

  const { data: author, error: authorError } = await supabase
    .from("authors")
    .select("*")
    .eq("profile_id", profile_id)
    .single();

  if (authorError) {
    console.error(authorError);
    return false;
  }

  if (article.author_id !== author.id) return false;

  return true;
};
