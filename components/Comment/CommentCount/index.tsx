"use client";

import { useEffect, useState } from "react";
import { useComment } from "@/hooks/useComment";
import { clientCountComments } from "@/services/comment";

const CommentCount = ({ article_id }: { article_id: string }) => {
  const { comments } = useComment();
  const [commentLength, setCommentLength] = useState<number | null>(null);

  useEffect(() => {
    clientCountComments(article_id, null).then((data) => {
      setCommentLength(data);
    });
  }, [article_id, comments]);

  if (commentLength === null) {
    return (
      <div className="mb-10">
        <h2 className="flex items-center gap-3 text-2xl text-center">
          Loading... Comentários
        </h2>
      </div>
    );
  }

  const commentCountText =
    commentLength <= 1
      ? `${commentLength} Comentário`
      : `${commentLength} Comentários`;

  return (
    <div className="mb-10">
      <h2 className="flex items-center gap-3 text-2xl text-center">
        {commentCountText}
      </h2>
    </div>
  );
};

export default CommentCount;
