import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent, getMarkRange } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
import History from "@tiptap/extension-history";
import Highlight from "@tiptap/extension-highlight";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Link from "@tiptap/extension-link";
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
import {
  buttonVariants,
  focusWithinWhiteRing,
  getUniformTipTapClassName,
} from "../../../styles/classNames";
import { cn } from "../../../utils/classnames";
import {
  BoldIcon,
  BulletListIcon,
  CancelIcon,
  HighlightIcon,
  LinkIcon,
  OrderedListIcon,
} from "../../Icons";
import ToolTipWrapper from "../../ui/tooltip";
import { LoadingSpinning } from "../../LoadingSpinning";
import {
  validateAllowedAutoLink,
  validateAllowedUri,
} from "../../Editors/utils";
import {
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
} from "../../Fieldsets";

export default function TipTapAlertEditor({
  id,
  defaultValue,
  setVal,
}: {
  id: string;
  defaultValue: string;
  setVal: (data: string) => void;
}) {
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
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => validateAllowedUri(url, ctx),
        shouldAutoLink: (url) => validateAllowedAutoLink(url),
      }),
    ],
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
          <ToolTipWrapper tooltip="Negrito">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={getUniformTipTapClassName(editor.isActive("bold"))}
            >
              <BoldIcon className="size-7 p-1" />
            </button>
          </ToolTipWrapper>
          <ToolTipWrapper tooltip="Realce">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={getUniformTipTapClassName(
                editor.isActive("highlight")
              )}
            >
              <HighlightIcon className="size-7 p-1" />
            </button>
          </ToolTipWrapper>
          <AlertDialog open={isDialogOpen}>
            <AlertDialogTrigger asChild>
              <ToolTipWrapper tooltip="Hiperlink">
                <button
                  type="button"
                  tabIndex={0}
                  onClick={handleLinkClick}
                  className={getUniformTipTapClassName(editor.isActive("link"))}
                >
                  <LinkIcon className="size-7 p-1" />
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
                  <FloatingFieldset>
                    <FloatingInput
                      id="text-link"
                      value={textLinkInput}
                      onChange={(e) => setTextLinkInput(e.target.value)}
                      // placeholder=""
                      // className=""
                      // {...props}
                    />
                    <FloatingLabel htmlFor="text-link" label="Texto" />
                  </FloatingFieldset>
                  <FloatingFieldset>
                    <FloatingInput
                      id="text-url"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      // placeholder=""
                      // className=""
                      // {...props}
                    />
                    <FloatingLabel htmlFor="text-url" label="URL" />
                  </FloatingFieldset>
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
                      if (editor?.isActive("link")) {
                        updateLink();
                      } else {
                        setLink();
                      }
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
              className={getUniformTipTapClassName(
                editor.isActive("bulletList")
              )}
            >
              <BulletListIcon className="size-7 p-1" />
            </button>
          </ToolTipWrapper>
          <ToolTipWrapper tooltip="Lista ordenada">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={getUniformTipTapClassName(
                editor.isActive("orderedList")
              )}
            >
              <OrderedListIcon className="size-7 p-1" />
            </button>
          </ToolTipWrapper>
        </div>
      </div>
      <EditorContent
        id={id}
        name={id}
        editor={editor}
        autoComplete="new-password"
        spellCheck={false}
        onFocus={() => editor.chain().selectTextblockEnd().focus()}
        className={cn(
          "p-1 flex flex-col transition-all duration-300 [&_p]:pb-6 [&_p]:text-base [&_p]:text-neutral-400 [&_strong]:text-neutral-400 [&_p_strong]:text-neutral-300 rounded border border-neutral-700 [&_p_a]:text-theme-color [&_p_a]:underline [&_p_a]:bg-neutral-700 [&_p_a]:hover:text-theme-link [&_p_a]:border [&_p_a]:border-neutral-600 [&_p_a]:px-1 [&_p_a]:py-0.5 [&_p_a]:rounded-md [&_p_mark]:text-neutral-100 [&_p_mark]:bg-neutral-700 [&_p_mark]:border [&_p_mark]:border-neutral-600 [&_p_mark]:px-1 [&_p_mark]:py-0.5 [&_p_mark]:rounded-md [&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:pb-6 [&_h3]:text-2xl [&_h4]:text-xl [&_h3]:pb-6 [&_h4]:pb-6 [&_ul]:pb-6 [&_ul_li:last-child_p]:pb-0 [&_ul]:ml-5 [&_ul_li]:list-disc [&_ol]:pb-6 [&_ol_li:last-child_p]:pb-0 [&_ol]:ml-5 [&_ol_li]:list-decimal [&_.tiptap.ProseMirror]:h-[320px] [&_.tiptap.ProseMirror]:overflow-y-auto  [&_.tiptap.ProseMirror]:p-2 [&_.tiptap.ProseMirror]:pr-6 [&_.tiptap.ProseMirror]:rounded-b-xs [&_.tiptap.ProseMirror]:outline-none [&_.tiptap.ProseMirror]:transition-all bg-neutral-900",
          focusWithinWhiteRing
        )}
      />
    </>
  );
}
