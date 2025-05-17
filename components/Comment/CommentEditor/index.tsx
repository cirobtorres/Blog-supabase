import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import CharacterCount from "@tiptap/extension-character-count";
// import Placeholder from "@tiptap/extension-placeholder";

const characterLimit = 512;

export const CommentEditor = ({
  profile,
  autoFocus = false,
  initialContent = "",
  onSubmit,
  cancel,
}: {
  profile: Profile | null;
  autoFocus?: boolean;
  initialContent?: string | undefined;
  onSubmit: (body: string) => Promise<void>;
  cancel?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = !!profile?.username;

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        Document,
        Paragraph,
        Text,
        History,
        // Placeholder.configure({
        //   placeholder: "Contribua com um comentário...",
        //   emptyEditorClass: "is-editor-empty",
        //   showOnlyCurrent: true,
        // }),
        CharacterCount.configure({
          limit: characterLimit,
        }),
      ],
      autofocus: autoFocus,
      editable: isAuthenticated,
      editorProps: {
        attributes: {
          class: "outline-none [&_h4]:text-2xl [&_h4]:font-extrabold", // [&_*:not(:last-child)]:mb-4
        },
      },
      content: initialContent,
    },
    [isAuthenticated]
  );

  if (!editor) {
    return <p>Loading...</p>;
  }

  const lastCharacterIndex = editor.getHTML().length;

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          let contentHTML = editor.getHTML();
          contentHTML = contentHTML.replace(/<p>(\s|&nbsp;)*<\/p>/g, ""); // Remove every empty <p></p> in contentHTML
          if (!contentHTML || contentHTML.trim() === "") {
            setIsOpen(false);
            return; // Safeguard. Prevents saving empty comments
          }
          await onSubmit(contentHTML);
          editor.commands.clearContent();
          setIsOpen(false);
        }}
        className="w-full flex flex-col shrink-0"
      >
        <EditorContent
          key={isAuthenticated ? "logged-in" : "logged-out"}
          editor={editor}
          autoFocus={autoFocus}
          id="content"
          name="content"
          onFocus={() => {
            setIsOpen(true);
            // Cursor on the last element position:
            editor.chain().focus().setTextSelection(lastCharacterIndex).run();
          }}
          className="relative text-left w-full h-full text-sm [scrollbar-width:none] [-ms-overflow-style:none] p-2 rounded-t-md border border-neutral-800 bg-neutral-900 group"
        >
          <div className="absolute top-[calc(100%)] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-theme-color group-focus-within:w-full group-focus-within:duration-200" />
        </EditorContent>
        <div className="h-8 flex shrink-0 mt-2 max-[550px]:h-16 max-[550px]:flex-col">
          <div className="flex-1 flex items-center gap-4 max-[550px]:justify-center max-[550px]:items-start">
            <p className="text-sm text-[#808080]">
              Caracteres: {editor.storage.characterCount.characters()} /{" "}
              {characterLimit}
            </p>
            <p className="text-sm text-[#808080]">
              Palavras: {editor.storage.characterCount.words()}
            </p>
          </div>
          {isOpen && isAuthenticated && (
            <div className="flex gap-1 max-[550px]:justify-center max-[550px]:flex-1">
              <button
                type="button"
                className="transition-all cursor-pointer shrink-0 w-28 rounded px-3 border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-100 hover:bg-neutral-800 outline-none focus-within:border-neutral-700 focus-within:bg-neutral-800 focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
                onClick={() => {
                  editor.commands.clearContent();
                  editor.commands.blur();
                  setIsOpen(false);
                  if (cancel) cancel();
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`transition-all shrink-0 w-28 rounded px-3 border ${
                  editor.isEmpty
                    ? "bg-[#3a3a3a] text-[#919191] border-[#646464]"
                    : "cursor-pointer bg-neutral-900 border-neutral-800 text-theme-color hover:border-neutral-700 hover:bg-neutral-800 outline-none focus-within:border-neutral-700 focus-within:bg-neutral-800 focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
                }`}
                disabled={editor.isEmpty}
              >
                Comentar
              </button>
            </div>
          )}
        </div>
      </form>
    </>
  );
};
