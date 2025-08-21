import { useProfile } from "@/hooks/useProfile";
import { convertDateToYouTubeLike } from "@/utils/dates";
import { useMemo } from "react";

const DatetimeFormater = ({
  createdAt,
  updatedAt,
}: {
  createdAt: Date;
  updatedAt: Date;
}) => {
  return (
    <>
      <span className="text-[#808080]">
        {useMemo(() => convertDateToYouTubeLike(createdAt), [createdAt])}
      </span>
      <span className="text-[#808080]">
        {updatedAt > createdAt && "(editado)"}
      </span>
    </>
  );
};

const CommentSubHeader = ({ comment }: { comment: Comments }) => {
  const { loggedProfile } = useProfile();
  return (
    <p
      className={`flex gap-1 items-end text-sm ${
        comment.profile_id
          ? comment.profile_id === loggedProfile?.id
            ? "text-theme-color"
            : "text-neutral-200"
          : "text-[#808080]"
      }`}
    >
      {comment.profiles.username || "[usuário excluído]"}
      {comment.profiles ? (
        <DatetimeFormater
          createdAt={comment.created_at}
          updatedAt={comment.updated_at}
        />
      ) : null}
    </p>
  );
};

export default CommentSubHeader;
