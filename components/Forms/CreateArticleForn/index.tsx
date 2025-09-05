"use client";

import {
  ConfirmFormButton,
  ReturnToHome,
  SaveFormButton,
} from "@/components/Buttons";
import {
  getEditorFormDataValue,
  getSubtitleFormDataValue,
  getTitleFormDataValue,
  SubtitleFieldset,
  TitleFieldset,
} from "@/components/Fieldsets";
import {
  AccordionEditorIcon,
  AlertEditorIcon,
  CodeEditorIcon,
  ImageCarouselEditorIcon,
  ImageEditorIcon,
  PlusIcon,
  QuizEditorIcon,
  QuoteEditorIcon,
  TextEditorIcon,
} from "@/components/Icons";
import { postArticle } from "@/services/article";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import CodeEditor from "./CodeEditor";
import QuoteEditor from "./QuoteEditor";
import AlertEditor from "./AlertEditor";
import TextEditor from "./TextEditor";
import AccordionEditor from "./AccordionEditor";
import ImgEditor from "./ImgEditor";
import ImgCarouselEditor from "./ImgCarouselEditor";
import QuizEditor from "./QuizEditor";
import {
  Popover,
  PopoverContentClipPath,
  PopoverTrigger,
} from "@/components/ui/popover";

type Block = {
  id: string;
  type:
    | "text"
    | "code"
    | "quote"
    | "accordion"
    | "alert"
    | "img"
    | "imgCarousel"
    | "quiz";
};

interface BlockButton extends Block {
  svg: React.ReactNode;
}

const newBlockArray: BlockButton[] = [
  {
    id: "1",
    type: "text",
    svg: <TextEditorIcon size={20} />,
  },
  {
    id: "2",
    type: "code",
    svg: <CodeEditorIcon size={20} />,
  },
  {
    id: "3",
    type: "quote",
    svg: <QuoteEditorIcon size={20} />,
  },
  {
    id: "4",
    type: "accordion",
    svg: <AccordionEditorIcon size={20} />,
  },
  {
    id: "5",
    type: "alert",
    svg: <AlertEditorIcon size={20} />,
  },
  {
    id: "6",
    type: "img",
    svg: <ImageEditorIcon size={20} />,
  },
  {
    id: "7",
    type: "imgCarousel",
    svg: <ImageCarouselEditorIcon size={20} />,
  },
  {
    id: "8",
    type: "quiz",
    svg: <QuizEditorIcon size={20} />,
  },
];

export const CreateArticleForm = ({ profileId }: { profileId: string }) => {
  const [htmlTitle, setHtmlTitle] = useState("");
  const [htmlDescription, setHtmlDescription] = useState("");
  const [htmlBody, setHtmlBody] = useState("");

  const [state, action, isPending] = useActionState(
    async () => {
      const formData = new FormData();
      formData.set(getTitleFormDataValue, htmlTitle);
      formData.set(getSubtitleFormDataValue, htmlDescription);
      formData.set(getEditorFormDataValue, htmlBody);
      formData.set("profile_id", profileId);
      const result = await postArticle(
        { ok: false, success: null, error: null },
        formData
      );
      if (!result.ok) {
        toast(result.error);
      } else {
        toast(result.success);
      }
      return result;
    },
    { ok: false, success: null, error: null }
  );

  // TODO
  const [saveState, saveAction, isPendingSave] = useActionState(
    async () => {
      const formData = new FormData();
      formData.set(getTitleFormDataValue, htmlTitle);
      formData.set(getSubtitleFormDataValue, htmlDescription);
      formData.set(getEditorFormDataValue, htmlBody);
      formData.set("profile_id", profileId);
      const result = await postArticle(
        { ok: false, success: null, error: null },
        formData
      );
      if (!result.ok) {
        toast(result.error);
      } else {
        toast(result.success);
      }
      return result;
    },
    { ok: false, success: null, error: null }
  );

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [nextId, setNextId] = useState(1);

  const addBlock = (type: Block["type"]) => {
    const newBlock: Block = { id: `${type}-${nextId}`, type };
    setBlocks([...blocks, newBlock]);
    setNextId(nextId + 1);
  };

  const moveBlockToNextPosition = (id: string) => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);

      if (index === -1 || index === prev.length - 1) {
        return prev;
      }

      const newBlocks = [...prev];
      [newBlocks[index], newBlocks[index + 1]] = [
        newBlocks[index + 1],
        newBlocks[index],
      ];

      return newBlocks;
    });
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const BlockList = (blocks: Block[]) =>
    blocks.map((block) => {
      switch (block.type) {
        case "text":
          return (
            <TextEditor
              key={block.id}
              id={block.id}
              onRemove={removeBlock}
              moveToNext={moveBlockToNextPosition}
            />
          );
        case "code":
          return (
            <CodeEditor key={block.id} id={block.id} onRemove={removeBlock} />
          );
        case "quote":
          return (
            <QuoteEditor key={block.id} id={block.id} onRemove={removeBlock} />
          );
        case "accordion":
          return (
            <AccordionEditor
              key={block.id}
              id={block.id}
              onRemove={removeBlock}
            />
          );
        case "img":
          return (
            <ImgEditor key={block.id} id={block.id} onRemove={removeBlock} />
          );
        case "imgCarousel":
          return (
            <ImgCarouselEditor
              key={block.id}
              id={block.id}
              onRemove={removeBlock}
            />
          );
        case "alert":
          return (
            <AlertEditor key={block.id} id={block.id} onRemove={removeBlock} />
          );
        case "quiz":
          return (
            <QuizEditor key={block.id} id={block.id} onRemove={removeBlock} />
          );
        default:
          return null;
      }
    });

  return (
    <main className="w-full max-w-7xl mx-auto flex justify-center items-center">
      <div className="w-full py-10 mx-4">
        <ReturnToHome />
        <form
          action={action}
          className="grid gap-2 grid-cols-1 md:grid-cols-[1fr_300px]"
        >
          <div className="flex flex-col gap-2">
            <TitleFieldset value={htmlTitle} setVal={setHtmlTitle} />
            <SubtitleFieldset
              value={htmlDescription}
              setVal={setHtmlDescription}
            />
            {BlockList(blocks)}
            <NewBlockButtons addBlock={addBlock} />
          </div>
          <div className="flex flex-col gap-1">
            <ConfirmFormButton label="Publicar" isPending={isPending} />
            <SaveFormButton label="Salvar" isPending={isPending} />
            <div className="max-h-96 border border-neutral-700">
              {state.error && <p>Error: {state.error}</p>}
            </div>
          </div>
        </form>
        {/* {state.success && <p>Success: {state.success}</p>} */}
      </div>
    </main>
  );
};

const NewBlockButtons = ({
  addBlock,
}: {
  addBlock: (type: Block["type"]) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={
            `w-fit mx-auto p-2 cursor-pointer rounded-xl ` +
            `outline-none border border-neutral-700 bg-neutral-800 ` +
            `transition-all duration-200 hover:bg-neutral-700 hover:ring-3 hover:ring-neutral-100 ` +
            `${isMenuOpen ? "bg-neutral-700 ring-3 ring-neutral-100" : ""} ` +
            `focus-within:ring-3 focus-within:ring-neutral-100 focus-within:bg-neutral-700 `
          }
        >
          <PlusIcon
            size={32}
            className={`transition-all duration-200 ${
              isMenuOpen ? "-rotate-[135deg] -translate-x-0.5" : "rotate-0"
            }`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContentClipPath className="data-[state=open]:animate-circular-open rounded-2xl">
        <ul
          className={
            `grid grid-cols-3 gap-1 mx-auto rounded overflow-hidden outline-none p-3 ` +
            `[&_li_button]:flex [&_li_button]:justify-center [&_li_button]:items-center ` +
            `[&_li_button]:size-12 [&_li_button]:cursor-pointer [&_li_button]:rounded-xl ` +
            `[&_li_button]:outline-none [&_li_button]:border [&_li_button]:border-neutral-700 [&_li_button]:bg-neutral-800 ` +
            `[&_li_button]:transition-all [&_li_button]:duration-300 ` +
            `[&_li_button]:hover:bg-neutral-700 [&_li_button]:active:bg-neutral-700 [&_li_button]:focus-visible:bg-neutral-700 ` +
            `[&_li_button]:focus-visible:text-theme-color [&_li_button]:focus-visible:ring-3 [&_li_button]:focus-visible:ring-neutral-100 ` +
            `[&_li_button]:hover:text-theme-color [&_li_button]:hover:ring-3 [&_li_button]:hover:ring-neutral-100 `
          }
        >
          {newBlockArray.map((prop, index) => (
            <li key={prop.id}>
              <button
                type="button"
                onClick={() => addBlock(prop.type)}
                className={`${isMenuOpen ? "animate-fade-in-up" : "opacity-0"}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {prop.svg}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContentClipPath>
    </Popover>
  );
};
