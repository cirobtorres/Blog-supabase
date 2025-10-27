import { Dispatch, SetStateAction, useMemo, useState } from "react";
import CommentAvatar from "../../CommentAvatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProfile } from "@/hooks/useProfile";
import {
  AlertIcon,
  CancelIcon,
  DeleteIcon,
  EditIcon,
  OptionIcon,
  ReportIcon,
} from "@/components/Icons";
import { deleteComment, useAsyncFn } from "@/services/comment";
import { toast } from "sonner";
import { buttonVariants, focusVisibleWhiteRing } from "@/styles/classNames";
import { convertDateToYouTubeLike } from "@/utils/dates";
import { useComment } from "@/hooks/useComment";
import { cn } from "@/utils/classnames";

const CommentAvatarRow = ({
  comment,
  setIsDeleted,
  isEditingState,
}: {
  comment: CommentsSafe;
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

const DatetimeFormater = ({
  createdAt,
  updatedAt,
}: {
  createdAt: Date;
  updatedAt: Date | null;
}) => {
  return (
    <>
      <span className="text-[#808080]">
        {useMemo(() => convertDateToYouTubeLike(createdAt), [createdAt])}
      </span>
      <span className="text-[#808080]">
        {updatedAt && updatedAt > createdAt && "(editado)"}
      </span>
    </>
  );
};

const CommentSubHeader = ({ comment }: { comment?: CommentsSafe }) => {
  const { loggedProfile: currentUser } = useProfile();

  if (comment) {
    const commentAuthor = comment.profiles.id;
    const isUserComment = commentAuthor === currentUser?.id;

    return (
      <p
        className={`flex gap-1 items-end text-sm 
        ${isUserComment ? "text-theme-color" : "text-neutral-200"}`}
      >
        {comment.profiles ? (
          <>
            {comment.profiles.username}
            <DatetimeFormater
              createdAt={comment.created_at}
              updatedAt={comment.updated_at}
            />
          </>
        ) : (
          "[usuário excluído]"
        )}
      </p>
    );
  }
  return (
    <p className="flex gap-1 items-end text-sm text-[#808080]">
      &#91;Excluído pelo autor&#93;
    </p>
  );
};

const CommentOptions = ({
  comment,
  setIsDeleted,
  isEditingState,
}: {
  comment: CommentsSafe;
  setIsDeleted: (value: boolean) => void;
  isEditingState: [
    isEditing: boolean,
    setIsEditing: Dispatch<SetStateAction<boolean>>
  ];
}) => {
  const { loggedProfile } = useProfile();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = isEditingState;

  return (
    loggedProfile &&
    !comment.is_deleted && (
      <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <PopoverTrigger className={buttonVariants()}>
          <OptionIcon />
        </PopoverTrigger>
        <PopoverContent className="[&_button]:rounded-xs">
          <EditComment
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setIsMenuOpen={setIsMenuOpen}
          />
          <DeleteComment commentId={comment.id} setIsDeleted={setIsDeleted} />
          <ReportComment
            loggedProfile={loggedProfile}
            profile={comment.profiles}
          />
        </PopoverContent>
      </Popover>
    )
  );
};

const EditComment = ({
  isEditing,
  setIsEditing,
  setIsMenuOpen,
}: {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  setIsMenuOpen: (value: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => {
      setIsMenuOpen(false);
      setIsEditing(!isEditing);
    }}
    tabIndex={0}
    className={cn(
      "w-full flex justify-between items-center p-2 cursor-pointer hover:bg-neutral-800 outline-none transition-all duration-300 focus-visible:text-neutral-100 focus-visible:bg-neutral-800/50",
      focusVisibleWhiteRing
    )}
  >
    Editar
    <EditIcon className="size-[14px]" />
  </button>
);

const DeleteComment = ({
  commentId,
  setIsDeleted,
}: {
  commentId: string;
  setIsDeleted: (value: boolean) => void;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const commentContext = useComment();
  const removeComments = commentContext?.removeComments; // Delete locally (client side). Alters the provider state
  const deleteCommentFn = useAsyncFn(deleteComment, [], false); // Delete remotelly (server side). Alters the database state

  const onCommentDelete = async () => {
    return deleteCommentFn
      .execute({
        id: commentId,
      })
      .then(() => {
        removeComments(commentId);
        toast("Comentário deletado!");
        setIsDialogOpen(false);
        setIsDeleted(true);
      })
      .catch((e) => {
        console.error(e);
        toast("Erro ao tentar deletar o comentário");
      })
      .finally(() => setIsDeleted(true));
  };

  return (
    <AlertDialog open={isDialogOpen}>
      <AlertDialogTrigger
        onClick={() => setIsDialogOpen(true)}
        className={cn(
          "w-full p-2 cursor-pointer hover:bg-neutral-800 outline-none transition-all duration-300 focus-visible:text-neutral-100 focus-visible:bg-neutral-800/50",
          focusVisibleWhiteRing
        )}
      >
        <p className="flex justify-between items-center">
          Deletar
          <DeleteIcon className="size-[14px]" />
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between bg-neutral-950">
            Deletar comentário?
            <AlertDialogCancel
              className="has-[>svg]:px-1 h-fit py-1"
              onClick={() => setIsDialogOpen(false)}
            >
              <CancelIcon />
            </AlertDialogCancel>
          </AlertDialogTitle>
          <AlertDialogDescription className="min-h-20 text-warning flex items-center gap-2 border-y border-neutral-700">
            <AlertIcon className="size-5" />
            Essa ação não poderá ser desfeita!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center gap-2 bg-neutral-950">
          <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            type="button"
            onClick={onCommentDelete}
            className={buttonVariants({ variant: "destructive" })}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// TODO
const ReportComment = ({
  loggedProfile,
  profile,
}: {
  loggedProfile: Profile | null;
  profile: ProfileSafe;
}) => {
  const isNotCommentOwner = loggedProfile?.id !== profile.id;
  return (
    isNotCommentOwner && (
      <div>
        Reportar
        <ReportIcon />
      </div>
    )
  );
};

export default CommentAvatarRow;
