"use client";

import { useCallback, useEffect, useState } from "react";

export const useAsync = (
  func: (
    ...args: any[]
  ) => Promise<Comment | Comment[] | number | string | void>,
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
  ) => Promise<Comment | Comment[] | number | string | void>,
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
    Comment | Comment[] | number | string | void | null
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
  documentId: string,
  parent_id: string
) => {};

export const clientGetComments = async (
  documentId: string,
  pagination: any,
  parentId: string | null = null,
  sort: string[] | null = ["createdAt:desc"]
) => {};

export const clientGetComment = async ({
  documentId,
}: {
  documentId: string;
}) => {};

export const clientSaveComment = async ({
  documentId,
  body,
  userId,
  parentId: parent_id,
}: {
  documentId: string;
  body: string;
  userId: string;
  parentId?: string | null;
}) => {};

export const clientUpdateComment = async ({
  documentId,
  body,
}: {
  documentId: string;
  body: string;
}) => {};

export const clientDeleteComment = async ({
  documentId,
}: {
  documentId: string;
}) => {};

export const countCommentLikes = async (commentDocumentId: string) => {};

export const likeComment = async (
  commentDocumentId: string,
  userDocumentId: string
) => {};

export const dislikeComment = async (commentDocumentId: string) => {};
