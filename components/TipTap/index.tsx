"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";

const Tiptap = ({
  id,
  setVal,
  defaultValue,
  autoFocus = false,
}: {
  id: string;
  setVal: Dispatch<SetStateAction<string>>;
  defaultValue?: string;
  autoFocus?: boolean;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Text,
      Paragraph,
      Bold,
      Heading.configure({
        levels: [2, 3, 4],
      }),
    ],
    autofocus: autoFocus,
    content: defaultValue,
    onUpdate: ({ editor }) => setVal(editor.getHTML()),
  });

  useEffect(() => {
    if (editor) {
      const html = editor.getHTML();
      setVal((prev) => (prev ? prev : html));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) {
    return <p>Loading...</p>;
  }

  const lastCharacterIndex = editor.getHTML().length;

  return (
    <>
      <div className="control-group">
        <div
          className="flex gap-1 items-center mb-1" // button-group
        >
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={"flex justify-center items-center size-7 cursor-pointer rounded border border-neutral-700".concat(
              editor.isActive("heading", { level: 2 })
                ? " bg-neutral-700"
                : " bg-neutral-800"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heading2-icon lucide-heading-2"
            >
              <path d="M4 12h8" />
              <path d="M4 18V6" />
              <path d="M12 18V6" />
              <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={"flex justify-center items-center size-7 cursor-pointer rounded border border-neutral-700".concat(
              editor.isActive("heading", { level: 3 })
                ? " bg-neutral-700"
                : " bg-neutral-800"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heading3-icon lucide-heading-3"
            >
              <path d="M4 12h8" />
              <path d="M4 18V6" />
              <path d="M12 18V6" />
              <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
              <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={"flex justify-center items-center size-7 cursor-pointer rounded border border-neutral-700".concat(
              editor.isActive("heading", { level: 4 })
                ? " bg-neutral-700"
                : " bg-neutral-800"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heading4-icon lucide-heading-4"
            >
              <path d="M12 18V6" />
              <path d="M17 10v3a1 1 0 0 0 1 1h3" />
              <path d="M21 10v8" />
              <path d="M4 12h8" />
              <path d="M4 18V6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={"flex justify-center items-center size-7 cursor-pointer rounded border border-neutral-700".concat(
              editor.isActive("bold") ? " bg-neutral-700" : " bg-neutral-800"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bold-icon lucide-bold"
            >
              <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
            </svg>
          </button>
        </div>
      </div>
      <EditorContent
        id={id}
        name={id}
        editor={editor}
        autoComplete="new-password"
        defaultValue={defaultValue}
        onFocus={() => {
          editor.chain().focus().setTextSelection(lastCharacterIndex).run();
        }}
        className="article-typography [&_.tiptap.ProseMirror]:min-h-[calc(1.5rem_*_15)] [&_.tiptap.ProseMirror]:p-2 rounded border border-neutral-700 bg-neutral-800"
      />
    </>
  );
};

export default Tiptap;
