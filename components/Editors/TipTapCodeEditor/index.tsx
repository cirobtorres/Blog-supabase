import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import { cn } from "../../../utils/classnames";
import { LoadingSpinning } from "../../LoadingSpinning";
import LanguageSelect from "./LanguageSelect";
import CustomCodeBlockShiki from "./customShiki";

export default function TipTapCodeEditor({
  id,
  setVal,
  setLanguage,
  defaultCode,
  defaultlanguage,
  autoFocus = false,
}: {
  id: string;
  setVal: (data: string) => void;
  setLanguage: (data: string) => void;
  defaultCode?: string;
  defaultlanguage?: string;
  autoFocus?: boolean;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    content: defaultCode,
    autofocus: autoFocus,
    extensions: [
      Document,
      Text,
      History,
      CustomCodeBlockShiki.configure({
        defaultTheme: "dark-plus",
        defaultLanguage: "ts",
        languageClassPrefix: "language-",
        exitOnTripleEnter: false,
      }),
    ],
    onUpdate: ({ editor }) => setVal(editor.getHTML()),
  });

  useEffect(() => {
    if (editor) {
      const chain = editor.chain();
      // if (autoFocus) chain.focus();
      chain.updateAttributes("codeBlock", { language: "ts" }).run();
      setVal(editor.getHTML());
      return () => editor?.destroy();
    }
  }, [editor]);

  if (!editor) {
    return <LoadingSpinning loadingState={true} />;
  }

  const onLanguageChange = (lang: string) => {
    editor
      .chain()
      .focus()
      .updateAttributes("codeBlock", { language: lang })
      .run();
    setLanguage(lang);
  };

  return (
    <div className="relative">
      <LanguageSelect
        defaultlanguage={defaultlanguage}
        callback={onLanguageChange}
      />
      <EditorContent
        id={id}
        name={id}
        editor={editor}
        autoComplete="new-password"
        spellCheck={false}
        onFocus={() => editor.chain().selectTextblockEnd().focus()}
        className={cn(
          "p-1 flex flex-col transition-all duration-300 rounded-xs border border-neutral-700 [&_.tiptap.ProseMirror]:max-h-[calc(20px_*_20_+_16px_+_8px)] [&_.tiptap.ProseMirror]:min-h-[44px] [&_.tiptap.ProseMirror]:h-full [&_.tiptap.ProseMirror]:overflow-y-auto [&_.tiptap.ProseMirror]:p-2 [&_.tiptap.ProseMirror]:pr-6 [&_.tiptap.ProseMirror]:outline-none [&_.tiptap.ProseMirror]:transition-all [&_.tiptap.ProseMirror]:[background-color:rgb(30,30,30)] [background-color:rgb(30,30,30)!important]"
        )}
      />
    </div>
  );
}
