import {
  EditorFieldset,
  CodeFieldset,
  QuoteFieldset,
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
} from "../Fieldsets";
import { BlockEditorWrapper } from "./utils";
import {
  DragAndDropZone,
  getImageWidthAndHeight,
  InfoZone,
  isNotImageFile,
} from "../Fieldsets/ArticleEditor";
import { useEffect, useReducer, useRef, useState } from "react";
import { comercialDate } from "@/utils/dates";
import {
  accordionReducer,
  imageInitialState,
  imageReducer,
  initialAccordionState,
} from "@/reducers";
import { MinusIcon, PlusIcon } from "../Icons";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const AccordionEditor = (props: AccordionEditorProps) => {
  // TODO: definir os seguintes atributos do accordion: type e defaultValue
  const [accordions, accordDispatch] = useReducer(
    accordionReducer,
    initialAccordionState
  );

  const AddButton = () => (
    <button
      type="button"
      onClick={() => accordDispatch({ type: "ADD" })}
      className={
        "mx-auto w-fit flex justify-center items-center cursor-pointer p-1 rounded-sm outline-none transition-all duration-300 " +
        "border border-neutral-700 " +
        "bg-neutral-900 " +
        "hover:border-neutral-600 hover:bg-neutral-800 " +
        "focus-visible:ring-2 focus-visible:border-transparent focus-visible:ring-neutral-100 "
      }
    >
      <PlusIcon />
    </button>
  );

  const RemoveButton = ({ accordionId: id }: { accordionId: string }) => (
    <button
      type="button"
      onClick={() => accordDispatch({ type: "REMOVE", id })}
      className={
        "flex justify-center items-center cursor-pointer p-1 rounded-sm outline-none transition-all duration-300 " +
        "border border-neutral-700 " +
        "bg-neutral-900 " +
        "hover:border-neutral-600 hover:bg-neutral-800 " +
        "focus-visible:ring-2 focus-visible:border-transparent focus-visible:ring-neutral-100 "
      }
    >
      <MinusIcon />
    </button>
  );

  const CheckBoxes = () => {
    const [type, setType] = useState(true);
    const [collapsible, setCollapsible] = useState(true);

    return (
      <div className="flex flex-row justify-center items-start gap-1">
        <div className="flex-1 p-1 rounded-sm border border-neutral-800 bg-neutral-900">
          <fieldset>
            <label
              htmlFor="checkbox-accordion-type"
              className="grid grid-cols-[24px_60px_1fr] items-center gap-2"
            >
              <Checkbox
                id="checkbox-accordion-type"
                checked={type}
                onCheckedChange={() => setType(!type)}
                className="cursor-pointer"
              />
              {type ? "Único" : "Múltiplo"}
              <p className="text-neutral-500 text-xs">
                {type
                  ? "Apenas um item é expandido por vez."
                  : "Múltiplos itens são expandidos por vez."}
              </p>
            </label>
          </fieldset>
        </div>
        <div className="p-1 pr-4 rounded-sm border border-neutral-800 bg-neutral-900">
          <fieldset>
            <label
              htmlFor="checkbox-accordion-collapsible"
              className="grid grid-cols-[24px_80px_1fr] items-center gap-2"
            >
              <Checkbox
                id="checkbox-accordion-collapsible"
                checked={collapsible}
                onCheckedChange={() => setCollapsible(!collapsible)}
                className="cursor-pointer"
              />
              {collapsible ? "Colapsar" : "Fixo"}
              <ul>
                <li>
                  <p className="text-neutral-500 text-xs">
                    True: permite abrir e fechar o acordeão.
                  </p>
                </li>
              </ul>
            </label>
          </fieldset>
        </div>
      </div>
    );
  };

  return (
    <BlockEditorWrapper {...props}>
      <div className="max-w-3xl mx-auto p-1 flex flex-col justify-center gap-1 ">
        <CheckBoxes />
        <RadioGroup className="w-full gap-1">
          {accordions.map((accordion, index) => (
            <div
              key={accordion.id}
              className="w-full grid grid-cols-[20px_200px_minmax(0,1fr)_36px] items-center rounded px-1 py-2 gap-1 border-2 border-neutral-800 has-[input:checked]:bg-neutral-800 has-[input:checked]:border-theme-color"
            >
              <RadioGroupItem value={accordion.id} />
              <FloatingFieldset>
                <FloatingInput
                  id={`title-${accordion.id}`}
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
              <FloatingFieldset>
                <FloatingInput
                  id={`message-${accordion.id}`}
                  value={accordion.message}
                  onChange={(e) =>
                    accordDispatch({
                      type: "UPDATE_MESSAGE",
                      id: accordion.id,
                      value: e.target.value,
                    })
                  }
                />
                <FloatingLabel
                  htmlFor={`message-${accordion.id}`}
                  label="Mensagem"
                />
              </FloatingFieldset>
              {index > 0 && <RemoveButton accordionId={accordion.id} />}
            </div>
          ))}
        </RadioGroup>
        <AddButton />
      </div>
    </BlockEditorWrapper>
  );
}; // TODO

const AlertEditor = (props: AlertEditorProps) => (
  <BlockEditorWrapper {...props}>Alert</BlockEditorWrapper>
); // TODO

const CodeEditor = (props: CodeEditorProps) => {
  return (
    <BlockEditorWrapper {...props}>
      <CodeFieldset {...props} />
    </BlockEditorWrapper>
  );
};

const HoverCardEditor = (props: HoverCardEditorProps) => (
  <BlockEditorWrapper {...props}>HoverCard</BlockEditorWrapper>
); // TODO

const ImageCarouselEditor = (props: ImageCarouselEditorProps) => (
  <BlockEditorWrapper {...props}>ImageCarousel</BlockEditorWrapper>
); // TODO

const ImageEditor = ({
  id,
  src,
  alt,
  filename,
  caption,
  setFile,
  setSrc,
  setAlt,
  setFilename,
  setCaption,
  wrapperLabel,
  moveToNext,
  onRemove,
}: ImageEditorProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageData, dispatch] = useReducer(imageReducer, imageInitialState);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // <input type="file"> triggers onChange only if (.value) changes
    // Reseting input.value = "" avoids several unexpected behaviors
    const input = e.currentTarget;
    const file = e.target.files?.[0];
    if (!file) return;

    if (isNotImageFile(file)) {
      input.value = ""; // Select the same file again
      return;
    }

    if (imageData?.preview && imageData.preview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(imageData.preview);
      } catch {}
    }

    const url = URL.createObjectURL(file);

    let width: number | null = null;
    let height: number | null = null;

    try {
      const dims = await getImageWidthAndHeight(file);
      width = dims.width;
      height = dims.height;
    } catch (err) {
      console.error("Error (getImageWidthAndHeight):", err);
    }

    const today = new Date();

    dispatch({
      type: "SET_ALL",
      payload: {
        preview: url,
        file,
        size: file.size,
        type: file.type.replace("image/", ""),
        width,
        height,
        date: comercialDate(today),
      },
    });

    setFilename(file.name);
    setFile(file);

    input.value = ""; // Select the same file again
  };

  useEffect(() => {
    // Preventing memmory leak
    const prev = imageData.preview;
    return () => {
      if (prev && prev.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(prev);
        } catch {}
      }
    };
  }, [imageData.preview]);

  return (
    <BlockEditorWrapper
      id={id}
      wrapperLabel={wrapperLabel}
      moveToNext={moveToNext}
      onRemove={onRemove}
    >
      <div className="flex justify-center w-full h-full">
        <DragAndDropZone
          imageData={imageData}
          inputRef={inputRef}
          onFileChange={onFileChange}
          setFilename={setFilename}
          setAlt={setAlt}
          setCaption={setCaption}
          dispatch={dispatch}
        />
        <InfoZone
          imageData={imageData}
          filename={filename}
          alt={alt}
          caption={caption}
          setFilename={setFilename}
          setAlt={setAlt}
          setCaption={setCaption}
        />
      </div>
    </BlockEditorWrapper>
  );
};

const QuizEditor = (props: QuizEditorProps) => (
  <BlockEditorWrapper {...props}>Quiz</BlockEditorWrapper>
); // TODO

const QuoteEditor = (props: QuoteEditorProps) => (
  <BlockEditorWrapper {...props}>
    <QuoteFieldset {...props} />
  </BlockEditorWrapper>
);

const TextEditor = (props: TextEditorProps) => {
  return (
    <BlockEditorWrapper {...props}>
      <EditorFieldset id={props.id} value={props.value} setVal={props.setVal} />
    </BlockEditorWrapper>
  );
};

export {
  AccordionEditor,
  AlertEditor,
  CodeEditor,
  HoverCardEditor,
  ImageCarouselEditor,
  ImageEditor,
  QuizEditor,
  QuoteEditor,
  TextEditor,
};
