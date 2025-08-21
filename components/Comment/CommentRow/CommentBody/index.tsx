import { CommentEditor } from "../../CommentEditor";

export default function CommentBody({
  id,
  commentBody,
  isEditing,
  setIsEditing,
  onSubmit,
}: {
  id: string;
  commentBody: string;
  isEditing: boolean;
  setIsEditing: () => void;
  onSubmit: (body: string) => Promise<void>;
}) {
  return isEditing ? (
    <CommentEditor
      autoFocus
      id={id}
      initialContent={commentBody}
      className="[&_p]:break-words [&_p:not(:last-child)]:mb-4 last:[&_p]:mb-0 text-sm"
      cancel={setIsEditing}
      onSubmit={onSubmit}
    />
  ) : (
    <div
      dangerouslySetInnerHTML={{ __html: commentBody }}
      className="[&_p]:break-words [&_p:not(:last-child)]:mb-4 last:[&_p]:mb-0 text-sm py-2 text-neutral-300 border-b border-neutral-800"
    />
  );
}
