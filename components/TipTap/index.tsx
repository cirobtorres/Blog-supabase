"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Dispatch, SetStateAction, useEffect } from "react";
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
    extensions: [Document, Text, Paragraph, Bold],
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
        <div className="button-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={"cursor-pointer rounded p-1 border border-neutral-700".concat(
              editor.isActive("bold") ? " bg-neutral-700" : " bg-neutral-800"
            )}
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
        className="[&_.tiptap.ProseMirror]:min-h-[calc(1.5rem_*_15)] [&_.tiptap.ProseMirror]:p-2 rounded border border-neutral-700 bg-neutral-800"
      />
    </>
  );
};

export default Tiptap;
