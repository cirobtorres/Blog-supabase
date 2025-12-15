import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
  memo,
  useEffect,
} from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { Popover, PopoverContentClipPath, PopoverTrigger } from "../ui/popover";
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
} from "../Icons";
import ImageEditor from "./ImageEditor";
import { cn } from "../../utils/classnames";
import { focusWithinWhiteRing } from "../../styles/classNames";
import { initialAccordionState } from "../../reducers";
import BlockEditorWrapper from "./accordion";
import TipTapTextEditor from "./TipTapTextEditor";
import { FloatingFieldset, FloatingInput, FloatingLabel } from "../Fieldsets";
import TipTapCodeEditor from "./TipTapCodeEditor";
import TipTapQuoteEditor from "./TipTapQuoteEditor";
import AccordionEditorContent from "./AccordionEditor";
import TipTapAlertEditor from "./TipTapAlertEditor";

const newBlockArray: BlockButton[] = [
  {
    id: "1",
    type: "text",
    tooltip: "Editor",
    svg: TextEditorIcon,
  },
  {
    id: "3",
    type: "code",
    tooltip: "Código",
    svg: CodeEditorIcon,
  },
  {
    id: "4",
    type: "quote",
    tooltip: "Citação",
    svg: QuoteEditorIcon,
  },
  {
    id: "5",
    type: "accordion",
    tooltip: "Acordeão",
    svg: AccordionEditorIcon,
  },
  {
    id: "6",
    type: "alert",
    tooltip: "Alerta",
    svg: AlertEditorIcon,
  },
  {
    id: "7",
    type: "image",
    tooltip: "Imagem",
    svg: ImageEditorIcon,
  },
  {
    id: "8",
    type: "imageCarousel",
    tooltip: "Imagens",
    svg: ImageCarouselEditorIcon,
  },
  {
    id: "9",
    type: "quiz",
    tooltip: "Quiz",
    svg: QuizEditorIcon,
  },
];

const BlockItem = memo(function BlockItem({
  block,
  updateBlock,
  removeBlock,
  moveToNext,
}: {
  block: Block;
  updateBlock: (id: string, data: UpdateBlockProps) => void;
  removeBlock: (id: string) => void;
  moveToNext: (id: string) => void;
}) {
  switch (block.type) {
    case "text":
      const textEditorId = "input-body-" + block.id; // input-body-text-1, 2, 3, 4, ..., n
      return (
        <BlockEditorWrapper
          id={block.id}
          wrapperLabel={block.id.charAt(0).toUpperCase() + block.id.slice(1)}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        >
          <div className="h-full flex flex-col p-1">
            <TipTapTextEditor
              id={textEditorId}
              setVal={(val) => updateBlock(block.id, { body: val })}
              defaultValue={(block.data as BlogText)?.body ?? ""}
            />
          </div>
        </BlockEditorWrapper>
      );
    case "code":
      const filenameEditorId = "input-filename-" + block.id; // input-filename-1, 2, 3, 4, ..., n
      const codeEditorId = "input-codebody-" + block.id; // input-codebody-1, 2, 3, 4, ..., n
      return (
        <BlockEditorWrapper
          id={block.id}
          wrapperLabel={block.id.charAt(0).toUpperCase() + block.id.slice(1)}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        >
          <fieldset className="h-full flex flex-col gap-1 p-1 [&_fieldset]:mt-0">
            <FloatingFieldset className="focus-within:ring-0 focus-within:ring-offset-0">
              <FloatingInput
                id={filenameEditorId}
                placeholder="path/to/my/file.py"
                value={(block.data as BlogCode)?.filename ?? ""}
                onChange={(e) =>
                  updateBlock(block.id, { filename: e.target.value })
                }
              />
              <FloatingLabel
                htmlFor={filenameEditorId}
                label="Caminho do Arquivo"
              />
            </FloatingFieldset>
            <TipTapCodeEditor
              id={codeEditorId}
              defaultCode={(block.data as BlogCode)?.code ?? ""}
              defaultlanguage={
                (block.data as BlogCode)?.language ?? "typescript"
              }
              setVal={(val) => updateBlock(block.id, { code: val })}
              setLanguage={(val) => updateBlock(block.id, { language: val })}
            />
          </fieldset>
        </BlockEditorWrapper>
      );
    case "quote":
      const quoteEditorId = "input-quote-" + block.id; // input-quote-text-1, 2, 3, 4, ..., n
      const authorEditorId = "input-author-" + block.id; // input-author-text-1, 2, 3, 4, ..., n
      return (
        <BlockEditorWrapper
          id={block.id}
          wrapperLabel={block.id.charAt(0).toUpperCase() + block.id.slice(1)}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        >
          <fieldset className="h-full flex flex-col gap-1 p-1 [&_fieldset]:mt-0">
            <FloatingFieldset>
              <FloatingInput
                id={authorEditorId}
                placeholder="Arthur Schopenhauer"
                value={(block.data as BlogQuote)?.author ?? ""}
                onChange={(e) =>
                  updateBlock(block.id, { author: e.target.value })
                }
              />
              <FloatingLabel
                htmlFor={authorEditorId}
                label="Autor da citação"
              />
            </FloatingFieldset>
            <TipTapQuoteEditor
              id={quoteEditorId}
              setVal={(val) => updateBlock(block.id, { quote: val })}
              defaultValue={(block.data as BlogQuote)?.quote ?? ""}
            />
          </fieldset>
        </BlockEditorWrapper>
      );
    case "accordion":
      const accordions = (block.data as BlogAccordion)?.accordions ?? null;
      const setAccordions = (val: AccordionItem[]) =>
        updateBlock(block.id, { accordions: val });
      return (
        <BlockEditorWrapper
          id={block.id}
          wrapperLabel={block.id.charAt(0).toUpperCase() + block.id.slice(1)}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        >
          <AccordionEditorContent {...{ accordions, setAccordions }} />
        </BlockEditorWrapper>
      );
    case "image": // TODO: incomplete
      return (
        <BlockEditorWrapper
          id={block.id}
          wrapperLabel={block.id.charAt(0).toUpperCase() + block.id.slice(1)}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        >
          <ImageEditor
            key={block.id}
            id={block.id}
            wrapperLabel="Imagem"
            src={(block.data as BlogImage)?.src ?? ""}
            alt={(block.data as BlogImage)?.alt ?? ""}
            filename={(block.data as BlogImage)?.filename ?? ""}
            caption={(block.data as BlogImage)?.caption ?? ""}
            setSrc={(val) => updateBlock(block.id, { src: val })}
            setAlt={(val) => updateBlock(block.id, { alt: val })}
            setFile={(val) => updateBlock(block.id, { file: val })}
            setFilename={(val) => updateBlock(block.id, { filename: val })}
            setCaption={(val) => updateBlock(block.id, { caption: val })}
            onRemove={removeBlock}
            moveToNext={moveToNext}
          />
        </BlockEditorWrapper>
      );
    case "imageCarousel": // TODO: incomplete
      return (
        <BlockEditorWrapper
          id={block.id}
          wrapperLabel={block.id.charAt(0).toUpperCase() + block.id.slice(1)}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        >
          ImageCarousel
        </BlockEditorWrapper>
      );
    case "alert":
      const alertEditorId = "input-alert-" + block.id; // input-alert-text-1, 2, 3, 4, ..., n
      return (
        <BlockEditorWrapper
          id={block.id}
          wrapperLabel={block.id.charAt(0).toUpperCase() + block.id.slice(1)}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        >
          <fieldset className="h-full flex flex-col p-1">
            <TipTapAlertEditor
              id={alertEditorId}
              defaultBody={(block.data as BlogAlert)?.body ?? ""}
              setVal={(val) => updateBlock(block.id, { body: val })}
              defaultType={(block.data as BlogAlert)?.type ?? "default"}
              setDefaultType={(val) => updateBlock(block.id, { type: val })}
            />
          </fieldset>
        </BlockEditorWrapper>
      );
    case "quiz": // TODO: incomplete
      return (
        <BlockEditorWrapper
          id={block.id}
          wrapperLabel={block.id.charAt(0).toUpperCase() + block.id.slice(1)}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        >
          Quiz
        </BlockEditorWrapper>
      );
    default:
      return null;
  }
});

const BlockList = ({
  blocks,
  setBlocks,
}: {
  blocks: Block[];
  setBlocks: Dispatch<SetStateAction<Block[]>>;
}) => {
  const [, setIsDragActive] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(useSensor(TouchSensor), useSensor(PointerSensor));

  const moveToNext = useCallback(
    (id: string) => {
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
    },
    [setBlocks]
  );

  const updateBlock = useCallback(
    (id: string, data: UpdateBlockProps) => {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === id
            ? ({
                ...b,
                data: {
                  ...(b.data as Record<string, unknown>),
                  ...(data as Record<string, unknown>),
                },
              } as Block)
            : b
        )
      );
    },
    [setBlocks]
  );

  const removeBlock = useCallback(
    (id: string) => {
      setBlocks((prevBlocks) => prevBlocks.filter((b) => b.id !== id));
    },
    [setBlocks]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        return arrayMove(blocks, oldIndex, newIndex);
      });
    }

    setIsDragActive(null);
  }

  function handleDragStart(event: DragStartEvent) {
    setIsDragActive(event.active.id);
  }

  function handleDragCancel() {
    setIsDragActive(null);
  }

  const renderedBlocks = useMemo(() => {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <BlockItem
              key={block.id}
              block={block}
              updateBlock={updateBlock}
              removeBlock={removeBlock}
              moveToNext={moveToNext}
            />
          ))}
        </SortableContext>
      </DndContext>
    );
  }, [blocks, updateBlock, removeBlock, moveToNext]);

  return <>{renderedBlocks}</>;
};

// TODO: quiz
// TODO: image
// TODO: imageCarousel
const createNewBlock = (id: string, type: Block["type"]): Block => {
  switch (type) {
    case "text":
      return { id, type, data: { body: "" } };
    case "quote":
      return { id, type, data: { author: "", quote: "" } };
    case "accordion":
      return {
        id,
        type,
        data: {
          accordions: initialAccordionState,
        },
      };
    case "alert":
      return {
        id,
        type,
        data: { accordion: { title: "", body: "" }, type: "default" },
      };

    case "code":
      return {
        id,
        type,
        data: { filename: "", code: "", language: "typescript" },
      };

    case "image":
      return {
        id,
        type,
        data: {
          file: undefined,
          src: "",
          alt: "",
          filename: "",
          caption: "",
        },
      };
    case "imageCarousel":
      return { id, type, data: {} }; // TODO
    case "quiz":
      return { id, type, data: {} }; // TODO

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

  useEffect(() => {
    const usedIds = blocks
      .map((b) => parseInt(b.id.split("-").pop() || "0", 10))
      .filter((n) => !isNaN(n));

    const maxUsedId = usedIds.length > 0 ? Math.max(...usedIds) : 0;
    setNextId(maxUsedId + 1);
  }, [blocks]);

  const addBlock = (type: Block["type"]) => {
    const newBlock = createNewBlock(`${type}-${nextId}`, type);
    setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
    setNextId((prev) => prev + 1);
  };

  return (
    <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <PopoverTrigger
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
        }}
        className={cn(
          "size-10 flex justify-center items-center mx-auto p-1 cursor-pointer transition-all duration-300 rounded-xl outline-none border border-neutral-700 hover:border-neutral-600",
          focusWithinWhiteRing,
          isMenuOpen ? "bg-neutral-700" : "bg-neutral-800 hover:bg-neutral-700"
        )}
      >
        <PlusIcon
          className={`transition-all duration-300 ${
            isMenuOpen
              ? "stroke-neutral-100 -rotate-135 -translate-x-0.5"
              : "stroke-neutral-500 rotate-0"
          }`}
        />
      </PopoverTrigger>
      <PopoverContentClipPath side="top">
        <ul className="grid grid-cols-3 gap-2 mx-auto rounded overflow-hidden outline-none p-3">
          {newBlockArray.map((prop, index) => (
            <li
              key={prop.id}
              className="flex flex-col gap-2 items-center justify-between group"
            >
              <button
                type="button"
                onClick={() => addBlock(prop.type)}
                className={`${
                  isMenuOpen ? "animate-balloon" : "opacity-0"
                } flex justify-center items-center size-11 cursor-pointer rounded-full outline-none border border-neutral-700 bg-neutral-900 transition-all duration-300 text-neutral-300 fill-neutral-700 hover:border-neutral-600 hover:bg-neutral-800 active:bg-neutral-700 group-focus-within:ring-2 group-focus-within:ring-neutral-100 group-focus-within:ring-offset-2 group-focus-within:ring-offset-neutral-950 group-focus-within:bg-[#1a1a1a] peer`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {prop.svg({ className: "size-[18px]" })}
              </button>
              <p
                className={`w-fit text-xs text-center text-neutral-600 transition-all duration-300 peer-hover:text-neutral-100 group-focus-within:text-neutral-100 ${
                  isMenuOpen ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {prop.tooltip}
              </p>
            </li>
          ))}
        </ul>
      </PopoverContentClipPath>
    </Popover>
  );
};

export { BlockList, NewBlockButtons };
