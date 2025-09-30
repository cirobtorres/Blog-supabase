import { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/utils/classnames";
import { DeleteEditor } from "@/components/Buttons/client";
import { Popover, PopoverContentClipPath, PopoverTrigger } from "../ui/popover";
import {
  AccordionEditorIcon,
  AlertEditorIcon,
  ArrowDownIcon,
  CodeEditorIcon,
  ImageCarouselEditorIcon,
  ImageEditorIcon,
  PlusIcon,
  QuizEditorIcon,
  QuoteEditorIcon,
  TextEditorIcon,
} from "../Icons";
import {
  AccordionEditor,
  AlertEditor,
  CodeEditor,
  ImgCarouselEditor,
  ImgEditor,
  QuizEditor,
  QuoteEditor,
  TextEditor,
} from "./editors";
import ToolTipWrapper from "../ui/tooltip";

interface BlockIcons {
  svg: React.ReactNode;
  tooltip: string;
}

type BlockButton = BlockType<BlockIcons>;

const newBlockArray: BlockButton[] = [
  {
    id: "1",
    type: "text",
    tooltip: "Editor",
    svg: <TextEditorIcon size={20} />,
  },
  {
    id: "2",
    type: "code",
    tooltip: "Código",
    svg: <CodeEditorIcon size={20} />,
  },
  {
    id: "3",
    type: "quote",
    tooltip: "Citação",
    svg: <QuoteEditorIcon size={20} />,
  },
  {
    id: "4",
    type: "accordion",
    tooltip: "Acordeão",
    svg: <AccordionEditorIcon size={20} />,
  },
  {
    id: "5",
    type: "alert",
    tooltip: "Alerta",
    svg: <AlertEditorIcon size={20} />,
  },
  {
    id: "6",
    type: "img",
    tooltip: "Imagem",
    svg: <ImageEditorIcon size={20} />,
  },
  {
    id: "7",
    type: "imgCarousel",
    tooltip: "Imagens",
    svg: <ImageCarouselEditorIcon size={20} />,
  },
  {
    id: "8",
    type: "quiz",
    tooltip: "Quiz",
    svg: <QuizEditorIcon size={20} />,
  },
];

const BlockList = ({
  blocks,
  setBlocks,
}: {
  blocks: Block[];
  setBlocks: Dispatch<SetStateAction<Block[]>>;
}) => {
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

  const updateBlock = (id: string, data: any) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, data: { ...b.data, ...data } } : b
      )
    );
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  return blocks.map((block) => {
    switch (block.type) {
      case "text":
        return (
          <TextEditor
            key={block.id}
            id={block.id}
            wrapperLabel="Editor de Texto"
            value={(block.data as { body: string })?.body ?? ""}
            setVal={(val) => updateBlock(block.id, { body: val })}
            onRemove={removeBlock}
            moveToNext={moveBlockToNextPosition}
          />
        );
      case "code":
        return (
          <CodeEditor
            key={block.id}
            id={block.id}
            wrapperLabel="Editor de Código"
            filename={(block.data as Code)?.filename ?? ""}
            code={(block.data as Code)?.code ?? ""}
            language={(block.data as Code)?.language ?? ""}
            setFilename={(val) => updateBlock(block.id, { filename: val })}
            setCode={(val) => updateBlock(block.id, { code: val })}
            setLanguage={(val) => updateBlock(block.id, { language: val })}
            onRemove={removeBlock}
            moveToNext={moveBlockToNextPosition}
          />
        );
      case "quote":
        return (
          <QuoteEditor
            key={block.id}
            id={block.id}
            wrapperLabel="Citação"
            author={(block.data as Quote)?.author ?? ""}
            quote={(block.data as Quote)?.quote ?? ""}
            setAuthor={(val) => updateBlock(block.id, { author: val })}
            setQuote={(val) => updateBlock(block.id, { quote: val })}
            onRemove={removeBlock}
            moveToNext={moveBlockToNextPosition}
          />
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
          <ImgEditor
            key={block.id}
            id={block.id}
            wrapperLabel="Imagem"
            src={(block.data as Image)?.src ?? ""}
            alt={(block.data as Image)?.alt ?? ""}
            filename={(block.data as Image)?.filename ?? ""}
            caption={(block.data as Image)?.caption ?? ""}
            setSrc={(val) => updateBlock(block.id, { image: val })}
            setAlt={(val) => updateBlock(block.id, { altname: val })}
            setFilename={(val) => updateBlock(block.id, { filename: val })}
            setCaption={(val) => updateBlock(block.id, { caption: val })}
            onRemove={removeBlock}
            moveToNext={moveBlockToNextPosition}
          />
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
};

const createNewBlock = (id: string, type: Block["type"]): Block => {
  switch (type) {
    case "text":
    case "quote":
    case "accordion":
    case "alert":
      return { id, type, data: { body: "" } };

    case "code":
      return {
        id,
        type,
        data: { filename: "", code: "", language: "typescript" },
      };

    case "img":
    case "imgCarousel":
    case "quiz":
      return { id, type, data: {} as any };

    default:
      throw new Error(`Tipo de bloco não suportado: ${type}`);
  }
};

const NewBlockButtons = ({
  blocks,
  setBlocks,
}: {
  blocks: Block[];
  setBlocks: Dispatch<SetStateAction<Block[]>>;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [nextId, setNextId] = useState(1);

  const addBlock = (type: Block["type"]) => {
    const newBlock = createNewBlock(`${type}-${nextId}`, type);
    setBlocks([...blocks, newBlock]);
    setNextId(nextId + 1);
  };

  return (
    <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          className={
            `w-fit mx-auto p-1 cursor-pointer rounded-xl ` +
            `outline-none border border-neutral-700 ` +
            `transition-all duration-200 hover:bg-neutral-700 hover:ring-3 hover:ring-neutral-100 ` +
            `focus-within:ring-3 focus-within:ring-neutral-100 focus-within:bg-neutral-700 ` +
            `${isMenuOpen ? "bg-neutral-700" : "bg-neutral-800"} `
          }
        >
          <PlusIcon
            size={28}
            classNames={`transition-all duration-200 ${
              isMenuOpen ? "-rotate-[135deg] -translate-x-0.5" : "rotate-0"
            }`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContentClipPath className="data-[state=open]:animate-circular-open rounded-2xl bg-neutral-900">
        <ul
          className={
            `grid grid-cols-3 gap-2 mx-auto rounded overflow-hidden outline-none p-3 ` +
            `[&_li_button]:flex [&_li_button]:justify-center [&_li_button]:items-center ` +
            `[&_li_button]:size-12 [&_li_button]:cursor-pointer [&_li_button]:rounded-xl ` +
            `[&_li_button]:outline-none [&_li_button]:border [&_li_button]:border-neutral-700 [&_li_button]:bg-neutral-800 ` +
            `[&_li_button]:transition-all [&_li_button]:duration-300 ` +
            `[&_li_button]:text-neutral-300 [&_li_button]:fill-neutral-700 ` +
            `[&_li_button]:hover:bg-neutral-700 [&_li_button]:active:bg-neutral-700 [&_li_button]:focus-within:bg-neutral-700 ` +
            // `[&_li_button]:hover:text-theme-color [&_li_button]:hover:ring-3 [&_li_button]:hover:ring-neutral-100 ` +
            `[&_li_button]:focus-within:ring-3 [&_li_button]:focus-within:ring-neutral-100 ` // [&_li_button]:focus-within:text-theme-color
          }
        >
          {newBlockArray.map((prop, index) => (
            <li key={prop.id}>
              <div className="flex flex-col gap-1 items-center justify-between">
                <button
                  type="button"
                  onClick={() => addBlock(prop.type)}
                  className={`${isMenuOpen ? "animate-balloon" : "opacity-0"}`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {prop.svg}
                </button>
                <small>
                  <p
                    className={`w-fit text-center text-neutral-600 ${
                      isMenuOpen ? "animate-fade-in-up" : "opacity-0"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {prop.tooltip}
                  </p>
                </small>
              </div>
            </li>
          ))}
        </ul>
      </PopoverContentClipPath>
    </Popover>
  );
};

const BlockEditorWrapper = ({
  children,
  id,
  wrapperLabel,
  onRemove,
  moveToNext,
}: {
  children: React.ReactNode;
  id: string;
  wrapperLabel: string;
  onRemove: (id: string) => void;
  moveToNext: any;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      data-slot="block-editor-wrapper"
      className={
        `overflow-hidden rounded-lg transition-ring duration-300 animate-pop group ` +
        `border border-neutral-700 hover:border-neutral-600 focus-within:border-neutral-600 ` +
        `hover:ring-3 hover:ring-neutral-100 focus-within:ring-3 focus-within:ring-neutral-100 `
      }
    >
      <EditorHeader
        id={id}
        label={wrapperLabel}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        moveToNext={moveToNext}
        onRemove={() => onRemove(id)}
      />
      <div
        className={cn(
          "duration-300",
          isExpanded ? "h-[372px]" : "h-0 [&_*]:hidden"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const EditorHeader = ({
  id,
  label,
  isExpanded,
  setIsExpanded,
  moveToNext,
  onRemove,
}: {
  id: string;
  label: string;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  moveToNext: () => void;
  onRemove: () => void;
}) => {
  const dialogState = useState(false);
  const [isDialogOpen, _] = dialogState;

  return (
    <div
      className={
        `${
          isExpanded &&
          `border-b border-neutral-700 hover:border-neutral-600 ` +
            `focus-within:border-neutral-600 group-hover:border-neutral-600 group-focus-within:border-neutral-600`
        } ` +
        `cursor-pointer w-full h-12 flex items-center justify-between px-4 py-2 transition-colors ` +
        `bg-neutral-800 hover:bg-neutral-700 group-hover:bg-neutral-700 group-focus-within:bg-neutral-700 `
      }
      onClick={() => {
        if (isDialogOpen) return;
        setIsExpanded(!isExpanded);
      }}
    >
      <ExpandButtons
        label={label}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        dialogState={dialogState}
      />
      <UtilsButtons
        id={id}
        moveToNext={moveToNext}
        onRemove={onRemove}
        dialogState={dialogState}
      />
    </div>
  );
};

const ExpandButtons = ({
  label,
  isExpanded,
  setIsExpanded,
  dialogState,
}: {
  label: string;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  dialogState: [boolean, Dispatch<SetStateAction<boolean>>];
}) => {
  const [isDialogOpen, _] = dialogState;

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => {
          if (isDialogOpen) return;
          setIsExpanded(!isExpanded);
        }}
        className={
          `p-1 rounded cursor-pointer border-none outline-none ` +
          `transition-all focus-visible:ring-3 focus-visible:ring-neutral-500 focus-visible:bg-neutral-800 `
          // `focus-visible:[&_*]:stroke-theme-color `
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "lucide lucide-chevron-down-icon lucide-chevron-down stroke-neutral-300 transition-all",
            isExpanded ? "rotate-180" : ""
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <p
        className="text-sm font-medium text-neutral-400" // transition-all group-focus-within:text-theme-color
      >
        {label}
      </p>
    </div>
  );
};

const UtilsButtons = ({
  id,
  moveToNext,
  onRemove,
  dialogState,
}: {
  id: string;
  moveToNext: (id: string) => void;
  onRemove: () => void;
  dialogState: [boolean, Dispatch<SetStateAction<boolean>>];
}) => (
  <div className="flex items-center gap-4">
    <ToolTipWrapper tooltip="Mover para Baixo">
      <button
        type="button"
        className={
          `z-10 p-1 cursor-pointer rounded group/button ` +
          `transition-all hover:[&_svg]:stroke-theme-color ` +
          `border-none outline-none ` + // hover:animate-bouncing-arrow
          `focus-visible:ring-[3px] focus-visible:ring-neutral-500 ` +
          `focus-visible:bg-neutral-800 ` // focus-visible:[&_*]:stroke-theme-color
        }
        onClick={(e) => {
          e.stopPropagation();
          moveToNext(id);
        }}
      >
        <ArrowDownIcon size={16} />
      </button>
    </ToolTipWrapper>
    <DeleteEditor onRemove={onRemove} dialogState={dialogState} />
  </div>
);

export { BlockList, BlockEditorWrapper, NewBlockButtons };
