import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  clientGetChilds,
  clientGetComments,
  clientHasLiked,
  clientSaveComment,
  clientUpdateComment,
  useAsync,
  useAsyncFn,
} from "@/services/comment";
import CommentBody from "./CommentBody";
import CommentFooter from "./CommentFooter";
import CommentSubHeader from "./CommentSubHeader";
import CommentOptions from "./CommentOptions";
import CommentAvatar from "./CommentAvatar";
import { useProfile } from "@/hooks/useProfile";
import { CommentEditor } from "../CommentEditor";
import { useParams } from "next/navigation";

export default function CommentRow({
  comment,
  childDivId,
}: {
  comment: Comments;
  childDivId: string;
}) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const [hasLiked, setHasLiked] = useState(false);
  const [isRepliesHidden, setIsRepliesHidden] = useState(true);
  const [hasChilds, setHasChilds] = useState(false);

  const { loggedProfile: currentUser } = useProfile();

  const { loading } = useAsync(async () => {});

  return (
    !isDeleted && (
      <div id={childDivId}>
        <FirstRow
          comment={comment}
          setIsDeleted={setIsDeleted}
          isEditingState={[isEditing, setIsEditing]}
        />
        <SecondRow
          comment={comment}
          currentUser={currentUser}
          setHasLiked={setHasLiked}
          isEditingState={[isEditing, setIsEditing]}
        />
        <ThirdRow
          comment={comment}
          currentUser={currentUser}
          likeState={[likeCount, setLikeCount]}
          hasLikedState={[hasLiked, setHasLiked]}
          replyWindowState={[isReplying, setIsReplying]}
          replyHiddenState={[isRepliesHidden, setIsRepliesHidden]}
        />
        <FourthRow
          comment={comment}
          currentUser={currentUser}
          replyWindowState={[isReplying, setIsReplying]}
        />
      </div>
    )
  );
}

const FirstRow = ({
  comment,
  setIsDeleted,
  isEditingState,
}: {
  comment: Comments;
  setIsDeleted: (value: boolean) => void;
  isEditingState: [
    isEditing: boolean,
    setIsEditing: Dispatch<SetStateAction<boolean>>
  ];
}) => (
  <div className="grid grid-cols-[40px_1fr_40px] items-center gap-2">
    <CommentAvatar profile={comment.profiles} />
    <CommentSubHeader comment={comment} />
    <CommentOptions
      comment={comment}
      setIsDeleted={setIsDeleted}
      isEditingState={isEditingState}
    />
  </div>
);

const SecondRow = ({
  comment,
  currentUser,
  setHasLiked,
  isEditingState,
}: {
  comment: Comments;
  currentUser: Profile | null;
  setHasLiked: Dispatch<SetStateAction<boolean>>;
  isEditingState: [
    isEditing: boolean,
    setIsEditing: Dispatch<SetStateAction<boolean>>
  ];
}) => (
  <div className="relative grid grid-cols-[40px_1fr_40px] items-center gap-2">
    <div className="relative h-full">
      <div className="absolute w-[1px] h-full bg-neutral-700 left-1/2" />
    </div>
    <ParentComment
      comment={comment}
      currentUser={currentUser}
      isEditingState={isEditingState}
      setHasLiked={setHasLiked}
    />
    <div />
  </div>
);

const ThirdRow = ({
  comment,
  currentUser,
  replyWindowState,
  likeState,
  hasLikedState,
  replyHiddenState,
}: {
  comment: Comments;
  currentUser: Profile | null;
  replyWindowState: [
    isReplying: boolean,
    setIsReplying: Dispatch<SetStateAction<boolean>>
  ];
  likeState: [
    likeCount: number,
    setLikeCount: Dispatch<SetStateAction<number>>
  ];
  hasLikedState: [
    hasLiked: boolean,
    setHasLiked: Dispatch<SetStateAction<boolean>>
  ];
  replyHiddenState: [
    isRepliesHidden: boolean,
    setIsRepliesHidden: Dispatch<SetStateAction<boolean>>
  ];
}) => {
  return (
    <div className="grid grid-cols-[40px_1fr_40px] items-center gap-2">
      <div className="relative w-full h-full">
        <div className="absolute w-full h-full rounded-bl -top-1/2 -right-1/2 border-b border-l border-solid border-neutral-700" />
      </div>
      <CommentFooter
        currentUser={currentUser}
        comment={comment}
        likeState={likeState}
        hasUserLikedComment={hasLikedState}
        replyWindowState={replyWindowState}
        replyHiddenState={replyHiddenState}
      />
      <div />
    </div>
  );
};

const FourthRow = ({
  comment,
  currentUser,
  replyWindowState,
}: {
  comment: Comments;
  currentUser: Profile | null;
  replyWindowState: [
    isReplying: boolean,
    setIsReplying: Dispatch<SetStateAction<boolean>>
  ];
}) => {
  const parent_id = comment.parent_id;
  const start = 5;
  const limit = 0;
  const sort = null;

  const [childs, setChilds] = useState<Comments[] | null>(null);

  useEffect(() => {
    (async () => {
      if (parent_id) {
        const childComments: Comments[] = await clientGetChilds(
          parent_id,
          { start, limit },
          sort
        );
        setChilds(childComments.map((comment: Comments) => comment));
      }
    })();
  }, [parent_id, sort]);

  return (
    <div className="grid grid-cols-[40px_1fr] items-center gap-2">
      <div />
      <div>
        <IsReplyingComment
          comment={comment}
          currentUser={currentUser}
          replyWindowState={replyWindowState}
        />
        {childs &&
          childs.map((child: Comments, index: number) => (
            <CommentRow
              key={child.id}
              childDivId={`child-comment-${index + 1}-${child.id}`}
              comment={child}
            />
          ))}
      </div>
    </div>
  );
};

const ParentComment = ({
  comment,
  currentUser,
  isEditingState,
  setHasLiked,
}: {
  comment: Comments;
  currentUser: Profile | null;
  isEditingState: [
    isReplying: boolean,
    setIsReplying: Dispatch<SetStateAction<boolean>>
  ];
  setHasLiked: Dispatch<SetStateAction<boolean>>;
}) => {
  const [commentBody, setCommentBody] = useState(comment.body);
  const [isEditing, setIsEditing] = isEditingState;
  const updateCommentFn = useAsyncFn(clientUpdateComment, [], false);

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
      });
  }

  useEffect(() => {
    (async () => {
      if (currentUser !== null) {
        const userHasLiked = await clientHasLiked({
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
      <CommentBody
        id={comment.id}
        commentBody={commentBody}
        isEditing={isEditing}
        onSubmit={onCommentUpdate}
        setIsEditing={() => setIsEditing(false)}
      />
    </div>
  );
};

const IsReplyingComment = ({
  comment,
  currentUser,
  replyWindowState,
}: {
  comment: Comments;
  currentUser: Profile | null;
  replyWindowState: [
    isReplying: boolean,
    setIsReplying: Dispatch<SetStateAction<boolean>>
  ];
}) => {
  const [replyLoading, setReplyLoading] = useState(false);
  const [isReplying, setIsReplying] = replyWindowState;
  const createReplyFn = useAsyncFn(clientSaveComment, [], false);

  const createReply = async (body: string) => {
    setReplyLoading(true);
    return createReplyFn
      .execute({
        article_id: comment.article_id,
        body,
        profile_id: currentUser?.id,
        parent_id: comment.id,
      })
      .then(async (comment) => {
        setIsReplying(false);
        console.log(comment);
      })
      .then(() => {
        toast("Comentário criado!");
      })
      .catch((error: unknown) => {
        console.error(error);
        toast("Erro ao criar comentário");
      })
      .finally(() => setReplyLoading(false));
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
        <CommentAvatar profile={currentUser} />
        <CommentEditor
          id={`reply-to-${comment.id}`}
          autoFocus
          onSubmit={createReply}
          cancel={cancelEditor}
        />
      </div>
    )
  );
};

// const CommentChilds = ({ comment }: { comment: Comments }) => {

//   return (
//     childs && (
//       childs.map((child: Comments, index: number) => (
//         <CommentRow
//           key={child.id}
//           childDivId={`parent-comment-${index + 1}-${child.id}`}
//           comment={child}
//         />
//       ))
//     )
//   );
// };
