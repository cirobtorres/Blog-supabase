import {
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
} from "../../../components/Fieldsets";
import {
  BoldIcon,
  BulletListIcon,
  CancelIcon,
  HighlightIcon,
  LinkIcon,
  MinusIcon,
  OrderedListIcon,
  PlusIcon,
} from "../../../components/Icons";
import { accordionReducer, initialAccordionState } from "../../../reducers";
import {
  buttonVariants,
  focusVisibleWhiteRing,
} from "../../../styles/classNames";
import { cn } from "../../../utils/classnames";
import { useCallback, useEffect, useReducer, useState } from "react";
import { EditorContent, getMarkRange, useEditor } from "@tiptap/react";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import Bold from "@tiptap/extension-bold";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { validateAllowedAutoLink, validateAllowedUri } from "../utils";
import { LoadingSpinning } from "@/components/LoadingSpinning";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
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
} from "@/components/ui/alert-dialog";

export default function AccordionEditorContent({
  ...blockProps
}: AccordionEditorProps) {
  const [accordions, baseDispatch] = useReducer(
    accordionReducer,
    blockProps.accordions || initialAccordionState
  );

  const accordDispatch = (action: AccordionStateAction) => {
    const newState = accordionReducer(accordions, action);
    blockProps.setAccordions(newState); // Updates parent component
    baseDispatch(action);
  };

  const AddButton = () => (
    <button
      type="button"
      onClick={() => accordDispatch({ type: "ADD" })}
      className={cn(
        "mx-auto w-fit flex justify-center items-center cursor-pointer p-1 rounded-sm outline-none transition-all duration-300 border border-neutral-700 bg-neutral-900 hover:border-neutral-600 hover:bg-neutral-800",
        focusVisibleWhiteRing
      )}
    >
      <PlusIcon />
    </button>
  );

  const RemoveButton = ({ accordionId: id }: { accordionId: string }) => (
    <button
      type="button"
      onClick={() => accordDispatch({ type: "REMOVE", id })}
      className={cn(
        "flex justify-center items-center cursor-pointer p-1 rounded-sm transition-all duration-300 outline-none border border-neutral-700 bg-neutral-900 hover:border-neutral-600 hover:bg-neutral-800",
        focusVisibleWhiteRing
      )}
    >
      <MinusIcon />
    </button>
  );

  return (
    <div className="max-w-full mx-auto p-2 flex flex-col items-start gap-2">
      <div className="w-full flex flex-1 flex-col justify-center gap-2">
        {accordions.map((accordion, index) => {
          const uniqueFloatingTitleId = `floating-title-${crypto
            .randomUUID()
            .split("-")
            .slice(4)}`;
          const uniqueFloatingMessageId = `floating-message-${crypto
            .randomUUID()
            .split("-")
            .slice(4)}`;
          return (
            <div
              key={accordion.id}
              className="w-full grid grid-cols-[minmax(0,1fr)_36px] items-start rounded p-2 gap-2 border border-neutral-800 first:bg-theme-color-backdrop first:border-theme-color"
            >
              <div className="flex flex-col gap-2">
                {index === 0 && (
                  <p className="text-theme-color uppercase text-xs font-extrabold">
                    Default
                  </p>
                )}
                <FloatingFieldset className="focus-within:ring-0 focus-within:ring-offset-0">
                  <FloatingInput
                    id={uniqueFloatingTitleId}
                    value={accordion.title}
                    onChange={(e) =>
                      accordDispatch({
                        type: "UPDATE_TITLE",
                        id: accordion.id,
                        value: e.target.value,
                      })
                    }
                  />
                  <FloatingLabel
                    htmlFor={`title-${accordion.id}`}
                    label="Título"
                  />
                </FloatingFieldset>
                {/* <FloatingFieldset className="focus-within:ring-0 focus-within:ring-offset-0">
                  <FloatingTextArea
                    id={uniqueFloatingMessageId}
                    value={accordion.message}
                    onChange={(e) =>
                      accordDispatch({
                        type: "UPDATE_MESSAGE",
                        id: accordion.id,
                        value: e.target.value,
                      })
                    }
                    placeholder="Mensagem"
                  /> 
                </FloatingFieldset> */}
                <TipTapAccordionEditor
                  id={uniqueFloatingMessageId}
                  defaultBody={accordion.message}
                  setVal={(val) =>
                    accordDispatch({
                      type: "UPDATE_MESSAGE",
                      id: accordion.id,
                      value: val,
                    })
                  }
                />
              </div>
              {index > 0 && <RemoveButton accordionId={accordion.id} />}
            </div>
          );
        })}
        <AddButton />
      </div>
    </div>
  );
}

function TipTapAccordionEditor({
  id,
  defaultBody,
  setVal,
}: {
  id: string;
  defaultBody: string;
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
    content: defaultBody,
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
      <div className="w-full flex gap-4 justify-between items-center">
        <div className="w-full flex gap-4 items-center">
          <div
            className={cn(
              "flex items-center gap-0.5 rounded [&_button]:relative [&_button]:focus-visible:z-10 [&_button]:border [&_button]:first:rounded-l [&_button]:last:rounded-r [&_button]:border-neutral-700 [&_button]:p-[1px] [&_button]:flex [&_button]:justify-center [&_button]:items-center [&_button]:outline-none [&_button]:cursor-pointer [&_button]:focus-within:bg-[#242424]"
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
                    Crie um texto para o hiperlink. Se você deixar o texto
                    vazio, o texto será o próprio link.
                  </AlertDialogDescription>
                  <div className="flex flex-col gap-2 p-3">
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
          <div
            className={cn(
              "flex items-center gap-0.5 rounded [&_button]:relative [&_button]:focus-visible:z-10 [&_button]:border [&_button]:first:rounded-l [&_button]:last:rounded-r [&_button]:border-neutral-700 [&_button]:p-[1px] [&_button]:flex [&_button]:justify-center [&_button]:items-center [&_button]:outline-none [&_button]:cursor-pointer [&_button]:focus-within:bg-[#242424]"
            )}
          >
            <Tooltip>
              <TooltipTrigger
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
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
                onClick={() => editor.chain().focus().toggleBulletList().run()}
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
          "p-1 flex flex-col transition-all duration-300 [&_p]:pb-6 [&_p]:text-base [&_p]:text-neutral-400 [&_strong]:text-neutral-400 [&_p_strong]:text-neutral-300 rounded border border-neutral-700 [&_p_a]:text-theme-color [&_p_a]:underline [&_p_a]:bg-neutral-700 [&_p_a]:hover:text-theme-link [&_p_a]:border [&_p_a]:border-neutral-600 [&_p_a]:px-1 [&_p_a]:py-0.5 [&_p_a]:rounded-md [&_p_mark]:text-neutral-100 [&_p_mark]:bg-neutral-700 [&_p_mark]:border [&_p_mark]:border-neutral-600 [&_p_mark]:px-1 [&_p_mark]:py-0.5 [&_p_mark]:rounded-md [&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:pb-6 [&_h3]:text-2xl [&_h4]:text-xl [&_h3]:pb-6 [&_h4]:pb-6 [&_ul]:pb-6 [&_ul_li:last-child_p]:pb-0 [&_ul]:ml-5 [&_ul_li]:list-disc [&_ol]:pb-6 [&_ol_li:last-child_p]:pb-0 [&_ol]:ml-5 [&_ol_li]:list-decimal [&_.tiptap.ProseMirror]:overflow-y-auto  [&_.tiptap.ProseMirror]:p-2 [&_.tiptap.ProseMirror]:pr-6 [&_.tiptap.ProseMirror]:rounded-b-xs [&_.tiptap.ProseMirror]:outline-none [&_.tiptap.ProseMirror]:transition-all bg-neutral-900"
        )}
      />
    </>
  );
}
