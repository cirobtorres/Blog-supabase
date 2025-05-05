"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerAppClient } from "@/supabase/server";
import {
  getEditorFormDataValue,
  getSubtitleFormDataValue,
  getTitleFormDataValue,
} from "@/components/Fieldsets";
import { slugify } from "@/utils/strings";

export const postArticle = async (
  prevState: { success: string | null; error: string | null },
  formData: FormData
): Promise<{ success: string | null; error: string | null }> => {
  const title = formData.get(getTitleFormDataValue);
  const subTitle = formData.get(getSubtitleFormDataValue);
  const body = formData.get(getEditorFormDataValue);

  if (!title || !body)
    return { success: null, error: "Title and body cannot be empty." };

  const supabase = await createServerAppClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error(userError.message);
    return { success: null, error: userError.message };
  }

  const { data: author, error: authorError } = await supabase
    .from("authors")
    .select("id")
    .eq("user_id", user?.id)
    .single();

  if (authorError) {
    console.error(authorError.message);
    return { success: null, error: authorError.message };
  }

  const author_id = author?.id;

  const slug = slugify(title as string);
  const sub_title = subTitle === "" ? null : subTitle;

  const { error: articleError } = await supabase
    .from("articles")
    .insert([{ title, slug, sub_title, body, author_id }]);

  if (articleError) {
    console.error(articleError);
    return { success: null, error: articleError.message };
  }

  revalidatePath("/");
  return { success: "Article created!", error: null };
};

export const putArticle = async (
  id: string,
  prevState: { success: string | null; error: string | null },
  formData: FormData
): Promise<{ success: string | null; error: string | null }> => {
  const title = formData.get(getTitleFormDataValue);
  const subTitle = formData.get(getSubtitleFormDataValue);
  const body = formData.get(getEditorFormDataValue);

  if (!title || !body)
    return { success: null, error: "Title and body cannot be empty." };

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
    return { success: null, error: error.message };
  }

  revalidatePath("/");
  return { success: "Article updated!", error: null };
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

export const deleteArticle = async (id: string, pathname: string) => {
  const supabase = await createServerAppClient();

  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) console.error(error);

  revalidatePath("/");

  if (pathname !== "/") redirect("/");
};
