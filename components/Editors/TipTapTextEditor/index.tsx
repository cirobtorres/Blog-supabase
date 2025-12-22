"use client";

import { useCallback, useEffect, useState } from "react";
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
  focusVisibleWhiteRing,
} from "../../../styles/classNames";
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
} from "../../Icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { LoadingSpinning } from "../../LoadingSpinning";
import { Kbd } from "../../ui/kbd";
import {
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
} from "../../Fieldsets";
import { validateAllowedAutoLink, validateAllowedUri } from "../utils";
import { Redo2, Undo2 } from "lucide-react";
import { Gapcursor } from "@tiptap/extensions";
import { TableKit } from "@tiptap/extension-table";
import {
  TbColumnInsertLeft,
  TbColumnInsertRight,
  TbColumnRemove,
  TbRowInsertBottom,
  TbRowInsertTop,
  TbRowRemove,
} from "react-icons/tb";
import { PiTableFill } from "react-icons/pi";
import { RiMergeCellsVertical } from "react-icons/ri";

export default function TipTapTextEditor({
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
      Gapcursor,
      TableKit.configure({
        table: { resizable: true },
      }),
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
        // Fallback
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
    return <LoadingSpinning />;
  }

  return (
    <>
      <div
        className="w-full flex flex-wrap gap-x-4 items-center pb-1" // border-y border-neutral-800
      >
        {!editor.isActive("table") && (
          <>
            <div
              className={cn(
                "relative flex items-center p-2 my-2 gap-0.5 [&_button]:relative [&_button]:focus-visible:z-10 [&_button]:border [&_button]:first:rounded-l [&_button]:last:rounded-r [&_button]:border-neutral-700 [&_button]:p-px [&_button]:flex [&_button]:justify-center [&_button]:items-center [&_button]:outline-none [&_button]:cursor-pointer [&_button]:focus-within:bg-[#242424] border border-neutral-700 rounded-lg",
                "after:absolute after:content-['Cabeçalhos'] after:-top-2 after:left-1/2 after:-translate-x-1/2 after:text-xs after:text-neutral-500 after:font-semibold after:px-1 after:bg-neutral-950"
              )}
            >
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={cn(
                    editor.isActive("heading", { level: 2 })
                      ? "text-theme-color bg-[#242424]"
                      : "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <HeaderH2Icon className="size-7 p-1" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Header H2</p>
                  {/* <Kbd>Ctrl + Alt + 1</Kbd> */}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={cn(
                    editor.isActive("heading", { level: 3 })
                      ? "text-theme-color bg-[#242424]"
                      : "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <HeaderH3Icon className="size-7 p-1" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Header H3</p>
                  {/* <Kbd>Ctrl + Alt + 2</Kbd> */}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                  }
                  className={cn(
                    editor.isActive("heading", { level: 4 })
                      ? "text-theme-color bg-[#242424]"
                      : "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <HeaderH4Icon className="size-7 p-1" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Header H4</p>
                  {/* <Kbd>Ctrl + Alt + 3</Kbd> */}
                </TooltipContent>
              </Tooltip>
            </div>
          </>
        )}
        <div
          className={cn(
            "relative flex items-center p-2 my-2 gap-0.5 [&_button]:relative [&_button]:focus-visible:z-10 [&_button]:border [&_button]:first:rounded-l [&_button]:last:rounded-r [&_button]:border-neutral-700 [&_button]:p-px [&_button]:flex [&_button]:justify-center [&_button]:items-center [&_button]:outline-none [&_button]:cursor-pointer [&_button]:focus-within:bg-[#242424] border border-neutral-700 rounded-lg",
            "after:absolute after:content-['Realces'] after:-top-2 after:left-1/2 after:-translate-x-1/2 after:text-xs after:text-neutral-500 after:font-semibold after:px-1 after:bg-neutral-950"
          )}
        >
          <Tooltip>
            <TooltipTrigger
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                editor.isActive("bold")
                  ? "text-theme-color bg-[#242424]"
                  : "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                focusVisibleWhiteRing
              )}
            >
              <BoldIcon className="size-7 p-1" />
            </TooltipTrigger>
            <TooltipContent
              sideOffset={10}
              className="flex flex-col items-center justify-center gap-1"
            >
              <p className="text-neutral-100">Negrito</p>
              <Kbd>Ctrl + B</Kbd>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={cn(
                editor.isActive("highlight")
                  ? "text-theme-color bg-[#242424]"
                  : "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                focusVisibleWhiteRing
              )}
            >
              <HighlightIcon className="size-7 p-1" />
            </TooltipTrigger>
            <TooltipContent
              sideOffset={10}
              className="flex flex-col items-center justify-center gap-1"
            >
              <p className="text-neutral-100">Realce</p>
              <Kbd>Ctrl + Shift + H</Kbd>
            </TooltipContent>
          </Tooltip>
          <AlertDialog open={isDialogOpen}>
            <AlertDialogTrigger asChild>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  tabIndex={0}
                  onClick={handleLinkClick}
                  className={cn(
                    editor.isActive("link")
                      ? "text-theme-color bg-[#242424]"
                      : "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <LinkIcon className="size-7 p-1" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Hiperlink</p>
                  {/* <Kbd>Ctrl + L</Kbd> */}
                </TooltipContent>
              </Tooltip>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex justify-between items-center bg-neutral-950">
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
              </AlertDialogHeader>
              <div className="border-y border-neutral-700">
                <AlertDialogDescription className="pb-0">
                  Crie um texto para o hiperlink. Se você deixar o texto vazio,
                  o texto será o próprio link.
                </AlertDialogDescription>
                <div className="flex flex-col gap-2 p-3">
                  <FloatingFieldset>
                    <FloatingInput
                      id="text-link"
                      value={textLinkInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTextLinkInput(e.target.value)
                      }
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLinkInput(e.target.value)
                      }
                      // placeholder=""
                      // className=""
                      // {...props}
                    />
                    <FloatingLabel htmlFor="text-url" label="URL" />
                  </FloatingFieldset>
                </div>
              </div>
              <AlertDialogFooter className="flex justify-between py-2 bg-neutral-950">
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
        {!editor.isActive("table") && (
          <>
            <div
              className={cn(
                "relative flex items-center p-2 my-2 gap-0.5 [&_button]:relative [&_button]:focus-visible:z-10 [&_button]:border [&_button]:first:rounded-l [&_button]:last:rounded-r [&_button]:border-neutral-700 [&_button]:p-px [&_button]:flex [&_button]:justify-center [&_button]:items-center [&_button]:outline-none [&_button]:cursor-pointer [&_button]:focus-within:bg-[#242424] border border-neutral-700 rounded-lg",
                "after:absolute after:content-['Listas'] after:-top-2 after:left-1/2 after:-translate-x-1/2 after:text-xs after:text-neutral-500 after:font-semibold after:px-1 after:bg-neutral-950"
              )}
            >
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className={cn(
                    editor.isActive("orderedList")
                      ? "text-theme-color bg-[#242424]"
                      : "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <OrderedListIcon className="size-7 p-1" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Lista ordenada</p>
                  <Kbd>Ctrl + Shift + 7</Kbd>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={cn(
                    editor.isActive("bulletList")
                      ? "text-theme-color bg-[#242424]"
                      : "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <BulletListIcon className="size-7 p-1" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Lista não ordenada</p>
                  <Kbd>Ctrl + Shift + 8</Kbd>
                </TooltipContent>
              </Tooltip>
            </div>
          </>
        )}
        <div
          className={cn(
            "flex flex-col items-center gap-0.5 [&_button]:relative [&_button]:focus-visible:z-10 [&_button]:border [&_button]:rounded [&_button]:border-neutral-700 [&_button]:p-px [&_button]:h-8 [&_button]:flex [&_button]:justify-center [&_button]:items-center [&_button]:outline-none [&_button]:cursor-pointer [&_button]:focus-within:bg-[#242424]"
          )}
        >
          {!editor.isActive("table") ? (
            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
              className={cn(
                "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                editor.isActive("table") && "text-theme-color bg-[#242424]",
                focusVisibleWhiteRing
              )}
            >
              <p className="w-24 text-xs font-600">Criar tabela</p>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className={cn(
                "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                focusVisibleWhiteRing
              )}
            >
              <p className="w-24 text-xs font-600">Excluir tabela</p>
            </button>
          )}
        </div>
        {editor.isActive("table") && (
          <>
            <div
              className={cn(
                "relative flex items-center p-2 my-2 gap-0.5 [&_button]:relative [&_button]:focus-visible:z-10 [&_button]:border [&_button]:first:rounded-l [&_button]:last:rounded-r [&_button]:border-neutral-700 [&_button]:p-px [&_button]:flex [&_button]:justify-center [&_button]:items-center [&_button]:outline-none [&_button]:cursor-pointer [&_button]:focus-within:bg-[#242424] border border-neutral-700 rounded-lg",
                "after:absolute after:content-['Colunas'] after:-top-2 after:left-1/2 after:-translate-x-1/2 after:text-xs after:text-neutral-500 after:font-semibold after:px-1 after:bg-neutral-950"
              )}
            >
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  className={cn(
                    "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <TbColumnInsertLeft className="size-7 p-1 stroke-neutral-100" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Adicionar coluna atrás</p>
                  {/* <Kbd>Ctrl + Alt + 1</Kbd> */}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className={cn(
                    "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <TbColumnInsertRight className="size-7 p-1 stroke-neutral-100" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Adicionar coluna a frente</p>
                  {/* <Kbd>Ctrl + Alt + 1</Kbd> */}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className={cn(
                    "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <TbColumnRemove className="size-7 p-1 stroke-neutral-100" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Excluir coluna</p>
                  {/* <Kbd>Ctrl + Alt + 1</Kbd> */}
                </TooltipContent>
              </Tooltip>
            </div>
            <div
              className={cn(
                "relative flex items-center p-2 my-2 gap-0.5 [&_button]:relative [&_button]:focus-visible:z-10 [&_button]:border [&_button]:first:rounded-l [&_button]:last:rounded-r [&_button]:border-neutral-700 [&_button]:p-px [&_button]:flex [&_button]:justify-center [&_button]:items-center [&_button]:outline-none [&_button]:cursor-pointer [&_button]:focus-within:bg-[#242424] border border-neutral-700 rounded-lg",
                "after:absolute after:content-['Linhas'] after:-top-2 after:left-1/2 after:-translate-x-1/2 after:text-xs after:text-neutral-500 after:font-semibold after:px-1 after:bg-neutral-950"
              )}
            >
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  className={cn(
                    "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <TbRowInsertTop className="size-7 p-1 stroke-neutral-100" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Adicionar linha acima</p>
                  {/* <Kbd>Ctrl + Alt + 1</Kbd> */}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className={cn(
                    "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <TbRowInsertBottom className="size-7 p-1 stroke-neutral-100" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Adicionar linha abaixo</p>
                  {/* <Kbd>Ctrl + Alt + 1</Kbd> */}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className={cn(
                    "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <TbRowRemove className="size-7 p-1 stroke-neutral-100" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Excluir linha</p>
                  {/* <Kbd>Ctrl + Alt + 1</Kbd> */}
                </TooltipContent>
              </Tooltip>
            </div>
            <div
              className={cn(
                "flex items-center gap-0.5 [&_button]:relative [&_button]:focus-visible:z-10 [&_button]:border [&_button]:first:rounded-l [&_button]:last:rounded-r [&_button]:border-neutral-700 [&_button]:p-px [&_button]:flex [&_button]:justify-center [&_button]:items-center [&_button]:outline-none [&_button]:cursor-pointer [&_button]:focus-within:bg-[#242424]"
              )}
            >
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeaderCell().run()
                  }
                  className={cn(
                    "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    editor.isActive("tableHeader") &&
                      "text-theme-color bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <PiTableFill className="size-7 p-1 stroke-neutral-100" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">
                    {editor.isActive("tableHeader")
                      ? "Remover Cabeçalho"
                      : "Tornar cabeçalho"}
                  </p>
                  {/* <Kbd>Ctrl + Alt + 1</Kbd> */}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={() => editor.chain().focus().mergeOrSplit().run()}
                  className={cn(
                    "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                    focusVisibleWhiteRing
                  )}
                >
                  <RiMergeCellsVertical className="size-7 p-1 stroke-neutral-100" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-neutral-100">Unir células</p>
                  {/* <Kbd>Ctrl + Alt + 1</Kbd> */}
                </TooltipContent>
              </Tooltip>
            </div>
          </>
        )}
        <div
          className={cn(
            "flex items-center gap-0.5 rounded [&_button]:relative [&_button]:focus-visible:z-10 [&_button]:border [&_button]:first:rounded-l [&_button]:last:rounded-r [&_button]:border-neutral-700 [&_button]:p-px [&_button]:flex [&_button]:justify-center [&_button]:items-center [&_button]:outline-none [&_button]:cursor-pointer [&_button]:focus-within:bg-[#242424]"
          )}
        >
          <Tooltip>
            <TooltipTrigger
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              className={cn(
                "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                focusVisibleWhiteRing
              )}
            >
              <Undo2 className="size-7 p-1" />
            </TooltipTrigger>
            <TooltipContent
              sideOffset={10}
              className="flex flex-col items-center justify-center gap-1"
            >
              <p className="text-neutral-100">Desfazer</p>
              <Kbd>Ctrl + z</Kbd>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              className={cn(
                "text-neutral-100 bg-neutral-900 hover:bg-[#242424]",
                focusVisibleWhiteRing
              )}
            >
              <Redo2 className="size-7 p-1" />
            </TooltipTrigger>
            <TooltipContent
              sideOffset={10}
              className="flex flex-col items-center justify-center gap-1"
            >
              <p className="text-neutral-100">Refazer</p>
              <Kbd>Ctrl + Shift + z</Kbd>
            </TooltipContent>
          </Tooltip>
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
          "p-1 flex flex-col transition-all duration-300 rounded border border-neutral-700",
          "[&_p]:pb-6 [&_p]:text-base [&_p]:text-neutral-400 [&_strong]:text-neutral-400 [&_p_strong]:text-neutral-300 [&_p_a]:text-theme-color [&_p_a]:underline [&_p_a]:bg-neutral-700 [&_p_a]:hover:text-theme-link [&_p_a]:border [&_p_a]:border-neutral-600 [&_p_a]:px-1 [&_p_a]:py-0.5 [&_p_a]:rounded-md [&_p_mark]:text-neutral-100 [&_p_mark]:bg-neutral-700 [&_p_mark]:border [&_p_mark]:border-neutral-600 [&_p_mark]:px-1 [&_p_mark]:py-0.5 [&_p_mark]:rounded-md",
          "[&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:pb-6 [&_h3]:text-2xl [&_h4]:text-xl [&_h3]:pb-6 [&_h4]:pb-6",
          "[&_ul]:pb-6 [&_ul_li:last-child_p]:pb-0 [&_ul]:ml-5 [&_ul_li]:list-disc [&_ol]:pb-6 [&_ol_li:last-child_p]:pb-0 [&_ol]:ml-5 [&_ol_li]:list-decimal",
          "[&_table_p]:pb-0",
          "[&_.tiptap.ProseMirror]:h-80 [&_.tiptap.ProseMirror]:overflow-y-auto  [&_.tiptap.ProseMirror]:p-2 [&_.tiptap.ProseMirror]:pr-6 [&_.tiptap.ProseMirror]:rounded-b-xs [&_.tiptap.ProseMirror]:outline-none [&_.tiptap.ProseMirror]:transition-all bg-neutral-900"
          // focusWithinWhiteRing
        )}
      />
    </>
  );
}
