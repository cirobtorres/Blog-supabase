"use client";

import { useParams } from "next/navigation";
import { useComment } from "../../hooks/useComment";
import { CommentEditor } from "./CommentEditor";
import CommentCount from "./CommentCount";
import CommentList from "./CommentList";
import { useProfile } from "../../hooks/useProfile";
import LoadMoreButton from "./LoadMoreButton";
import CommentAvatar from "./CommentAvatar";
import { createComment, useAsyncFn } from "../../services/comment";
import { useCallback } from "react";
import { toast } from "sonner";

export default function Comments() {
  const params: { id: string; slug: string } = useParams();
  const { id: article_id }: { id: string } = params;

  const { loggedProfile: currentUser } = useProfile();
  const profile_id = currentUser?.id;

  const commentContext = useComment();
  const rootComments = commentContext?.rootComments;
  const addComments = commentContext?.addComments;
  const { execute: exeCommentCreate } = useAsyncFn(createComment, [], false);

  const onCommentCreate = useCallback(
    async (body: string) => {
      return exeCommentCreate({
        article_id,
        body,
        profile_id,
      })
        .then((comment) => {
          addComments(comment as CommentsSafe);
          toast.success("Comentário criado!");
        })
        .catch((error: unknown) => {
          console.error(error);
          toast.error("Erro ao criar comentário");
        });
    },
    [article_id, profile_id, exeCommentCreate, addComments]
  );

  return (
    <section
      id="Comments-section"
      className="[scroll-margin-top:40px] w-full max-w-screen-md mx-auto flex flex-col py-10 mb-20 px-4"
    >
      <CommentCount article_id={article_id} />
      <CommentHeader currentUser={currentUser} />
      <CommentEditor id="create" onSubmit={onCommentCreate} className="mt-4" />
      {rootComments?.map((parentComment: CommentsSafe, index: number) => (
        <CommentList
          key={parentComment.id}
          divId={`parent-comment-${index + 1}-${parentComment.id}`}
          comment={parentComment}
        />
      ))}
      <LoadMoreButton />
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
