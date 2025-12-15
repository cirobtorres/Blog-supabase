import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { LoadingSpinning } from "@/components/LoadingSpinning";
import { createComment, useAsyncFn } from "@/services/comment";
import { CommentEditor } from "../../CommentEditor";
import { useProfile } from "@/hooks/useProfile";
import { useComment } from "@/hooks/useComment";
import CommentAvatar from "../../CommentAvatar";
import CommentList from "..";

const CommentChildsRow = ({
  loading,
  parent_id,
  childComments,
  isChildsHidden,
  replyWindowState,
}: {
  loading: boolean;
  parent_id: string | null;
  childComments: CommentsSafe[] | undefined;
  isChildsHidden: boolean;
  replyWindowState: [
    isReplying: boolean,
    setIsReplying: Dispatch<SetStateAction<boolean>>
  ];
}) => {
  return (
    <div className="grid grid-cols-[40px_1fr] items-center gap-2">
      <div />
      <div>
        <IsReplyingComment
          parent_id={parent_id}
          replyWindowState={replyWindowState}
        />
        <CommentChilds
          childComments={childComments}
          isHidden={isChildsHidden}
        />
        {loading && <LoadingSpinning />}
      </div>
    </div>
  );
};

const CommentChilds = ({
  childComments,
  isHidden,
}: {
  childComments: CommentsSafe[] | undefined;
  isHidden: boolean;
}) => {
  return (
    isHidden &&
    childComments &&
    childComments.length > 0 &&
    childComments.map((child: CommentsSafe, index: number) => (
      <CommentList
        key={child.id}
        divId={`child-comment-${index + 1}-${child.id}`}
        comment={child}
      />
    ))
  );
};

const IsReplyingComment = ({
  parent_id,
  replyWindowState,
}: {
  parent_id: string | null;
  replyWindowState: [
    isReplying: boolean,
    setIsReplying: Dispatch<SetStateAction<boolean>>
  ];
}) => {
  const params: { id: string; slug: string } = useParams();
  const { id: article_id }: { id: string } = params;

  const { loggedProfile: currentUser } = useProfile();
  const profile_id = currentUser?.id;

  const [isReplying, setIsReplying] = replyWindowState;

  const commentContext = useComment();
  const addComments = commentContext?.addComments;
  const createReplyFn = useAsyncFn(createComment, [], false);

  const onReplyCreate = async (body: string) => {
    return createReplyFn
      .execute({
        article_id,
        body,
        profile_id,
        parent_id,
      })
      .then(async (comment) => {
        addComments(comment as CommentsSafe);
        setIsReplying(false);
        toast("Comentário criado!");
      })
      .catch((error: unknown) => {
        console.error(error);
        toast("Erro ao criar comentário");
      })
      .finally(() => setIsReplying(false));
  };

  const cancelEditor = () => {
    // This is optional and it runs AFTER the editor closing function
    // It is triggered after pushing "cancel" editor button
    // Closes the isReplying state
    setIsReplying(false);
  };

  return (
    isReplying &&
    currentUser && (
      <div>
        <div className="flex items-center gap-2">
          <CommentAvatar profile={currentUser} />
          <p className="text-sm text-theme-color">{currentUser.username}</p>
        </div>
        <CommentEditor
          id={`reply-to-${parent_id}`}
          autoFocus
          onSubmit={onReplyCreate}
          cancel={cancelEditor}
        />
      </div>
    )
  );
};

export default CommentChildsRow;
