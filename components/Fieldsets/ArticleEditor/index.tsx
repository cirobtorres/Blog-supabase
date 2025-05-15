"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
import History from "@tiptap/extension-history";
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
    // Update link
    try {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkInput })
        .run();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(String(e));
      }
    }
  }, [editor]);

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
  }, [editor]);

  const returnEditorSelection = () =>
    editor?.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );

  if (!editor) {
    return <p>Loading...</p>;
  }

  const lastCharacterIndex = editor.getHTML().length;

  return (
    <>
      <div
        className="flex gap-4 items-center mb-1 p-1 rounded border border-neutral-800 bg-neutral-900" // button-group
      >
        <div className="flex gap-1 items-center">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`flex justify-center items-center transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[2px] ${
              editor.isActive("heading", { level: 2 })
                ? "border-neutral-600 bg-neutral-700"
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
            className={`flex justify-center items-center transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[2px] ${
              editor.isActive("heading", { level: 3 })
                ? "border-neutral-600 bg-neutral-700"
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
            className={`flex justify-center items-center transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[2px] ${
              editor.isActive("heading", { level: 4 })
                ? "border-neutral-600 bg-neutral-700"
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
            className={`flex justify-center items-center transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[2px] ${
              editor.isActive("bold")
                ? "border-neutral-600 bg-neutral-700"
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
          {editor.isActive("link") ? (
            <button
              type="button"
              // onClick={() => editor.chain().focus().unsetLink().run()}
              onClick={updateLink} // TODO: FIX ME
              className="flex justify-center items-center transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[2px] border-neutral-600 bg-neutral-700"
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
            </button>
          ) : (
            <div className="flex justify-center items-center transition-all cursor-pointer rounded border focus-visible:ring-neutral-100 focus-visible:ring-[2px] border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 bg-neutral-800">
              <AlertDialog open={isDialogOpen}>
                <AlertDialogTrigger
                  asChild
                  tabIndex={0}
                  onClick={() => {
                    const selectedText = returnEditorSelection();
                    setTextLinkInput(selectedText || "");
                    setIsDialogOpen(true);
                  }}
                  className="outline-none transition-all rounded focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
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
                          className="lucide lucide-x-icon lucide-x"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </AlertDialogCancel>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="border-y border-neutral-800 bg-neutral-950">
                      Crie um texto para o hiperlink. Se você deixar o texto
                      vazio, o texto será o próprio link.
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
                  <AlertDialogFooter className="flex gap-1">
                    <AlertDialogCancel
                      onClick={() => {
                        setIsDialogOpen(false);
                        editor.chain().focus();
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
                        setLink();
                      }}
                      className={cn(
                        "w-24",
                        buttonVariants({ variant: "outline" })
                      )}
                    >
                      Salvar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
      <EditorContent
        id={id}
        name={id}
        editor={editor}
        autoComplete="new-password"
        defaultValue={defaultValue}
        spellCheck={false}
        onFocus={() => editor.chain().selectTextblockEnd().focus()} // editor.chain().focus().setTextSelection(lastCharacterIndex).run();
        className={
          `article-typography` +
          ` [&_.tiptap.ProseMirror]:min-h-[calc(1.5rem_*_15)] [&_.tiptap.ProseMirror]:p-2` +
          ` [&_.tiptap.ProseMirror]:outline-none [&_.tiptap.ProseMirror]:rounded [&_.tiptap.ProseMirror]:transition-all` +
          ` [&_.tiptap.ProseMirror]:focus-visible:ring-neutral-100 [&_.tiptap.ProseMirror]:focus-visible:ring-[3px]` +
          ` rounded border border-neutral-700 bg-neutral-800`
        }
      />
    </>
  );
};
