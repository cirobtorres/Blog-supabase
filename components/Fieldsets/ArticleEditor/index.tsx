"use client";

import {
  ActionDispatch,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useEditor, EditorContent, getMarkRange } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
import History from "@tiptap/extension-history";
import Highlight from "@tiptap/extension-highlight";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Link, { LinkProtocolOptions } from "@tiptap/extension-link";
import type { BundledLanguage } from "shiki";
import CodeBlockShiki from "tiptap-extension-code-block-shiki";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { FloatingInput } from "..";
import { buttonVariants } from "../../ui/button";
import { cn } from "../../../utils/classnames";
import {
  BoldIcon,
  BulletListIcon,
  CancelIcon,
  HeaderH2Icon,
  HeaderH3Icon,
  HeaderH4Icon,
  HighlightIcon,
  LinkIcon,
  OrderedListIcon,
  DownloadIcon,
  TrashBinIcon,
  UploadIcon,
} from "@/components/Icons";
import ToolTipWrapper from "@/components/ui/tooltip";
import { LoadingSpinning } from "@/components/LoadingSpinning";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCodeBlockLanguage } from "@/utils/strings";
import Image from "next/image";
import { comercialDate } from "@/utils/dates";

// ------------------------------==========TEXT==========------------------------------
const validateAllowedUri = (
  url: string,
  ctx: {
    defaultValidate: (url: string) => boolean;
    protocols: Array<LinkProtocolOptions | string>;
    defaultProtocol: string;
  }
) => {
  try {
    const parsedUrl = url.includes(":")
      ? new URL(url)
      : new URL(`${ctx.defaultProtocol}://${url}`);

    // Tiptap general validation
    if (!ctx.defaultValidate(parsedUrl.href)) {
      return false; // Invalid URL
    }

    const disallowedDomains = [""]; // TODO (Tiptap link disallowedDomains)
    const domain = parsedUrl.hostname;

    const disallowedProtocols = ["ftp", "file", "mailto"];
    const protocol = parsedUrl.protocol.replace(":", "");

    const allowedProtocols = ctx.protocols.map((p) =>
      typeof p === "string" ? p : p.scheme
    );

    if (disallowedProtocols.includes(protocol)) {
      return false; // Not allowed
    }
    if (!allowedProtocols.includes(protocol)) {
      return false; // Not allowed
    }
    if (disallowedDomains.includes(domain)) {
      return false; // Not allowed
    }

    return true; // all checks have passed
  } catch {
    return false;
  }
};

const validateAllowedAutoLink = (url: string) => {
  try {
    const parsedUrl = url.includes(":")
      ? new URL(url)
      : new URL(`https://${url}`);

    const disallowedDomains = [""]; // TODO (Tiptap link disallowedDomains)
    const domain = parsedUrl.hostname;

    return !disallowedDomains.includes(domain);
  } catch {
    return false;
  }
};

const getClassName = (func: boolean) =>
  `flex justify-center items-center outline-none transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[3px] ${
    func
      ? "text-theme-color border-neutral-600 bg-neutral-700 hover:bg-neutral-600"
      : "border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 bg-neutral-800"
  }`;

export const TipTapTextEditor = ({
  id,
  setVal,
  defaultValue,
  autoFocus = false,
}: {
  id: string;
  setVal: (data: any) => void;
  defaultValue?: string;
  autoFocus?: boolean;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [textLinkInput, setTextLinkInput] = useState("");
  const [linkInput, setLinkInput] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Paragraph,
      Text,
      History,
      Bold,
      Highlight,
      BulletList,
      OrderedList,
      ListItem,
      Heading.configure({
        levels: [2, 3, 4],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => validateAllowedUri(url, ctx),
        shouldAutoLink: (url) => validateAllowedAutoLink(url),
      }),
    ],
    autofocus: autoFocus,
    content: defaultValue,
    onUpdate: ({ editor }) => setVal(editor.getHTML()),
  });

  useEffect(() => {
    if (editor) {
      setVal(editor.getHTML());
    }
  }, [editor]);

  const updateLink = useCallback(() => {
    if (!editor || !editor.view || !editor.state || !editor.commands) {
      console.warn("Editor não está disponível no momento da atualização.");
      return;
    }

    try {
      const { state, schema } = editor;
      const { selection } = state;
      const { from } = selection;
      const $from = state.doc.resolve(from);
      const linkMark = schema.marks.link;

      const range = getMarkRange($from, linkMark);

      if (range) {
        editor
          .chain()
          .focus()
          .insertContentAt(
            { from: range.from, to: range.to },
            {
              type: "text",
              text: textLinkInput || linkInput,
              marks: [
                {
                  type: "link",
                  attrs: { href: linkInput },
                },
              ],
            }
          )
          .run();
      } else {
        // Fallback: se não houver range de link, apenas atualiza o href
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: linkInput })
          .run();
      }
    } catch (e) {
      console.error("Erro ao atualizar link:", e);
    }
  }, [editor, linkInput, textLinkInput]);

  const setLink = useCallback(() => {
    if (!editor) return;

    // Empty
    if (linkInput === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    if (textLinkInput && textLinkInput.trim() !== "") {
      editor
        .chain()
        .focus()
        .insertContentAt(editor.state.selection, {
          type: "text",
          text: textLinkInput,
          marks: [
            {
              type: "link",
              attrs: {
                href: linkInput,
              },
            },
          ],
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkInput })
        .run();
    }
  }, [editor, linkInput, textLinkInput]);

  const getKeyboardSelection = () => {
    if (!editor) return "";

    const { state } = editor;
    const { selection } = state;

    // If keyboard cursor is left inside <a></a>
    const { from, to } = selection;
    const $from = state.doc.resolve(from);

    const range = getMarkRange($from, state.schema.marks.link);

    if (range) {
      return state.doc.textBetween(range.from, range.to, " ");
    }

    // Fallback: selected text
    return state.doc.textBetween(from, to, " ");
  };

  const getKeyboardSelectionUrl = () => {
    if (!editor) return "";

    const { state } = editor;
    const { from } = state.selection;
    const $from = state.doc.resolve(from);

    const linkMark = state.schema.marks.link;
    const range = getMarkRange($from, linkMark);

    if (range) {
      const node = state.doc.nodeAt(range.from);
      if (node) {
        const mark = node.marks.find((m) => m.type.name === "link");
        return mark?.attrs.href || "";
      }
    }

    return "";
  };

  const handleLinkClick = () => {
    const selectedText = getKeyboardSelection();
    setTextLinkInput(selectedText || "");
    const selectedUrl = getKeyboardSelectionUrl();
    setLinkInput(selectedUrl);
    setIsDialogOpen(true);
  };

  if (!editor) {
    return <LoadingSpinning loadingState={true} />;
  }

  return (
    <>
      <div
        className="w-full flex gap-4 items-center pb-1" // border-y border-neutral-800
      >
        <div className="flex gap-1 items-center">
          <ToolTipWrapper tooltip="Header H2">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={getClassName(editor.isActive("heading", { level: 2 }))}
            >
              <HeaderH2Icon size={28} />
            </button>
          </ToolTipWrapper>
          <ToolTipWrapper tooltip="Header H3">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={getClassName(editor.isActive("heading", { level: 3 }))}
            >
              <HeaderH3Icon size={28} />
            </button>
          </ToolTipWrapper>
          <ToolTipWrapper tooltip="Header H4">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              className={getClassName(editor.isActive("heading", { level: 4 }))}
            >
              <HeaderH4Icon size={28} />
            </button>
          </ToolTipWrapper>
        </div>
        <div className="flex gap-1 items-center">
          <ToolTipWrapper tooltip="Negrito">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={getClassName(editor.isActive("bold"))}
            >
              <BoldIcon size={28} />
            </button>
          </ToolTipWrapper>
          <ToolTipWrapper tooltip="Realce">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={getClassName(editor.isActive("highlight"))}
            >
              <HighlightIcon size={28} />
            </button>
          </ToolTipWrapper>
          <AlertDialog open={isDialogOpen}>
            <AlertDialogTrigger asChild>
              <ToolTipWrapper tooltip="Hiperlink">
                <button
                  type="button"
                  tabIndex={0}
                  onClick={handleLinkClick}
                  className={getClassName(editor.isActive("link"))}
                >
                  <LinkIcon size={28} />
                </button>
              </ToolTipWrapper>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex justify-between items-center">
                  Hyperlink{" "}
                  <AlertDialogCancel
                    className="has-[>svg]:px-1 h-fit py-1"
                    onClick={() => {
                      setIsDialogOpen(false);
                      editor.chain().focus();
                    }}
                  >
                    <CancelIcon />
                  </AlertDialogCancel>
                </AlertDialogTitle>
                <AlertDialogDescription className="border-y border-neutral-800 bg-neutral-950">
                  Crie um texto para o hiperlink. Se você deixar o texto vazio,
                  o texto será o próprio link.
                </AlertDialogDescription>
                <div className="px-3">
                  <FloatingInput
                    id="text-link"
                    label="Texto"
                    value={textLinkInput}
                    setValue={(e) => setTextLinkInput(e.target.value)}
                  />
                  <FloatingInput
                    id="text-url"
                    label="URL"
                    value={linkInput}
                    setValue={(e) => setLinkInput(e.target.value)}
                  />
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex justify-between py-2">
                <div className="flex-1">
                  <AlertDialogCancel
                    onClick={() => {
                      setIsDialogOpen(false);
                      editor.chain().focus().unsetLink().run();
                    }}
                    className={cn(
                      "w-24",
                      buttonVariants({ variant: "default" })
                    )}
                  >
                    Remover
                  </AlertDialogCancel>
                </div>
                <div className="flex gap-1">
                  <AlertDialogCancel
                    onClick={() => {
                      setIsDialogOpen(false);
                    }}
                    className={cn(
                      "w-24",
                      buttonVariants({ variant: "default" })
                    )}
                  >
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setIsDialogOpen(false);
                      editor?.isActive("link") ? updateLink() : setLink();
                    }}
                    className={cn(
                      "w-24",
                      buttonVariants({ variant: "outline" })
                    )}
                  >
                    Salvar
                  </AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex gap-1 items-center">
          <ToolTipWrapper tooltip="Lista não ordenada">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={getClassName(editor.isActive("bulletList"))}
            >
              <BulletListIcon size={28} />
            </button>
          </ToolTipWrapper>
          <ToolTipWrapper tooltip="Lista ordenada">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={getClassName(editor.isActive("orderedList"))}
            >
              <OrderedListIcon size={28} />
            </button>
          </ToolTipWrapper>
        </div>
      </div>
      <EditorContent
        id={id}
        name={id}
        editor={editor}
        autoComplete="new-password"
        defaultValue={defaultValue}
        spellCheck={false}
        onFocus={() => editor.chain().selectTextblockEnd().focus()}
        className={
          `p-1 flex flex-col [&_p]:pb-6 [&_p]:text-base [&_p]:text-neutral-400 [&_strong]:text-neutral-400 ` +
          `[&_p_strong]:text-neutral-300 rounded border border-neutral-700 ` +
          `transition-all duration-300 focus-within:border-theme-color ` + // focus-within:ring-3 focus-within:ring-neutral-100
          `[&_p_a]:text-theme-color [&_p_a]:underline [&_p_a]:bg-neutral-700 [&_p_a]:hover:text-theme-link ` +
          `[&_p_a]:border [&_p_a]:border-neutral-600 [&_p_a]:px-1 [&_p_a]:py-0.5 [&_p_a]:rounded-md ` +
          `[&_p_mark]:text-neutral-100 [&_p_mark]:bg-neutral-700 [&_p_mark]:border [&_p_mark]:border-neutral-600 ` +
          `[&_p_mark]:px-1 [&_p_mark]:py-0.5 [&_p_mark]:rounded-md ` +
          `[&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:pb-6 ` +
          `[&_h3]:text-2xl [&_h4]:text-xl [&_h3]:pb-6 [&_h4]:pb-6 ` +
          `[&_ul]:pb-6 [&_ul_li:last-child_p]:pb-0 [&_ul]:ml-5 [&_ul_li]:list-disc ` +
          `[&_ol]:pb-6 [&_ol_li:last-child_p]:pb-0 [&_ol]:ml-5 [&_ol_li]:list-decimal ` +
          `[&_.tiptap.ProseMirror]:h-[320px] [&_.tiptap.ProseMirror]:overflow-y-auto  ` +
          `[&_.tiptap.ProseMirror]:p-2 [&_.tiptap.ProseMirror]:pr-6 [&_.tiptap.ProseMirror]:rounded-b-xs ` +
          `[&_.tiptap.ProseMirror]:outline-none [&_.tiptap.ProseMirror]:transition-all ` +
          `bg-neutral-900 `
        }
      />
    </>
  );
};

// ------------------------------==========QUOTE==========------------------------------
export const TipTapQuoteEditor = ({
  id,
  setVal,
  defaultValue,
}: {
  id: string;
  setVal: (data: any) => void;
  defaultValue?: string;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [Document, Paragraph, Text, History],
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
      className={
        `p-1 flex flex-col [&_p]:pb-6 [&_p]:text-base [&_p]:text-neutral-400 [&_strong]:text-neutral-400 ` +
        `[&_p_strong]:text-neutral-300 rounded border border-neutral-700 ` +
        `transition-all duration-300 focus-within:border-theme-color ` + // focus-within:ring-3 focus-within:ring-neutral-100
        `[&_p_a]:text-theme-color [&_p_a]:underline [&_p_a]:bg-neutral-700 [&_p_a]:hover:text-theme-link ` +
        `[&_p_a]:border [&_p_a]:border-neutral-600 [&_p_a]:px-1 [&_p_a]:py-0.5 [&_p_a]:rounded-md ` +
        `[&_p_mark]:text-neutral-100 [&_p_mark]:bg-neutral-700 [&_p_mark]:border [&_p_mark]:border-neutral-600 ` +
        `[&_p_mark]:px-1 [&_p_mark]:py-0.5 [&_p_mark]:rounded-md ` +
        `[&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:pb-6 ` +
        `[&_h3]:text-2xl [&_h4]:text-xl [&_h3]:pb-6 [&_h4]:pb-6 ` +
        `[&_ul]:pb-6 [&_ul_li:last-child_p]:pb-0 [&_ul]:ml-5 [&_ul_li]:list-disc ` +
        `[&_ol]:pb-6 [&_ol_li:last-child_p]:pb-0 [&_ol]:ml-5 [&_ol_li]:list-decimal ` +
        `[&_.tiptap.ProseMirror]:h-[312px] [&_.tiptap.ProseMirror]:overflow-y-auto  ` +
        `[&_.tiptap.ProseMirror]:p-2 [&_.tiptap.ProseMirror]:pr-6 [&_.tiptap.ProseMirror]:rounded-b-xs ` +
        `[&_.tiptap.ProseMirror]:outline-none [&_.tiptap.ProseMirror]:transition-all ` +
        `bg-neutral-900 `
      }
    />
  );
};

// ------------------------------==========CODE==========------------------------------
export const TipTapCodeEditor = ({
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
}) => {
  const editor = useEditor({
    immediatelyRender: false,
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
    autofocus: autoFocus,
    content: defaultCode,
    onUpdate: ({ editor }) => setVal(editor.getHTML()),
  });

  useEffect(() => {
    if (editor) {
      editor
        .chain()
        .focus()
        .updateAttributes("codeBlock", { language: "ts" })
        .run();
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
      <LanguageSelecter
        defaultlanguage={defaultlanguage}
        callback={onLanguageChange}
      />
      <EditorContent
        id={id}
        name={id}
        editor={editor}
        autoComplete="new-password"
        defaultValue={defaultCode}
        spellCheck={false}
        onFocus={() => editor.chain().selectTextblockEnd().focus()}
        className={
          `p-1 flex flex-col rounded border border-neutral-700 ` +
          `transition-all duration-300 focus-within:border-theme-color ` +
          `[&_.tiptap.ProseMirror]:h-[312px] [&_.tiptap.ProseMirror]:overflow-y-auto ` +
          `[&_.tiptap.ProseMirror]:p-2 [&_.tiptap.ProseMirror]:pr-6 [&_.tiptap.ProseMirror]:rounded-b-xs ` +
          `[&_.tiptap.ProseMirror]:outline-none [&_.tiptap.ProseMirror]:transition-all ` +
          `[&_.tiptap.ProseMirror]:[background-color:rgb(30,30,30)] [background-color:rgb(30,30,30)!important] ` +
          `bg-neutral-900 `
        }
      />
    </div>
  );
};

const languages: BundledLanguage[] = ["ts", "py", "kt", "java"];
const styleLang: BundledLanguage[] = ["css"];
const dbLang: BundledLanguage[] = ["sql"];

const convertBack = (lang?: string): BundledLanguage => {
  if (!lang) return "ts";
  switch (lang.toLocaleLowerCase()) {
    case "typescript":
      return "ts";
    case "python":
      return "py";
    case "kotlin":
      return "kt";
    case "java":
      return "java";
    case "sql":
      return "sql";
    case "css":
      return "css";
    default:
      return "ts";
  }
};

const LanguageSelecter = ({
  defaultlanguage,
  callback,
}: {
  defaultlanguage?: string;
  callback: (lang: string) => void;
}) => {
  const [lang, setLang] = useState<BundledLanguage | null | undefined>(
    convertBack(defaultlanguage) ?? "ts"
  );

  return (
    <Select
      value={lang ?? ""}
      onValueChange={(value) => {
        callback(value);
        setLang(value.toLocaleLowerCase() as BundledLanguage);
      }}
    >
      <SelectTrigger
        className={cn(
          "w-32 z-10 absolute top-2 right-4 py-1 px-3 rounded-[3px] bg-neutral-800 transition-ring duration-300",
          "data-[state=open]:text-theme-color data-[state=open]:bg-[#2b2b2b] "
        )}
      >
        <SelectValue placeholder={formatCodeBlockLanguage(lang)} />
      </SelectTrigger>
      <SelectContent className="w-40 transition-all duration-300 scrollbar focus-within:hover:ring-3 focus-within:hover:ring-neutral-100">
        <SelectGroup>
          <SelectLabel>Lógica</SelectLabel>
          {languages.sort().map((language) => (
            <SelectItem key={language} value={language}>
              {formatCodeBlockLanguage(language)}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Estilo</SelectLabel>
          {styleLang.sort().map((language) => (
            <SelectItem key={language} value={language}>
              {formatCodeBlockLanguage(language)}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Banco de Dados</SelectLabel>
          {dbLang.sort().map((language) => (
            <SelectItem key={language} value={language}>
              {formatCodeBlockLanguage(language)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const CustomCodeBlockShiki = CodeBlockShiki.extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      ArrowDown: ({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;
        const after = $from.after();

        if (after !== undefined) {
          // Evaluates the existance of a node
          return false; // Standard behavior to arrow down → just to navigate
        }

        return true; // Do not create another <pre><code></pre></code> tags
      },
      ArrowUp: ({ editor }) => {
        // Navigation (only)
        return false;
      },

      Enter: () => {
        // Break line (only)
        return false;
      },
    };
  },
});

// ------------------------------==========IMAGE==========------------------------------
const IMG_BTN_CLASSNAMES =
  `relative transition-ring duration-300 size-10 flex items-center justify-center cursor-pointer ` +
  `disabled:cursor-auto disabled:text-neutral-600 disabled:bg-neutral-800 ` +
  `focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-neutral-100 focus-visible:bg-neutral-800 ` +
  `hover:bg-neutral-800 ` +
  `active:bg-neutral-900 `;

const D_N_D_CLASSNAMES =
  `w-[70%] h-full p-2 shrink-0 ` +
  `after:absolute after:right-0 after:w-[1px] ` +
  `after:top-0 after:bottom-0 ` +
  `after:bg-neutral-700 `;

const initialState: ImageState = {
  preview: null,
  filename: null,
  size: null,
  type: "--",
  width: null,
  height: null,
  date: "--",
};

function reducer(state: ImageState, action: ImageStateAction): ImageState {
  switch (action.type) {
    case "SET_ALL":
      return { ...state, ...action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const downloadImage = (imageData: ImageState) => {
  if (imageData?.preview) {
    const a = document.createElement("a");
    a.href = imageData.preview;
    a.download = imageData.filename ?? "downloaded-image";
    a.click();
  }
};

function getImageWidthAndHeight(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image(); // Conflict with Next.js Image component
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

const ClearImageButton = ({
  dispatch,
}: {
  dispatch: ActionDispatch<[action: ImageStateAction]>;
}) => (
  <ToolTipWrapper tooltip="Limpar">
    <li>
      <button
        type="button"
        onClick={() =>
          dispatch({
            type: "RESET",
          })
        }
        className={IMG_BTN_CLASSNAMES}
      >
        <TrashBinIcon size={16} />
      </button>
    </li>
  </ToolTipWrapper>
);

const CopyImageURLButton = ({ imageData }: { imageData?: ImageState }) => (
  <ToolTipWrapper tooltip="Copiar link">
    <li>
      <button
        type="button"
        disabled={!imageData?.preview}
        onClick={() => {
          if (imageData?.preview)
            navigator.clipboard.writeText(imageData.preview);
        }}
        className={IMG_BTN_CLASSNAMES}
      >
        <LinkIcon size={24} />
      </button>
    </li>
  </ToolTipWrapper>
);

const DownloadImageButton = ({ imageData }: { imageData?: ImageState }) => (
  <ToolTipWrapper tooltip="Baixar">
    <li>
      <button
        type="button"
        disabled={!imageData?.preview}
        onClick={() => {
          if (imageData?.preview) downloadImage(imageData);
        }}
        className={IMG_BTN_CLASSNAMES}
      >
        <DownloadIcon size={16} />
      </button>
    </li>
  </ToolTipWrapper>
);

const FilePickerButton = ({
  inputRef,
}: {
  inputRef: React.Ref<HTMLInputElement> | null;
}) => {
  const openFilePicker = () => {
    if (inputRef && typeof inputRef !== "function" && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <ToolTipWrapper tooltip="Enviar">
      <li>
        <button
          type="button"
          onClick={openFilePicker}
          className={IMG_BTN_CLASSNAMES}
        >
          <UploadIcon size={15} />
        </button>
      </li>
    </ToolTipWrapper>
  );
};

const ImageEditorButtonsList = ({
  imageData,
  inputRef,
  dispatch,
}: {
  imageData?: ImageState;
  inputRef: React.Ref<HTMLInputElement> | null;
  dispatch: ActionDispatch<[action: ImageStateAction]>;
}) => (
  <ul
    className={
      `z-10 absolute right-2 top-2 ml-auto mr-0 ` +
      `w-fit flex justify-center items-center ` +
      `rounded border border-neutral-700 bg-neutral-900 ` +
      `[&_li_*]:outline-none ` +
      `[&_li]:not-last:[&_button]:border-r [&_li]:not-last:[&_button]:border-neutral-700 ` +
      `[&_li]:first:[&_button]:rounded-l [&_li]:last:[&_button]:rounded-r `
      // + `[&_li_button]:transition-ring [&_li_button]:duration-300 `
      // + `[&_li_button]:size-10 [&_li_button]:flex [&_li_button]:items-center [&_li_button]:justify-center `
      // + `[&_li_button]:cursor-pointer [&_li_button]:hover:bg-neutral-800 `
      // + `[&_li_button]:focus-visible:ring-3 [&_li_button]:focus-visible:ring-neutral-100 `
      // + `[&_li_button]:disabled:cursor-auto [&_li_button]:disabled:text-neutral-600 [&_li_button]:disabled:bg-neutral-800 `
      // + `[&_li_button]:focus-visible:bg-neutral-800 `
      // + `[&_li_button]:active:bg-neutral-900 `
    }
  >
    <ClearImageButton dispatch={dispatch} />
    <CopyImageURLButton imageData={imageData} />
    <DownloadImageButton imageData={imageData} />
    <FilePickerButton inputRef={inputRef} />
  </ul>
);

const DropPlaceholder = () => (
  <div
    className={
      `absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ` +
      `flex justify-center items-center ` +
      `w-96 h-60 rounded-xl pointer-events-none ` +
      `border-2 border-dashed border-neutral-800 ` +
      `opacity-100 animate-opacity delay-[250ms] ` +
      `max-lg:w-60 max-lg:h-48 `
    }
  >
    <p className="text-3xl max-lg:text-xl text-neutral-500 delay-[250ms]">
      Arraste e solte
    </p>
  </div>
);

const DragAndDropZone = ({
  imageData,
  inputRef,
  dispatch,
  setFilename,
  onFileChange,
}: {
  imageData: ImageState;
  inputRef: React.Ref<HTMLInputElement> | null;
  dispatch: ActionDispatch<[action: ImageStateAction]>;
  setFilename: (filename: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}) => {
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (isNotImageFile(file)) {
      return;
    }

    const url = URL.createObjectURL(file);
    const { width, height } = await getImageWidthAndHeight(file);
    const today = new Date();

    setFilename(file.name);

    dispatch({
      type: "SET_ALL",
      payload: {
        preview: url,
        filename: file.name,
        size: file.size,
        type: file.type.replace("image/", ""),
        width,
        height,
        date: comercialDate(today),
      },
    });
  };

  const props = { imageData, inputRef, dispatch };
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      className={`relative ${D_N_D_CLASSNAMES}`}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      <ImageEditorButtonsList {...props} />
      {imageData.preview ? (
        <Image
          src={imageData.preview}
          alt="preview"
          fill
          className="absolute object-cover"
        />
      ) : (
        <DropPlaceholder />
      )}
    </div>
  );
};

const ImageDataInfo = ({ imageData }: { imageData: ImageState }) => (
  <div
    className={
      `relative grid grid-cols-[repeat(2,minmax(0,1fr))] gap-1 p-2 bg-neutral-900 ` +
      `after:absolute after:h-[1px] after:left-0 after:right-0 after:bottom-0 after:bg-neutral-700 `
    }
  >
    <div className="[&_*]:text-xs">
      <p className="text-neutral-500">Tamanho</p>
      <p className="text-neutral-300 font-[600]">
        {imageData.size
          ? `${(imageData.size / (1024 * 1024)).toFixed(3)}KB`
          : "--"}
      </p>
    </div>
    <div className="[&_*]:text-xs">
      <p className="text-neutral-500">Data</p>
      <p className="text-neutral-300 font-[600]">{imageData.date}</p>
    </div>
    <div className="[&_*]:text-xs">
      <p className="text-neutral-500">Dimensões</p>
      <p className="text-neutral-300 font-[600]">
        {imageData.width && imageData.height
          ? `${imageData.width}x${imageData.height}`
          : "--"}
      </p>
    </div>
    <div className="[&_*]:text-xs">
      <p className="text-neutral-500">Extensão</p>
      <p className="text-neutral-300 font-[600]">{imageData.type}</p>
    </div>
  </div>
);

const ImageDataInput = ({
  filename,
  alt,
  caption,
  setFilename,
  setCaption,
  setAlt,
}: {
  filename: string;
  caption: string;
  alt: string;
  setFilename: (filename: string) => void;
  setAlt: (alt: string) => void;
  setCaption: (caption: string) => void;
}) => (
  <div className="p-2 pt-0">
    <FloatingInput
      id="1"
      label="Nome da imagem"
      placeholder=""
      value={filename}
      setValue={(e) => setFilename(e.target.value)}
    />
    <FloatingInput
      id="2"
      label="Nome Alternativo"
      placeholder=""
      value={alt}
      setValue={(e) => setAlt(e.target.value)}
    />
    <small className="text-[11px]">
      <p className="text-neutral-500 px-1 mt-1">
        Texto exibido no lugar da imagem caso o recurso esteja indisponível.
      </p>
    </small>
    <FloatingInput
      id="3"
      label="Rodapé"
      placeholder=""
      value={caption}
      setValue={(e) => setCaption(e.target.value)}
    />
  </div>
);

const InfoZone = ({
  imageData,
  filename,
  alt,
  caption,
  setFilename,
  setCaption,
  setAlt,
}: {
  imageData: ImageState;
  filename: string;
  caption: string;
  alt: string;
  setFilename: (filename: string) => void;
  setAlt: (alt: string) => void;
  setCaption: (caption: string) => void;
}) => (
  <div className="w-[30%] h-full shrink-0 flex flex-col">
    <ImageDataInfo imageData={imageData} />
    <ImageDataInput
      filename={filename}
      alt={alt}
      caption={caption}
      setAlt={setAlt}
      setFilename={setFilename}
      setCaption={setCaption}
    />
  </div>
);

const isNotImageFile = (file: File) => {
  if (!file.type.startsWith("image/")) {
    console.warn("Invalid file:", file.type);
    return true;
  }
};

export const ImageFieldset = ({
  src,
  alt,
  filename,
  caption,
  setSrc,
  setAlt,
  setFilename,
  setCaption,
}: {
  src: string;
  alt: string;
  filename: string;
  caption: string;
  setSrc: (src: string) => void;
  setAlt: (alt: string) => void;
  setFilename: (filename: string) => void;
  setCaption: (caption: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageData, dispatch] = useReducer(reducer, initialState);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // <input type="file"> triggers onChange only if (.value) changes
    // Reseting input.value = "" avoids several unexpected behaviors
    const input = e.currentTarget;
    const file = e.target.files?.[0];
    if (!file) return;

    if (isNotImageFile(file)) {
      input.value = ""; // Select the same file again
      return;
    }

    if (imageData?.preview && imageData.preview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(imageData.preview);
      } catch {}
    }

    const url = URL.createObjectURL(file);

    let width: number | null = null;
    let height: number | null = null;

    try {
      const dims = await getImageWidthAndHeight(file);
      width = dims.width;
      height = dims.height;
    } catch (err) {
      console.error("Error(getImageWidthAndHeight):", err);
    }

    const today = new Date();

    dispatch({
      type: "SET_ALL",
      payload: {
        preview: url,
        size: file.size,
        type: file.type.replace("image/", ""),
        width,
        height,
        date: comercialDate(today),
      },
    });

    setFilename(file.name);

    input.value = ""; // Select the same file again
  };

  const props = { imageData, inputRef, dispatch, setFilename, onFileChange };

  useEffect(() => {
    // Preventing memmory leak
    const prev = imageData.preview;
    return () => {
      if (prev && prev.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(prev);
        } catch {}
      }
    };
  }, [imageData.preview]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <DragAndDropZone {...props} />
      <InfoZone
        imageData={imageData}
        filename={filename}
        alt={alt}
        caption={caption}
        setAlt={setAlt}
        setFilename={setFilename}
        setCaption={setCaption}
      />
    </div>
  );
};
