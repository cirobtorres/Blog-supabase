import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import History from "@tiptap/extension-history";
import { cn } from "../../../utils/classnames";
import { LoadingSpinning } from "../../LoadingSpinning";
import { focusWithinWhiteRing } from "../../../styles/classNames";

export default function TipTapQuoteEditor({
  id,
  setVal,
  defaultValue,
  autoFocus = false,
}: {
  id: string;
  setVal: (data: string) => void;
  defaultValue?: string;
  autoFocus?: boolean;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [Document, Paragraph, Text, History],
    autofocus: autoFocus,
    content: defaultValue,
    onUpdate: ({ editor }) => setVal(editor.getHTML()),
  });

  useEffect(() => {
    if (editor) {
      setVal(editor.getHTML());
    }
  }, [editor]);

  if (!editor) {
    return <LoadingSpinning loadingState={true} />;
  }

  return (
    <EditorContent
      id={id}
      name={id}
      editor={editor}
      autoComplete="new-password"
      defaultValue={defaultValue}
      spellCheck={false}
      onFocus={() => editor.chain().selectTextblockEnd().focus()}
      className={cn(
        "p-1 flex flex-col transition-all duration-300 [&_p]:text-sm [&_p]:text-neutral-400 [&_strong]:text-neutral-400 [&_p_strong]:text-neutral-300 rounded-xs border border-neutral-700 [&_p_a]:text-theme-color [&_p_a]:underline [&_p_a]:bg-neutral-700 [&_p_a]:hover:text-theme-link [&_p_a]:border [&_p_a]:border-neutral-600 [&_p_a]:px-1 [&_p_a]:py-0.5 [&_p_a]:rounded-md [&_p_mark]:text-neutral-100 [&_p_mark]:bg-neutral-700 [&_p_mark]:border [&_p_mark]:border-neutral-600 [&_p_mark]:px-1 [&_p_mark]:py-0.5 [&_p_mark]:rounded-md [&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:pb-6 [&_h3]:text-2xl [&_h4]:text-xl [&_h3]:pb-6 [&_h4]:pb-6 [&_ul]:pb-6 [&_ul_li:last-child_p]:pb-0 [&_ul]:ml-5 [&_ul_li]:list-disc [&_ol]:pb-6 [&_ol_li:last-child_p]:pb-0 [&_ol]:ml-5 [&_ol_li]:list-decimal bg-neutral-900 [&_.tiptap.ProseMirror]:h-full [&_.tiptap.ProseMirror]:min-h-[calc(14px_+_16px_+_8px)] [&_.tiptap.ProseMirror]:max-h-[calc(20px_*_5_+_16px_+_8px)] [&_.tiptap.ProseMirror]:overflow-y-auto  [&_.tiptap.ProseMirror]:p-2 [&_.tiptap.ProseMirror]:pr-6 [&_.tiptap.ProseMirror]:outline-none [&_.tiptap.ProseMirror]:transition-all",
        focusWithinWhiteRing
      )}
    />
  );
}
