import { FormEvent, useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import CharacterCount from "@tiptap/extension-character-count";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/utils/classnames";
import Placeholder from "@tiptap/extension-placeholder";
import { LoadingSpinning } from "../../LoadingSpinning";

export const CommentEditor = ({
  id,
  onSubmit,
  autoFocus = false,
  initialContent = "",
  characterLimit = 512,
  className,
  cancel,
}: {
  id: string;
  onSubmit: (body: string) => Promise<void> | void;
  autoFocus?: boolean;
  initialContent?: string | undefined;
  characterLimit?: number;
  className?: string;
  cancel?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { loggedProfile } = useProfile();
  const isAuthenticated = !!loggedProfile?.username;
  const openFooter = isOpen && isAuthenticated;
  const uniqueKey = autoFocus
    ? `editor-${id}-editing${"-" + String(autoFocus)}`
    : `editor-${id}`;
  const editorClassNames = cn(
    `relative w-full h-full ` +
      `text-left text-sm text-neutral-300 ` +
      `[scrollbar-width:none] [-ms-overflow-style:none] [&_.tiptap.ProseMirror]:py-2 ` +
      `border-b border-neutral-800 ` +
      `after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 ` +
      `after:h-[2px] after:w-0 focus-within:after:w-full ` +
      `after:bg-theme-color focus-within:after:duration-200 `,
    className
  );

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        Document,
        Paragraph,
        Text,
        History,
        Placeholder.configure({
          placeholder: "Comente aqui...",
          emptyEditorClass: "is-editor-empty",
          showOnlyCurrent: true,
        }),
        CharacterCount.configure({
          limit: characterLimit,
        }),
      ],
      onCreate: ({ editor }) => {
        if (autoFocus) {
          const lastCharacter = editor.state.doc.content.size;
          requestAnimationFrame(() => {
            editor.chain().focus().setTextSelection(lastCharacter).run();
          });
        }
      },
      editable: isAuthenticated,
      editorProps: {
        attributes: {
          class: `outline-none [&_h4]:text-2xl [&_h4]:font-extrabold`,
        },
      },
      content: initialContent,
    },
    [isAuthenticated]
  );

  if (!editor) return <LoadingSpinning loadingState={true} />;

  const closeEditorFunc = () => {
    editor.commands.clearContent();
    editor.commands.blur();
    setIsOpen(false);
    if (cancel) cancel();
  };

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let contentHTML = editor.getHTML();

    // Remove every empty <p></p> in contentHTML
    contentHTML = contentHTML.replace(/<p>(\s|&nbsp;)*<\/p>/g, "");
    if (!contentHTML || contentHTML.trim() === "") {
      setIsOpen(false);

      // Safeguard. Prevents saving empty comments
      return;
    }
    await onSubmit(contentHTML);
    editor.commands.clearContent();
    setIsOpen(false);
  };

  const handleEditorOnFocus = () => {
    setIsOpen(true);
    const lastCharacter = editor.state.doc.content.size;
    editor.chain().focus().setTextSelection(lastCharacter).run();
  };

  return (
    <>
      <form onSubmit={handleOnSubmit} className="w-full flex flex-col shrink-0">
        <EditorContent
          key={uniqueKey}
          id={uniqueKey}
          name={uniqueKey}
          editor={editor}
          onFocus={handleEditorOnFocus}
          className={editorClassNames}
        />
        <EditorFooter
          editor={editor}
          openFooter={openFooter}
          characterLimit={characterLimit}
          closeEditorFunc={closeEditorFunc}
        />
      </form>
    </>
  );
};

const EditorFooter = ({
  editor,
  openFooter,
  characterLimit,
  closeEditorFunc,
}: {
  editor: Editor;
  openFooter: boolean;
  characterLimit: number;
  closeEditorFunc: () => void;
}) => {
  const characterCount = editor.storage.characterCount.characters();
  const wordCount = editor.storage.characterCount.words();

  return (
    <div className="h-8 flex shrink-0 mt-2 max-[550px]:h-16 max-[550px]:flex-col">
      <div className="flex-1 flex items-center gap-4 max-[550px]:justify-center max-[550px]:items-start">
        <CharCount
          characterCount={characterCount}
          characterLimit={characterLimit}
        />
        <WordCound wordCount={wordCount} />
      </div>
      {openFooter && (
        <div className="flex gap-1 max-[550px]:justify-center max-[550px]:flex-1">
          <CancelButton closeEditorFunc={closeEditorFunc} />
          <ConfirmButton disable={editor.isEmpty} />
        </div>
      )}
    </div>
  );
};

const CharCount = ({
  characterCount,
  characterLimit,
}: {
  characterCount: number;
  characterLimit: number;
}) => (
  <p className="text-sm text-[#808080]">
    Caracteres: {characterCount} / {characterLimit}
  </p>
);

const WordCound = ({ wordCount }: { wordCount: number }) => (
  <p className="text-sm text-[#808080]">Palavras: {wordCount}</p>
);

const CancelButton = ({ closeEditorFunc }: { closeEditorFunc: () => void }) => {
  return (
    <button
      type="button"
      className={
        `w-24 shrink-0 cursor-pointer rounded px-3 outline-none ` +
        `text-neutral-400 hover:text-neutral-100 ` +
        `border border-neutral-800 focus-within:border-neutral-700 hover:border-neutral-700 ` +
        `hover:bg-neutral-800 focus-within:bg-neutral-800 ` +
        `focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] ` +
        `transition-all `
      }
      onClick={closeEditorFunc}
    >
      Cancelar
    </button>
  );
};

const ConfirmButton = ({ disable }: { disable: boolean }) => {
  return (
    <button
      type="submit"
      className={`transition-all shrink-0 w-24 rounded px-3 border ${
        disable
          ? "bg-[#3a3a3a] text-[#919191] border-[#646464]"
          : "cursor-pointer bg-neutral-900 border-neutral-800 text-theme-color hover:border-neutral-700 hover:bg-neutral-800 outline-none focus-within:border-neutral-700 focus-within:bg-neutral-800 focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
      }`}
      disabled={disable}
    >
      Comentar
    </button>
  );
};
