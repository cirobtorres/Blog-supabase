"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
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
import { cn } from "../../../lib/utils";
import { CancelIcon } from "@/components/Icons";

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

const editorBackgroundColor = "bg-neutral-900";

export const ArticleEditor = ({
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
      const html = editor.getHTML();
      setVal((prev) => (prev ? prev : html));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (!editor) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div
        className="w-full flex gap-4 items-center p-1 border-y border-neutral-800" // mb-1 border border-neutral-800 rounded-md bg-neutral-900
      >
        <div className="flex gap-1 items-center">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`flex justify-center items-center outline-none transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[3px] ${
              editor.isActive("heading", { level: 2 })
                ? "text-theme-color border-neutral-600 bg-neutral-700"
                : "border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 bg-neutral-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heading2-icon lucide-heading-2 p-1"
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
            className={`flex justify-center items-center outline-none transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[3px] ${
              editor.isActive("heading", { level: 3 })
                ? "text-theme-color border-neutral-600 bg-neutral-700"
                : "border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 bg-neutral-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heading3-icon lucide-heading-3 p-1"
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
            className={`flex justify-center items-center outline-none transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[3px] ${
              editor.isActive("heading", { level: 4 })
                ? "text-theme-color border-neutral-600 bg-neutral-700"
                : "border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 bg-neutral-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heading4-icon lucide-heading-4 p-1"
            >
              <path d="M12 18V6" />
              <path d="M17 10v3a1 1 0 0 0 1 1h3" />
              <path d="M21 10v8" />
              <path d="M4 12h8" />
              <path d="M4 18V6" />
            </svg>
          </button>
        </div>
        <div className="flex gap-1 items-center">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`flex justify-center items-center outline-none transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[3px] ${
              editor.isActive("bold")
                ? "text-theme-color border-neutral-600 bg-neutral-700"
                : "border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 bg-neutral-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bold-icon lucide-bold p-1"
            >
              <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`flex justify-center items-center outline-none transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[3px] ${
              editor.isActive("highlight")
                ? "text-theme-color border-neutral-600 bg-neutral-700"
                : "border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 bg-neutral-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-highlighter-icon lucide-highlighter p-1"
            >
              <path d="m9 11-6 6v3h9l3-3" />
              <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
            </svg>
          </button>
          <AlertDialog open={isDialogOpen}>
            <AlertDialogTrigger
              tabIndex={0}
              onClick={() => {
                const selectedText = getKeyboardSelection();
                setTextLinkInput(selectedText || "");
                const selectedUrl = getKeyboardSelectionUrl();
                setLinkInput(selectedUrl);
                setIsDialogOpen(true);
              }}
              className={`flex justify-center items-center outline-none transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[3px] ${
                editor.isActive("link")
                  ? "text-theme-color border-neutral-600 bg-neutral-700"
                  : "border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 bg-neutral-800"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-link-icon lucide-link p-1"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
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
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`flex justify-center items-center outline-none transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[3px] ${
              editor.isActive("bulletList")
                ? "text-theme-color border-neutral-600 bg-neutral-700"
                : "border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 bg-neutral-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-list-icon lucide-list p-1"
            >
              <path d="M3 12h.01" />
              <path d="M3 18h.01" />
              <path d="M3 6h.01" />
              <path d="M8 12h13" />
              <path d="M8 18h13" />
              <path d="M8 6h13" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`flex justify-center items-center outline-none transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[3px] ${
              editor.isActive("orderedList")
                ? "text-theme-color border-neutral-600 bg-neutral-700"
                : "border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 bg-neutral-800"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-list-ordered-icon lucide-list-ordered p-1"
            >
              <path d="M10 12h11" />
              <path d="M10 18h11" />
              <path d="M10 6h11" />
              <path d="M4 10h2" />
              <path d="M4 6h1v4" />
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
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
        spellCheck={false}
        onFocus={() => editor.chain().selectTextblockEnd().focus()}
        className={
          `p-1 flex flex-col [&_p]:pb-6 [&_p]:text-base [&_p]:text-neutral-400 [&_strong]:text-neutral-400 ` + // rounded-md
          `[&_p_strong]:text-neutral-300 ` +
          `[&_p_a]:text-theme-color [&_p_a]:underline [&_p_a]:bg-neutral-700 [&_p_a]:hover:text-theme-link ` +
          `[&_p_a]:border [&_p_a]:border-neutral-600 [&_p_a]:px-1 [&_p_a]:py-0.5 [&_p_a]:rounded-md ` +
          `[&_p_mark]:text-neutral-100 [&_p_mark]:bg-neutral-700 [&_p_mark]:border [&_p_mark]:border-neutral-600 ` +
          `[&_p_mark]:px-1 [&_p_mark]:py-0.5 [&_p_mark]:rounded-md ` +
          `[&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:pb-6 ` +
          `[&_h3]:text-2xl [&_h4]:text-xl [&_h3]:pb-6 [&_h4]:pb-6 ` +
          `[&_ul]:pb-6 [&_ul_li:last-child_p]:pb-0 [&_ul]:ml-5 [&_ul_li]:list-disc ` +
          `[&_ol]:pb-6 [&_ol_li:last-child_p]:pb-0 [&_ol]:ml-5 [&_ol_li]:list-decimal ` +
          `[&_.tiptap.ProseMirror]:h-[324px] [&_.tiptap.ProseMirror]:overflow-y-auto  ` +
          `[&_.tiptap.ProseMirror]:p-2 [&_.tiptap.ProseMirror]:pr-6 [&_.tiptap.ProseMirror]:rounded-b-xs ` +
          `[&_.tiptap.ProseMirror]:outline-none [&_.tiptap.ProseMirror]:transition-all ` + // [&_.tiptap.ProseMirror]:rounded-md
          // `[&_.tiptap.ProseMirror]:focus-visible:ring-neutral-100 [&_.tiptap.ProseMirror]:focus-visible:ring-[3px] ` +
          `${editorBackgroundColor} `
        }
      />
    </>
  );
};
