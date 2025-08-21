"use client";

import { createBrowserAppClient } from "@/supabase/client";
import { useCallback, useEffect, useState } from "react";

export const useAsync = (
  func: (
    ...args: any[]
  ) => Promise<Comments | Comments[] | number | string | void>,
  // getComments => Promise<Comment[]>
  // createComment => Promise<Comment>
  // updateComment => Promise<Comment>
  // countComments => Promise<number>
  // deleteComment => Promise<string>
  dependencies: any[] = []
) => {
  const { execute, ...state } = useAsyncFn(func, dependencies, true);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
};

export const useAsyncFn = (
  func: (
    ...args: any[]
  ) => Promise<Comments | Comments[] | number | string | void>,
  // getComments => Promise<Comment[]>
  // createComment => Promise<Comment>
  // updateComment => Promise<Comment>
  // countComments => Promise<number>
  // deleteComment => Promise<string>
  dependencies: any[] = [],
  initialLoading: boolean = false
) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<
    Comments | Comments[] | number | string | void | null
  >(null);

  const execute = useCallback(async (...params: any[]) => {
    setLoading(true);
    return func(...params)
      .then((data) => {
        setValue(data);
        setError(null);
        return data;
      })
      .catch((error: unknown) => {
        setValue(null);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, dependencies);
  return { loading, error, value, execute };
};

export const clientCountComments = async (
  article_id: string,
  parent_id: string | null
) => {
  const supabase = createBrowserAppClient();

  const { count, error } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("is_deleted", false)
    .eq("article_id", article_id)
    .is("parent_id", parent_id);

  if (error) {
    console.error("clientCountComments error:", error);
    return Promise.reject(new Error("Failed to fetch count comments"));
  }

  return count || 0;
};

export const clientGetComments = async (
  article_id: string,
  pagination: { start: number; limit: number },
  parent_id: string | null = null,
  sort: { attr: string; ascending: boolean } | null
) => {
  const from = pagination.start;
  const to = pagination.limit - 1;

  const supabase = createBrowserAppClient();

  const { data: comments, error } = await supabase
    .from("comments")
    .select(
      `
        *,
        profiles:comments_profile_id_fkey (
          id, 
          email, 
          username, 
          avatar_url, 
          updated_at, 
          created_at
        )
      `
    )
    .eq("is_deleted", false)
    .eq("article_id", article_id)
    .is("parent_id", parent_id)
    .range(from, to)
    .order(sort?.attr ?? "created_at", { ascending: sort?.ascending || false });
  // INNER JOIN
  // comments_profile_id_fkey é a chave estrangeira entre comments e profiles
  // Para renomear uma coluna, faz a notação NOVO_NOME:chave
  // Logo, comments_profile_id_fkey aparecerá como profiles {id: ... username: ...}
  // .range(from, to)

  if (error) {
    console.error("clientGetComments error:", error);
    return Promise.reject(new Error("Failed to fetch get comments"));
  }

  return comments;
};

export const clientGetChilds = async (
  parent_id: string,
  pagination: { start: number; limit: number },
  sort: { attr: string; ascending: boolean } | null
) => {
  const from = (pagination.start - 1) * pagination.limit;
  const to = from + pagination.limit - 1;

  const supabase = createBrowserAppClient();

  const { data: childs, error } = await supabase
    .from("comments")
    .select(
      `
        *,
        profiles:comments_profile_id_fkey (
          id, 
          email, 
          username, 
          avatar_url, 
          updated_at, 
          created_at
        )
      `
    )
    .eq("is_deleted", false)
    .is("parent_id", parent_id)
    // .range(from, to) // TODO: pagination
    .order(sort?.attr ?? "created_at", { ascending: sort?.ascending || false });
  // INNER JOIN
  // comments_profile_id_fkey é a chave estrangeira entre comments e profiles
  // Para renomear uma coluna, faz a notação NOVO_NOME:chave
  // Logo, comments_profile_id_fkey aparecerá como profiles {id: ... username: ...}
  // .range(from, to)

  if (error) {
    console.error("clientGetChilds error:", error);
    return Promise.reject(new Error("Failed to fetch get childs"));
  }

  return childs;
};

export const clientHasChilds = async () => {};

export const clientGetComment = async ({ id }: { id: string }) => {};

export const clientSaveComment = async ({
  article_id,
  body,
  profile_id,
  parent_id,
}: {
  article_id: string;
  body: string;
  profile_id: string;
  parent_id?: string | null;
}) => {
  const supabase = createBrowserAppClient();

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({ article_id, body, profile_id, parent_id })
    .select(
      `
        *,
        profiles:comments_profile_id_fkey (
          id, 
          email, 
          username, 
          avatar_url, 
          updated_at, 
          created_at
        )
      `
    )
    .single();

  if (error) {
    console.error("clientSaveComment error:", error);
    return Promise.reject(new Error("Failed to fetch save comment"));
  }

  return comment;
};

export const clientUpdateComment = async ({
  id,
  body,
}: {
  id: string;
  body: string;
}) => {
  const supabase = createBrowserAppClient();

  const { data: comment, error } = await supabase
    .from("comments")
    .update({ body })
    .eq("id", id)
    .select(
      `
        *,
        profiles:comments_profile_id_fkey (
          id, 
          email, 
          username, 
          avatar_url, 
          updated_at, 
          created_at
        )
      `
    )
    .single();

  if (error) {
    console.error("clientUpdateComment error:", error);
    return Promise.reject(new Error("Failed to fetch update comment"));
  }

  return comment;
};

export const clientDeleteComment = async ({ id }: { id: string }) => {
  const supabase = createBrowserAppClient();

  const { data: comment, error } = await supabase
    .from("comments")
    .update({ is_deleted: true })
    .eq("id", id)
    .select(
      `
        *,
        profiles:comments_profile_id_fkey (
          id, 
          email, 
          username, 
          avatar_url, 
          updated_at, 
          created_at
        )
      `
    )
    .single();

  if (error) {
    console.error("clientDeleteComment error:", error);
    return Promise.reject(new Error("Failed to fetch delete comment"));
  }

  return comment;
};

export const clientHasLiked = async ({
  comment_id,
  profile_id,
}: {
  comment_id: string;
  profile_id: string;
}) => {
  const supabase = createBrowserAppClient();

  const { data: comment, error } = await supabase
    .from("comment_likes")
    .select("*")
    .eq("comment_id", comment_id)
    .eq("profile_id", profile_id)
    .maybeSingle();

  if (error) {
    console.error("hasLiked error:", error);
    return Promise.reject(new Error("Failed to fetch has liked"));
  }

  return comment;
};

export const likeComment = async ({
  comment_id,
  profile_id,
}: {
  comment_id: string;
  profile_id: string;
}) => {
  const supabase = createBrowserAppClient();

  const { data: like, error: likeError } = await supabase
    .from("comment_likes")
    .insert([{ comment_id, profile_id }])
    .select("*")
    .single();

  if (likeError) {
    console.error("likeComment error:", likeError);
    return Promise.reject(
      new Error("Failed to insert like_count at comment_likes")
    );
  }
  return like;
};

export const dislikeComment = async ({
  comment_id,
  profile_id,
}: {
  comment_id: string;
  profile_id: string;
}) => {
  const supabase = createBrowserAppClient();

  const { data: like, error } = await supabase
    .from("comment_likes")
    .delete()
    .eq("comment_id", comment_id)
    .eq("profile_id", profile_id)
    .select("*")
    .single();

  if (error) {
    console.error("dislikeComment error:", error);
    return Promise.reject(new Error("Failed to fetch disliking comment"));
  }

  return like;
};
