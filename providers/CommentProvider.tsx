"use client";

import {
  clientCountComments as countTotalComments,
  clientGetComments as getParentComments,
  useAsync,
} from "@/services/comment";
import { useParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

type CommentProviderProps = {
  loading: boolean;
  parentComments: Comments[];
  hasDbMoreComments: boolean;
  loadMore: () => void;
  createComment: (comment: Comments) => void;
};

export const CommentContext = React.createContext<CommentProviderProps>({
  loading: true,
  parentComments: [],
  hasDbMoreComments: false,
  loadMore: () => {},
  createComment: () => {},
});

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const { id: article_id } = useParams();

  const start = 0;
  const [limit, setLimit] = useState(2);

  const [parentComments, setParentComments] = useState<Comments[]>([]);
  const [countDBComments, setCountDBComments] = useState<number>(0);

  const [sort, setSort] = useState({ attr: "created_at", ascending: false });

  const { loading } = useAsync(async () => {
    const [queriedComments, total] = await Promise.all([
      getParentComments(article_id as string, { start, limit }, null, sort),
      countTotalComments(article_id as string, null),
    ]);
    setParentComments(() => [...queriedComments]);
    setCountDBComments(() => total);
  }, [article_id, limit, sort]);

  const loadMore = useCallback(() => {
    setLimit((prev) => prev + 2);
  }, []);

  const hasDbMoreComments = useMemo(() => {
    return countDBComments > parentComments.length;
  }, [countDBComments, parentComments]);

  const createComment = useCallback((comment: Comments) => {
    setParentComments((prev) => [comment, ...prev]);
    setCountDBComments((prev) => prev + 1);
  }, []);

  return (
    <CommentContext.Provider
      value={{
        loading,
        parentComments,
        hasDbMoreComments,
        loadMore,
        createComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}
