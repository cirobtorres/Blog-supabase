"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  readComments as readCommentsFromDb,
  useAsync,
} from "@/services/comment";

type CommentMap = {
  [parent_id: string]: CommentsSafe[];
};

type CommentProviderProps = {
  loading: boolean;
  readComments: (parent_id: string | null) => CommentsSafe[] | undefined;
  rootComments: CommentsSafe[];
  loadMore: () => void;
  addComments: (comment: CommentsSafe) => void;
  removeComments: (id: string) => void;
};

export const CommentContext = React.createContext<CommentProviderProps>({
  loading: true,
  readComments: () => [],
  rootComments: [],
  loadMore: () => {},
  addComments: () => [],
  removeComments: () => [],
});

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const { id: article_id }: { id: string } = useParams();

  const start = 0;
  const pageSize = 10;
  const [limit, setLimit] = useState(pageSize);
  const [sort, setSort] = useState({ attr: "created_at", ascending: false });
  const [comments, setComments] = useState<CommentsSafe[]>([]);

  const { loading } = useAsync(async () => {
    const pagination = { start, limit };
    const comments = await readCommentsFromDb({
      article_id,
      pagination,
      sort,
    });
    setComments(() => [...comments]);
  }, [article_id, limit, sort]);

  const loadMore = useCallback(() => {
    setLimit((prev) => prev + pageSize);
  }, []);

  const addComments = (comment: CommentsSafe) =>
    setComments((prev) => [comment, ...prev]);

  // DELETE
  // const removeComments = (id: string) => {
  //   setComments((prevComments) => {
  //     return prevComments.filter((comment) => comment.id !== id);
  //   });
  // };

  // SOFT DELETE
  const removeComments = (id: string) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            body: "<p>[excluído]</p>",
            is_deleted: true,
            profiles: {
              id: null,
              avatar_url: null,
              username: "[excluído]",
              email: null,
              created_at: comment.profiles?.created_at,
              updated_at: comment.profiles?.updated_at ?? null,
            },
          };
        }
        return comment;
      });
    });
  };

  const nestedComments = useMemo(() => {
    const group: CommentMap = {};
    comments.forEach((comment) => {
      const key = comment.parent_id ?? "root";
      group[key] ||= [];
      group[key].push(comment);
    });
    return group;
  }, [comments]);

  function readComments(parent_id: string | null) {
    return nestedComments[parent_id ?? "root"];
  }

  return (
    <CommentContext.Provider
      value={{
        loading,
        readComments,
        rootComments: readComments(null),
        loadMore,
        addComments,
        removeComments,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}
