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

const newBlockArray: BlockButton[] = [
  {
    id: "1",
    type: "text",
    tooltip: "Editor",
    svg: <TextEditorIcon className="size-5" />,
  },
  {
    id: "2",
    type: "code",
    tooltip: "Código",
    svg: <CodeEditorIcon className="size-5" />,
  },
  {
    id: "3",
    type: "quote",
    tooltip: "Citação",
    svg: <QuoteEditorIcon className="size-5" />,
  },
  {
    id: "4",
    type: "accordion",
    tooltip: "Acordeão",
    svg: <AccordionEditorIcon className="size-5" />,
  },
  {
    id: "5",
    type: "alert",
    tooltip: "Alerta",
    svg: <AlertEditorIcon className="size-5" />,
  },
  {
    id: "6",
    type: "image",
    tooltip: "Imagem",
    svg: <ImageEditorIcon className="size-5" />,
  },
  {
    id: "7",
    type: "imageCarousel",
    tooltip: "Imagens",
    svg: <ImageCarouselEditorIcon className="size-5" />,
  },
  {
    id: "8",
    type: "quiz",
    tooltip: "Quiz",
    svg: <QuizEditorIcon className="size-5" />,
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
          value={(block.data as { body: string })?.body ?? ""}
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
          language={(block.data as BlogCode)?.language ?? ""}
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
          type={(block.data as BlogAccordion)?.type ?? false}
          collapsible={(block.data as BlogAccordion)?.collapsible ?? false}
          setType={(val) => updateBlock(block.id, { type: val })}
          setCollapsible={(val) => updateBlock(block.id, { collapsible: val })}
          setAccordions={(val) => updateBlock(block.id, { accordions: val })}
          wrapperLabel="Acordeão"
          onRemove={removeBlock}
          moveToNext={moveToNext}
        />
      );
    case "image":
      return (
        <ImageEditor
          key={block.id}
          id={block.id}
          wrapperLabel="Imagem"
          src={(block.data as BlogImage)?.src ?? ""}
          alt={(block.data as BlogImage)?.alt ?? ""}
          setFile={(val) => updateBlock(block.id, { file: val })}
          filename={(block.data as BlogImage)?.filename ?? ""}
          caption={(block.data as BlogImage)?.caption ?? ""}
          setSrc={(val) => updateBlock(block.id, { src: val })}
          setAlt={(val) => updateBlock(block.id, { alt: val })}
          setFilename={(val) => updateBlock(block.id, { filename: val })}
          setCaption={(val) => updateBlock(block.id, { caption: val })}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        />
      );
    case "imageCarousel":
      return (
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
          value={(block.data as { body: string })?.body ?? ""}
          setVal={(val) => updateBlock(block.id, { body: val })}
          onRemove={removeBlock}
          moveToNext={moveToNext}
        />
      );
    case "quiz":
      return (
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

const BlockList = ({
  blocks,
  setBlocks,
}: {
  blocks: Block[];
  setBlocks: Dispatch<SetStateAction<Block[]>>;
}) => {
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

  // const updateBlock = useCallback(
  //   (id: string, data: any) => {
  //     setBlocks((prev) =>
  //       prev.map((b) =>
  //         b.id === id ? { ...b, data: { ...b.data, ...data } } : b
  //       )
  //     );
  //   },
  //   [setBlocks]
  // );

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

  const renderedBlocks = useMemo(() => {
    return blocks.map((block) => (
      <BlockItem
        key={block.id}
        block={block}
        updateBlock={updateBlock}
        removeBlock={removeBlock}
        moveToNext={moveToNext}
      />
    ));
  }, [blocks, updateBlock, removeBlock, moveToNext]);

  return <>{renderedBlocks}</>;
};

// TODO: quiz
// TODO: imageCarousel
const createNewBlock = (id: string, type: Block["type"]): Block => {
  switch (type) {
    case "text":
      return { id, type, data: { body: "" } };
    case "quote":
      return { id, type, data: { author: "", quote: "" } };
    case "accordion":
      return { id, type, data: { type: true, collapsible: true } };
    case "alert":
      return { id, type, data: { body: "" } };

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
      <PopoverContentClipPath className="data-[state=open]:animate-circular-open rounded-2xl bg-neutral-900">
        <ul
          className={
            `grid grid-cols-3 gap-2 mx-auto rounded overflow-hidden outline-none p-3 ` +
            `[&_li_button]:flex [&_li_button]:justify-center [&_li_button]:items-center ` +
            `[&_li_button]:size-12 [&_li_button]:cursor-pointer [&_li_button]:rounded-xs ` +
            `[&_li_button]:outline-none [&_li_button]:border [&_li_button]:border-neutral-700 [&_li_button]:bg-neutral-800 ` +
            `[&_li_button]:transition-all [&_li_button]:duration-300 ` +
            `[&_li_button]:text-neutral-300 [&_li_button]:fill-neutral-700 ` +
            `[&_li_button]:hover:bg-neutral-700 [&_li_button]:active:bg-neutral-700 ` +
            `[&_li_button]:focus-within:ring-2 [&_li_button]:focus-within:ring-neutral-100 ` +
            `[&_li_button]:focus-within:ring-offset-2 [&_li_button]:focus-within:ring-offset-neutral-950 ` +
            `[&_li_button]:focus-within:bg-neutral-700 `
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

export { BlockList, NewBlockButtons };
