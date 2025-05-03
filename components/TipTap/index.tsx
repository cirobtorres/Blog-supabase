"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Dispatch, SetStateAction, useEffect } from "react";

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
    extensions: [Document, Text, Paragraph],
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
    <EditorContent
      id={id}
      name={id}
      editor={editor}
      autoComplete="new-password"
      defaultValue={defaultValue}
      onFocus={() => {
        editor.chain().focus().setTextSelection(lastCharacterIndex).run();
      }}
      className="[&_.tiptap.ProseMirror]:min-h-[calc(1.5rem_*_10)] bg-neutral-900"
    />
  );
};

export default Tiptap;
