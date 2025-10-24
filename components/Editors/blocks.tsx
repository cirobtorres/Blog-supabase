import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
  memo,
} from "react";
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
import {
  AccordionEditor,
  AlertEditor,
  CodeEditor,
  ImageCarouselEditor,
  ImageEditor,
  QuizEditor,
  QuoteEditor,
  TextEditor,
} from ".";
import { cn } from "@/utils/classnames";
import { focusWithinWhiteRing } from "@/styles/classNames";
import { initialAccordionState } from "@/reducers";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  DragStartEvent,
  UniqueIdentifier,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

const newBlockArray: BlockButton[] = [
  {
    id: "1",
    type: "text",
    tooltip: "Editor",
    svg: TextEditorIcon,
  },
  {
    id: "2",
    type: "code",
    tooltip: "Código",
    svg: CodeEditorIcon,
  },
  {
    id: "3",
    type: "quote",
    tooltip: "Citação",
    svg: QuoteEditorIcon,
  },
  {
    id: "4",
    type: "accordion",
    tooltip: "Acordeão",
    svg: AccordionEditorIcon,
  },
  {
    id: "5",
    type: "alert",
    tooltip: "Alerta",
    svg: AlertEditorIcon,
  },
  {
    id: "6",
    type: "image",
    tooltip: "Imagem",
    svg: ImageEditorIcon,
  },
  {
    id: "7",
    type: "imageCarousel",
    tooltip: "Imagens",
    svg: ImageCarouselEditorIcon,
  },
  {
    id: "8",
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
      return (
        <TextEditor
          key={block.id}
          id={block.id}
          wrapperLabel="Editor de Texto"
          value={(block.data as BlogText)?.body ?? ""}
          setVal={(val) => updateBlock(block.id, { body: val })}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        />
      );
    case "code":
      return (
        <CodeEditor
          key={block.id}
          id={block.id}
          wrapperLabel="Editor de Código"
          filename={(block.data as BlogCode)?.filename ?? ""}
          code={(block.data as BlogCode)?.code ?? ""}
          language={(block.data as BlogCode)?.language ?? "typescript"}
          setFilename={(val) => updateBlock(block.id, { filename: val })}
          setCode={(val) => updateBlock(block.id, { code: val })}
          setLanguage={(val) => updateBlock(block.id, { language: val })}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        />
      );
    case "quote":
      return (
        <QuoteEditor
          key={block.id}
          id={block.id}
          wrapperLabel="Citação"
          author={(block.data as BlogQuote)?.author ?? ""}
          quote={(block.data as BlogQuote)?.quote ?? ""}
          setAuthor={(val) => updateBlock(block.id, { author: val })}
          setQuote={(val) => updateBlock(block.id, { quote: val })}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        />
      );
    case "accordion":
      return (
        <AccordionEditor
          key={block.id}
          id={block.id}
          accordions={(block.data as BlogAccordion)?.accordions ?? null}
          setAccordions={(val) => updateBlock(block.id, { accordions: val })}
          wrapperLabel="Acordeão"
          onRemove={removeBlock}
          moveToNext={moveToNext}
        />
      );
    case "image":
      return (
        // TODO
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
      );
    case "imageCarousel":
      return (
        // TODO
        <ImageCarouselEditor
          key={block.id}
          id={block.id}
          wrapperLabel="Carrossel de Imagem"
          onRemove={removeBlock}
          moveToNext={moveToNext}
        />
      );
    case "alert":
      return (
        <AlertEditor
          key={block.id}
          id={block.id}
          wrapperLabel="Alerta"
          type={(block.data as BlogAlert)?.type ?? "default"}
          body={(block.data as BlogAlert)?.body ?? ""}
          setType={(val) => updateBlock(block.id, { type: val })}
          setBody={(val) => updateBlock(block.id, { body: val })}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        />
      );
    case "quiz":
      return (
        // TODO
        <QuizEditor
          key={block.id}
          id={block.id}
          wrapperLabel="Quiz"
          onRemove={removeBlock}
          moveToNext={moveToNext}
        />
      );
    default:
      return null;
  }
});

const SortableItem = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-full"
      tabIndex={-1}
    >
      {children}
    </div>
  );
};

const BlockList = ({
  blocks,
  setBlocks,
}: {
  blocks: Block[];
  setBlocks: Dispatch<SetStateAction<Block[]>>;
}) => {
  const [isDragActive, setIsDragActive] = useState<UniqueIdentifier | null>(
    null
  );

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Press delay of 250ms
        tolerance: 25, // Tolerance of 25px of movement
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250, // Press delay of 250ms
        tolerance: 25, // Tolerance of 25px of movement
      },
    })
  );

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
    console.log("start");
    setIsDragActive(event.active.id);
  }

  function handleDragCancel() {
    console.log("cancel");
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
            <SortableItem key={block.id} id={block.id}>
              <BlockItem
                key={block.id}
                block={block}
                updateBlock={updateBlock}
                removeBlock={removeBlock}
                moveToNext={moveToNext}
              />
            </SortableItem>
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
  setBlocks,
}: {
  setBlocks: Dispatch<SetStateAction<Block[]>>;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [nextId, setNextId] = useState(1);

  const addBlock = (type: Block["type"]) => {
    const newBlock = createNewBlock(`${type}-${nextId}`, type);
    setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
    setNextId(nextId + 1);
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
              ? "stroke-neutral-100 -rotate-[135deg] -translate-x-0.5"
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
