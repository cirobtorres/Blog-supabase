import { cn } from "@/lib/utils";
import {
  clientHasLiked,
  dislikeComment,
  likeComment,
} from "@/services/comment";
import { Dispatch, SetStateAction } from "react";

export default function CommentFooter({
  currentUser,
  comment,
  hasUserLikedComment,
  likeState,
  replyWindowState,
  replyHiddenState,
}: {
  currentUser: Profile | null;
  comment: Comments;
  likeState: [
    likeCount: number,
    setLikeCount: Dispatch<SetStateAction<number>>
  ];
  hasUserLikedComment: [
    hasLiked: boolean,
    setHasLiked: Dispatch<SetStateAction<boolean>>
  ];
  replyWindowState: [
    isReplying: boolean,
    setIsReplying: Dispatch<SetStateAction<boolean>>
  ];
  replyHiddenState: [
    isRepliesHidden: boolean,
    setIsRepliesHidden: Dispatch<SetStateAction<boolean>>
  ];
}) {
  const [likeCount, setLikeCount] = likeState;
  const isUserCommentOwner = currentUser?.id !== comment.profiles.id;

  return (
    <div className="flex h-10 items-center gap-1">
      <OpenReplies replyHiddenState={replyHiddenState} />
      <LikeButton
        currentUser={currentUser}
        comment={comment}
        setLikeCount={setLikeCount}
        hasUserLikedComment={hasUserLikedComment}
      />
      <LikeCount likeCount={likeCount} />
      <ReplyButton replyWindowState={replyWindowState} />
      <ReportButton differentUser={isUserCommentOwner} />
    </div>
  );
}

const OpenReplies = ({
  replyHiddenState,
}: {
  replyHiddenState: [
    isRepliesHidden: boolean,
    setIsRepliesHidden: Dispatch<SetStateAction<boolean>>
  ];
}) => {
  const [isRepliesHidden, setIsRepliesHidden] = replyHiddenState;

  const toggleIsRepliesHidden = () => {
    setIsRepliesHidden(!isRepliesHidden);
  };

  return (
    <div className="w-10">
      <button
        type="button"
        onClick={toggleIsRepliesHidden}
        className={
          `relative shrink-0 size-7 mx-auto flex items-center justify-between cursor-pointer rounded-full border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 ` +
          `transition-all hover:text-neutral-100 outline-none focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] `
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-plus-icon lucide-plus absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>
    </div>
  );
};

const LikeButton = ({
  currentUser,
  comment,
  setLikeCount,
  hasUserLikedComment,
}: {
  currentUser: Profile | null;
  comment: Comments;
  setLikeCount: Dispatch<SetStateAction<number>>;
  hasUserLikedComment: [
    hasLiked: boolean,
    setHasLiked: Dispatch<SetStateAction<boolean>>
  ];
}) => {
  const [hasLiked, setHasLiked] = hasUserLikedComment;

  const toggleLike = async () => {
    if (currentUser === null) return;

    const userHasLiked = await clientHasLiked({
      comment_id: comment.id,
      profile_id: currentUser.id,
    });

    if (userHasLiked === null) {
      await likeComment({
        comment_id: comment.id,
        profile_id: currentUser.id,
      });
      setLikeCount((prev) => ++prev);
      return setHasLiked(true);
    }

    await dislikeComment({
      comment_id: comment.id,
      profile_id: currentUser.id,
    });
    setLikeCount((prev) => --prev);
    return setHasLiked(false);
  };

  return (
    <button
      type="button"
      onClick={toggleLike}
      className={`relative shrink-0 size-7 rounded-full cursor-pointer outline-transparent transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-800/50`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-thumbs-up p-0.5 ${
          hasLiked
            ? "stroke-theme-color fill-theme-color text-theme-color"
            : "stroke-current fill-none"
        } absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
      >
        <path d="M9 18v-6H5l7-7 7 7h-4v6H9z" />
      </svg>
    </button>
  );
};

const LikeCount = ({ likeCount }: { likeCount: number }) => {
  return (
    <span className="text-sm min-w-7 flex items-center justify-center">
      {likeCount}
    </span>
  );
};

const ReplyButton = ({
  replyWindowState,
}: {
  replyWindowState: [
    isReplying: boolean,
    setIsReplying: Dispatch<SetStateAction<boolean>>
  ];
}) => {
  const [isReplying, setIsReplying] = replyWindowState;

  return (
    <button
      type="button"
      onClick={() => setIsReplying(!isReplying)}
      className={
        `${
          isReplying
            ? "text-theme-color "
            : "text-neutral-500 hover:text-theme-color "
        } ` +
        `relative text-sm px-2 py-0.5 cursor-pointer outline-transparent ` +
        `transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-800/50 `
      }
    >
      Responder
      <div
        className={cn(
          "absolute top-[calc(100%)] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-theme-color group-focus-within:w-full group-focus-within:duration-200",
          isReplying && " transition-[width] w-full"
        )}
      />
    </button>
  );
};

const ReportButton = ({ differentUser }: { differentUser: boolean }) => {
  return (
    differentUser && (
      <button className="text-sm p-1 cursor-pointer flex items-center gap-1 text-neutral-500 hover:text-neutral-200 transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-800/50 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-flag-icon lucide-flag"
        >
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" x2="4" y1="22" y2="15" />
        </svg>
        Reportar
      </button>
    )
  );
};
