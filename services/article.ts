"use server";

import { revalidatePath } from "next/cache";
import { createServerAppClient } from "@/supabase/server";
import {
  getEditorFormDataValue,
  getSubtitleFormDataValue,
  getTitleFormDataValue,
} from "@/components/Fieldsets";
import { slugify } from "@/utils/strings";

export const postArticle = async (
  prevState: { ok: boolean; success: string | null; error: string | null },
  formData: FormData
): Promise<{ ok: boolean; success: string | null; error: string | null }> => {
  const title = formData.get(getTitleFormDataValue);
  const subTitle = formData.get(getSubtitleFormDataValue);
  const body = formData.get(getEditorFormDataValue);
  const profile_id = formData.get("profile_id");

  if (!title || !body)
    return {
      ok: false,
      success: null,
      error: "Title and body cannot be empty.",
    };

  const supabase = await createServerAppClient();

  const { data: author, error: authorError } = await supabase
    .from("authors")
    .select("id")
    .eq("profile_id", profile_id)
    .single();

  if (authorError) {
    console.error(authorError.message);
    return { ok: false, success: null, error: authorError.message };
  }

  const author_id = author.id;

  const slug = slugify(title as string);
  const sub_title = subTitle === "" ? null : subTitle;

  const { error: articleError } = await supabase
    .from("articles")
    .insert([{ title, slug, sub_title, body, author_id }]);

  if (articleError) {
    console.error(articleError);
    return { ok: false, success: null, error: articleError.message };
  }

  revalidatePath("/");
  return { ok: true, success: "Article created!", error: null };
};

export const putArticle = async (
  id: string,
  prevState: { ok: boolean; success: string | null; error: string | null },
  formData: FormData
): Promise<{ ok: boolean; success: string | null; error: string | null }> => {
  const title = formData.get(getTitleFormDataValue);
  const subTitle = formData.get(getSubtitleFormDataValue);
  const body = formData.get(getEditorFormDataValue);

  if (!title || !body)
    return {
      ok: false,
      success: null,
      error: "Title and body cannot be empty.",
    };

  const supabase = await createServerAppClient();

  const { error } = await supabase
    .from("articles")
    .update({
      title,
      sub_title: subTitle === "" ? null : subTitle,
      body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    return { ok: false, success: null, error: error.message };
  }

  revalidatePath("/");
  return { ok: true, success: "Article updated!", error: null };
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
