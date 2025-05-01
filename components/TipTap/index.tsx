"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Dispatch, SetStateAction, useEffect } from "react";

const Tiptap = ({
  id,
  setVal,
  typography = "paragraph",
  defaultValue,
  autoFocus = false,
  height,
}: {
  id: string;
  setVal: Dispatch<SetStateAction<string>>;
  typography?: "heading" | "paragraph";
  defaultValue?: string;
  autoFocus?: boolean;
  height?: string;
}) => {
  const defaultContent =
    defaultValue || (typography === "heading" ? "<h2></h2>" : "<p></p>");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Text,
      ...(typography === "paragraph"
        ? [Paragraph]
        : [
            Heading.configure({
              levels: [2],
            }),
          ]),
    ],
    autofocus: autoFocus,
    content: defaultContent,
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
      className={"bg-neutral-900 ".concat(height || "")}
    />
  );
};

export default Tiptap;
