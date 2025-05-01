"use server";

import {
  getEditorFormDataValue,
  getTitleFormDataValue,
} from "@/components/Fieldsets";
import { createServerAppClient } from "@/supabase/server";
import { slugify } from "@/utils/strings";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const postArticle = async (
  prevState: { success: string | null; error: string | null },
  formData: FormData
): Promise<{ success: string | null; error: string | null }> => {
  const title = formData.get(getTitleFormDataValue);
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

  const { error: articleError } = await supabase
    .from("articles")
    .insert([{ title, slug, body, author_id }]);

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
  const body = formData.get(getEditorFormDataValue);

  if (!title || !body)
    return { success: null, error: "Title and body cannot be empty." };

  const supabase = await createServerAppClient();

  const { error } = await supabase
    .from("articles")
    .update({ title, body })
    .eq("id", id);

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
