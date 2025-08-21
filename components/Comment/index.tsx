"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useComment } from "@/hooks/useComment";
import { CommentEditor } from "./CommentEditor";
import { clientSaveComment, useAsyncFn } from "@/services/comment";
import CommentCount from "./CommentCount";
import CommentRow from "./CommentRow";
import { useProfile } from "@/hooks/useProfile";
import LoadMoreButton from "./LoadMoreButton";
import CommentAvatar from "./CommentRow/CommentAvatar";
import { LoadingSpinning } from "./CommentLoading";

export default function Comments() {
  const params: { id: string; slug: string } = useParams();
  const { id: article_id }: { id: string } = params;

  const commentContext = useComment();
  const parentComments = commentContext?.parentComments;
  const loading = commentContext?.loading;
  const createComment = commentContext?.createComment;
  const { execute } = useAsyncFn(clientSaveComment, [], false);

  const { loggedProfile } = useProfile();

  const onCommentCreate = useCallback(
    async (body: string) => {
      return execute({
        article_id,
        body,
        profile_id: loggedProfile?.id,
      })
        .then((comment) => {
          createComment(comment as Comments);
          toast.success("Comentário criado!");
        })
        .catch((error: unknown) => {
          console.error(error);
          toast.error("Erro ao criar comentário");
        });
    },
    [article_id, loggedProfile?.id, execute, createComment]
  );

  return (
    <section className="w-full max-w-screen-md mx-auto flex flex-col py-10 mb-20 px-4">
      <CommentCount article_id={article_id} />
      <CommentHeader currentUser={loggedProfile} />
      <CommentEditor id="create" onSubmit={onCommentCreate} className="mt-4" />
      {parentComments?.map((parentComment: Comments, index: number) => (
        <CommentRow
          key={parentComment.id}
          childDivId={`parent-comment-${index + 1}-${parentComment.id}`}
          comment={parentComment}
        />
      ))}
      <LoadMoreButton />
      {loading && <LoadingSpinning />}
    </section>
  );
}

const CommentHeader = ({ currentUser }: { currentUser: Profile | null }) => {
  if (!currentUser) return null;

  return (
    <div className="flex items-center gap-2">
      <CommentAvatar profile={currentUser} />
      <p className="text-theme-color">{currentUser.username}</p>
    </div>
  );
};
