import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { hasLiked, updateComment, useAsyncFn } from "@/services/comment";
import { CommentEditor } from "../../CommentEditor";

const CommentBodyRow = ({
  comment,
  currentUser,
  setHasLiked,
  isEditingState,
}: {
  comment: CommentsSafe;
  currentUser: Profile | null;
  setHasLiked: Dispatch<SetStateAction<boolean>>;
  isEditingState: [
    isEditing: boolean,
    setIsEditing: Dispatch<SetStateAction<boolean>>
  ];
}) => (
  <div className="relative grid grid-cols-[40px_1fr_40px] items-center gap-2">
    <div className="relative h-full" />
    <CommentBody
      comment={comment}
      currentUser={currentUser}
      isEditingState={isEditingState}
      setHasLiked={setHasLiked}
    />
    <div />
  </div>
);

const CommentBody = ({
  comment,
  currentUser,
  isEditingState,
  setHasLiked,
}: {
  comment: CommentsSafe;
  currentUser: Profile | null;
  isEditingState: [
    isReplying: boolean,
    setIsReplying: Dispatch<SetStateAction<boolean>>
  ];
  setHasLiked: Dispatch<SetStateAction<boolean>>;
}) => {
  const [commentBody, setCommentBody] = useState(comment.body);
  const [isEditing, setIsEditing] = isEditingState;
  const updateCommentFn = useAsyncFn(updateComment, [], false);

  useEffect(() => {
    // Refreshes commentBody when removeComments is triggered from CommentOptions
    setCommentBody(comment.body);
  }, [comment.body]);

  async function onCommentUpdate(body: string): Promise<void> {
    return updateCommentFn
      .execute({ id: comment.id, body })
      .then((updatedComment) => {
        return updatedComment as Comments;
      })
      .then((updatedComment: Comments) => {
        setIsEditing(false);
        setCommentBody(updatedComment.body);
        toast("Comentário editado!");
      })
      .catch((error: unknown) => {
        toast("Erro ao editar comentário");
        console.error(error);
      })
      .finally(() => {
        // setIsEditing(false);
      });
  }

  useEffect(() => {
    (async () => {
      if (currentUser !== null) {
        const userHasLiked = await hasLiked({
          comment_id: comment.id,
          profile_id: currentUser.id,
        });
        if (userHasLiked) return setHasLiked(true);
      }
      return setHasLiked(false);
    })();
  }, [comment.id, currentUser?.id]);

  return (
    <div className="items-center">
      {isEditing ? (
        <CommentEditor
          autoFocus
          id={comment.id}
          initialContent={commentBody}
          className="[&_p]:break-words [&_p:not(:last-child)]:mb-4 last:[&_p]:mb-0 text-sm"
          cancel={() => setIsEditing(false)}
          onSubmit={onCommentUpdate}
        />
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: commentBody }}
          className="[&_p]:break-words [&_p:not(:last-child)]:mb-4 last:[&_p]:mb-0 text-sm py-2 text-neutral-300 border-b border-neutral-800"
        />
      )}
    </div>
  );
};

export default CommentBodyRow;
