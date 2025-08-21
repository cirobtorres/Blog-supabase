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
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProfile } from "@/hooks/useProfile";
import { clientDeleteComment } from "@/services/comment";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export default function CommentOptions({
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
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = isEditingState;
  const { loggedProfile } = useProfile();

  return (
    loggedProfile && (
      <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <PopoverTrigger
          className={`relative p-2 size-10 cursor-pointer hover:bg-neutral-800 rounded-full outline-transparent transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-800/50 ${
            isMenuOpen ? "bg-neutral-800" : ""
          }`}
        >
          <OptionIcon />
        </PopoverTrigger>
        <PopoverContent>
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
}

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
    className="w-full flex justify-between items-center p-2 cursor-pointer rounded-md hover:bg-neutral-800 outline-transparent transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-800/50"
  >
    Editar
    <EditIcon />
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

  return (
    <AlertDialog open={isDialogOpen}>
      <AlertDialogTrigger
        onClick={() => setIsDialogOpen(true)}
        className="w-full p-2 cursor-pointer rounded-md hover:bg-neutral-800 outline-transparent transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-800/50"
      >
        <div className="flex justify-between items-center">
          Deletar
          <DeleteIcon />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            Deletar artigo?
            <AlertDialogCancel
              className="has-[>svg]:px-1 h-fit py-1"
              onClick={() => setIsDialogOpen(false)}
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
                className="lucide lucide-x-icon lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </AlertDialogCancel>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-warning flex items-center gap-2 border-y border-neutral-800 bg-neutral-950">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-octagon-alert-icon lucide-octagon-alert"
            >
              <path d="M12 16h.01" />
              <path d="M12 8v4" />
              <path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z" />
            </svg>
            Essa ação não poderá ser desfeita!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center gap-2">
          <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            type="button"
            onClick={() => {
              clientDeleteComment({ id: commentId });
              toast("Comentário deletado!");
              setIsDeleted(true);
            }}
            className={buttonVariants({ variant: "destructive" })}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ReportComment = ({
  loggedProfile,
  profile,
}: {
  loggedProfile: Profile | null;
  profile: Profile;
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

const OptionIcon = () => (
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
    className="lucide lucide-ellipsis-vertical absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const ReportIcon = () => (
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
    className="lucide lucide-flag-icon lucide-flag"
  >
    <path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" />
  </svg>
);

const EditIcon = () => (
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
    className="lucide lucide-pencil-icon lucide-pencil"
  >
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    <path d="m15 5 4 4" />
  </svg>
);

const DeleteIcon = () => (
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
    className="lucide lucide-trash2-icon lucide-trash-2"
  >
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
