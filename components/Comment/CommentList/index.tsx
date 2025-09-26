import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useComment } from "@/hooks/useComment";
import CommentFooterRow from "./CommentFooterRow";
import CommentBodyRow from "./CommentBodyRow";
import CommentChildsRow from "./CommentChildsRow";
import CommentAvatarRow from "./CommentAvatarRow";

export default function CommentList({
  comment,
  divId,
}: {
  comment: CommentsSafe;
  divId: string;
}) {
  const { loggedProfile: currentUser } = useProfile();

  const commentContext = useComment();
  const readComments = commentContext?.readComments;
  const childComments = readComments(comment.id);

  const [isChildsHidden, setIsChildsHidden] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const [hasLiked, setHasLiked] = useState(false);

  const toggleChildrenThread = () => {
    setIsChildsHidden(!isChildsHidden);
  };

  return (
    <div id={divId}>
      <CommentAvatarRow
        comment={comment}
        setIsDeleted={setIsDeleted}
        isEditingState={[isEditing, setIsEditing]}
      />
      <CommentBodyRow
        comment={comment}
        currentUser={currentUser}
        setHasLiked={setHasLiked}
        isEditingState={[isEditing, setIsEditing]}
      />
      <CommentFooterRow
        comment={comment}
        currentUser={currentUser}
        hasChildComments={!!childComments}
        toggleChildrenThread={toggleChildrenThread}
        isChildsHidden={isChildsHidden}
        likeState={[likeCount, setLikeCount]}
        hasLikedState={[hasLiked, setHasLiked]}
        replyWindowState={[isReplying, setIsReplying]}
      />
      <CommentChildsRow
        loading={false}
        parent_id={comment.id}
        childComments={childComments}
        isChildsHidden={isChildsHidden}
        replyWindowState={[isReplying, setIsReplying]}
      />
    </div>
  );
}
