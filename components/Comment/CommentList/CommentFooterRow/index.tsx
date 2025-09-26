import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CancelIcon } from "@/components/Icons";
import { EmailFieldset, PasswordFieldset } from "@/components/Fieldsets";
import { ProvidersRowButtons } from "@/components/Buttons/client";
import {
  hasLiked as hasLikedFn,
  dislikeComment,
  likeComment,
} from "@/services/comment";

const CommentFooterRow = ({
  comment,
  currentUser,
  hasChildComments,
  toggleChildrenThread,
  replyWindowState,
  likeState,
  hasLikedState,
  isChildsHidden,
}: {
  comment: CommentsSafe;
  currentUser: Profile | null;
  hasChildComments: boolean;
  toggleChildrenThread: () => void;
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
  isChildsHidden: boolean;
}) => {
  const [likeCount, setLikeCount] = likeState;
  const isUserCommentOwner = currentUser?.id !== comment.profiles.id;
  return (
    <div className="grid grid-cols-[40px_1fr_40px] items-center gap-2">
      {hasChildComments ? (
        <ExpandRepliesButton
          isChildsHidden={isChildsHidden}
          toggleChildrenThread={toggleChildrenThread}
        />
      ) : (
        <div />
      )}
      {comment.is_deleted ? (
        <div className="w-full h-10" />
      ) : (
        <div className="flex h-10 items-center gap-1">
          <LikeButton
            currentUser={currentUser}
            comment={comment}
            setLikeCount={setLikeCount}
            hasUserLikedComment={hasLikedState}
          />
          <LikeCount likeCount={likeCount} />
          <ReplyButton
            currentUser={currentUser}
            replyWindowState={replyWindowState}
          />
          <ReportButton differentUser={isUserCommentOwner} />
        </div>
      )}
      <div />
    </div>
  );
};

const ExpandRepliesButton = ({
  toggleChildrenThread,
  isChildsHidden,
}: {
  toggleChildrenThread: () => void;
  isChildsHidden: boolean;
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <button
        type="button"
        onClick={toggleChildrenThread}
        className={
          `relative size-5 mx-auto shrink-0 ` +
          `flex items-center justify-between cursor-pointer ` +
          `rounded-full border border-neutral-700 ` +
          `bg-neutral-900 hover:bg-neutral-800 ` +
          `transition-all hover:text-neutral-100 outline-none ` +
          `focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] `
        }
      >
        {!isChildsHidden ? <PlusIcon /> : <MinusIcon />}
      </button>
      <div />
    </div>
  );
};

const PlusIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
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
);

const MinusIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-minus-icon lucide-minus absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <path d="M5 12h14" />
  </svg>
);

const LikeButton = ({
  currentUser,
  comment,
  setLikeCount,
  hasUserLikedComment,
}: {
  currentUser: Profile | null;
  comment: CommentsSafe;
  setLikeCount: Dispatch<SetStateAction<number>>;
  hasUserLikedComment: [
    hasLiked: boolean,
    setHasLiked: Dispatch<SetStateAction<boolean>>
  ];
}) => {
  const [hasLiked, setHasLiked] = hasUserLikedComment;

  const toggleLike = async () => {
    if (currentUser === null) return;

    const userHasLiked = await hasLikedFn({
      comment_id: comment.id,
      profile_id: currentUser.id,
    });

    if (userHasLiked === null) {
      try {
        setLikeCount((prev) => ++prev);
        setHasLiked(true);

        const commentLikes = await likeComment({
          comment_id: comment.id,
          profile_id: currentUser.id,
        });

        return commentLikes;
      } catch (e) {
        setLikeCount((prev) => --prev);
        setHasLiked(false);
      }
    }

    setLikeCount((prev) => --prev);
    setHasLiked(false);

    const commentLikes = await dislikeComment({
      comment_id: comment.id,
      profile_id: currentUser.id,
    });

    return commentLikes;
  };

  return (
    <button
      type="button"
      onClick={toggleLike}
      className={
        `relative shrink-0 size-7 rounded-full cursor-pointer outline-none ` +
        `transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-800/50 `
      }
    >
      <ArrowUpIcon hasLiked={hasLiked} />
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

const ArrowUpIcon = ({
  hasLiked,
  size = 24,
}: {
  hasLiked: boolean;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
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
);

const ReplyButton = ({
  currentUser,
  replyWindowState,
}: {
  currentUser: Profile | null;
  replyWindowState: [
    isReplying: boolean,
    setIsReplying: Dispatch<SetStateAction<boolean>>
  ];
}) => {
  const pathname = usePathname();
  const redirectTo = process.env.NEXT_PUBLIC_CLIENT_URL + pathname;
  // process.env.NEXT_PUBLIC_CLIENT_URL + pathname + "#Comments-section";
  if (currentUser === null) {
    return (
      <AlertDialog>
        <AlertDialogTrigger
          className={
            `relative text-sm px-2 py-0.5 cursor-pointer outline-none rounded ` +
            `text-neutral-500 hover:text-theme-color ` +
            `transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-800/50 ` +
            `after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-theme-color `
          }
        >
          Responder
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-4xl p-8">
          <AlertDialogCancel className="relative size-10 rounded-full mr-0 ml-auto">
            <CancelIcon />
          </AlertDialogCancel>
          <AlertDialogTitle
            asChild
            className="relative text-center text-3xl text-neutral-300 uppercase"
          >
            <h1>Cadastrar-se</h1>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-500 font-medium">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A maiores
            atque debitis veritatis eveniet minus ab quae, aperiam voluptates
            officiis distinctio repellat, suscipit maxime ducimus quibusdam
            natus? Recusandae, in temporibus!
          </AlertDialogDescription>
          <form className="flex flex-col gap-2">
            <EmailFieldset />
            <PasswordFieldset />
            <div className="flex items-center justify-end gap-2">
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction>Confirmar</AlertDialogAction>
            </div>
          </form>
          <ProvidersRowButtons redirectTo={redirectTo} />
          {/* <AlertDialogFooter className="flex items-center gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction>Confirmar</AlertDialogAction>
          </AlertDialogFooter> */}
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return <SubmitReplyButton replyWindowState={replyWindowState} />;
};

const SubmitReplyButton = ({
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
      onClick={() => {
        setIsReplying(!isReplying);
      }}
      className={
        `${
          isReplying
            ? "text-theme-color"
            : "text-neutral-500 hover:text-theme-color"
        } ` +
        `relative text-sm px-2 py-0.5 cursor-pointer outline-none rounded ` +
        `transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-800/50 ` +
        `after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-theme-color ` +
        `${isReplying && "after:duration-200 after:w-full"} `
      }
    >
      Responder
    </button>
  );
};

const ReportButton = ({ differentUser }: { differentUser: boolean }) => {
  return (
    differentUser && (
      <button
        className={
          `flex items-center gap-1 px-2 py-0.5 cursor-pointer rounded outline-none ` +
          `text-sm text-neutral-500 hover:text-theme-color ` +
          `transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-800/50 `
        }
      >
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

export default CommentFooterRow;
