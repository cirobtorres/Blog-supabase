"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserAppClient } from "@/supabase/client";

const supabase = createBrowserAppClient();

// Self executing with useEffect
export const useAsync = (
  func: (
    ...args: any[]
  ) => Promise<Comments | Comments[] | number | string | void>,
  // readComments => Promise<Comment[]>
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

// Callable
export const useAsyncFn = (
  func: (
    ...args: any[]
  ) => Promise<
    | Comments
    | Comments[]
    | CommentsSafe
    | CommentsSafe[]
    | number
    | string
    | void
  >,
  // readComments => Promise<Comment[]>
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
    | Comments
    | Comments[]
    | CommentsSafe
    | CommentsSafe[]
    | number
    | string
    | void
    | null
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

// --------------------------------------------------------------------------
// ------------------------------COUNT-COMMENTS------------------------------
// --------------------------------------------------------------------------
// Count all comments of an article_id
// Conta TODOS os comentários de um article_id
export const countCommentsByArticleId = async (article_id: string) => {
  const { count, error } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("is_deleted", false)
    .eq("article_id", article_id);

  if (error) {
    console.error("countCommentsByArticleId error:", error);
    return Promise.reject(
      new Error("Failed to fetch countCommentsByArticleId")
    );
  }

  return count || 0;
};

// Count comments of an article_id by parent_id
// Conta comentários de um article_id pelo parent_id
export const countCommentsByParentId = async (
  article_id: string,
  parent_id: string | null
) => {
  const { count, error } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("is_deleted", false)
    .eq("article_id", article_id)
    .is("parent_id", parent_id);

  if (error) {
    console.error("countCommentsByParentId error:", error);
    return Promise.reject(new Error("Failed to fetch count comments"));
  }

  return count || 0;
};

// Count comments by parent_id
// Conta comentários pelo parent_id
export const countChildComments = async (parent_id: string) => {
  const { count, error } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("is_deleted", false)
    .eq("parent_id", parent_id);

  if (error) {
    console.error("countChildComments error:", error);
    return Promise.reject(new Error("Failed to fetch countChildComments"));
  }

  return count || 0;
};
// --------------------------------------------------------------------------
// -------------------------------CRUD-COMMENTS------------------------------
// --------------------------------------------------------------------------
// Real all comments by article_id (parent and childs)
export const readComments = async ({
  article_id,
  pagination,
  sort,
}: {
  article_id: string;
  pagination: { start: number; limit: number };
  sort: { attr: string; ascending: boolean } | null;
}) => {
  const from = pagination.start || 0;
  const to = pagination?.limit - 1;

  const { data: comments, error } = await supabase
    .from("comments_safe")
    .select("*")
    .eq("article_id", article_id)
    .range(from, to)
    .order(sort?.attr ?? "created_at", { ascending: sort?.ascending || false });

  if (error) {
    console.error("getComments error:", error);
    return Promise.reject(new Error("Failed to fetch getComments"));
  }

  return comments;
};

// Read parent comments (parent_id = null) by article_id
export const readCommentsByArticleId = async ({
  article_id,
  pagination,
  sort,
}: {
  article_id: string;
  pagination: { start: number; limit: number };
  sort: { attr: string; ascending: boolean } | null;
}) => {
  const from = pagination.start || 0;
  const to = pagination?.limit - 1;

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
    // .eq("is_deleted", false)
    .eq("article_id", article_id)
    .is("parent_id", null)
    .range(from, to)
    .order(sort?.attr ?? "created_at", { ascending: sort?.ascending || false });
  // .range(from, to)
  // INNER JOIN
  // FK between comments and profiles is "comments_profile_id_fkey"
  // Notation "NEW_NAME:key" to rename a column
  // comments_profile_id_fkey:profiles = profiles {id: ... username: ...}

  if (error) {
    console.error("getComments error:", error);
    return Promise.reject(new Error("Failed to fetch getComments"));
  }

  return comments;
};

// Read child comments (parent_id != null)
export const readCommentsByParentId = async ({
  parent_id,
  pagination,
  sort,
}: {
  parent_id: string;
  pagination: { start: number; limit: number };
  sort: { attr: string; ascending: boolean } | null;
}) => {
  const from = (pagination.start - 1) * pagination.limit;
  const to = from + pagination.limit - 1;

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
    // .eq("is_deleted", false)
    .eq("parent_id", parent_id)
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

export const createComment = async ({
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

export const updateComment = async ({
  id,
  body,
}: {
  id: string;
  body: string;
}) => {
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

// Soft delete
export const deleteComment = async ({ id }: { id: string }) => {
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
    console.error("deleteComment error:", error);
    return Promise.reject(new Error("Failed to fetch deleteComment"));
  }

  return comment;
};
// --------------------------------------------------------------------------
// ------------------------------LIKE-COMMENTS-------------------------------
// --------------------------------------------------------------------------
export const hasLiked = async ({
  comment_id,
  profile_id,
}: {
  comment_id: string;
  profile_id: string;
}) => {
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
