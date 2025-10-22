import {
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
  FloatingTextArea,
} from "../Fieldsets";
import {
  DragAndDropZone,
  InfoZone,
  isNotImageFile,
} from "../Fieldsets/ArticleEditor";
import { useEffect, useReducer, useRef } from "react";
import { comercialDate } from "../../utils/dates";
import {
  accordionReducer,
  imageInitialState,
  imageReducer,
  initialAccordionState,
} from "@/reducers";
import { MinusIcon, PlusIcon } from "../Icons";
import { Checkbox } from "../ui/checkbox";
import { getImageDimensionsByFile } from "../../utils/media";
import { cn } from "../../utils/classnames";
import { focusVisibleWhiteRing } from "../../styles/classNames";
import TipTapTextEditor from "./TipTapTextEditor";
import BlockEditorWrapper from "./accordion";
import TipTapQuoteEditor from "./TipTapQuoteEditor";
import TipTapCodeEditor from "./TipTapCodeEditor";
import TipTapAlertEditor from "./TipTapAlertEditor";

const AccordionEditor = ({
  ...blockProps
}: AccordionEditorProps & AccordionBlockEditorWrapperProps) => {
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
      className={cn(
        "flex justify-center items-center cursor-pointer p-1 rounded-sm transition-all duration-300 outline-none border border-neutral-700 bg-neutral-900 hover:border-neutral-600 hover:bg-neutral-800",
        focusVisibleWhiteRing
      )}
    >
      <MinusIcon />
    </button>
  );

  const CheckBoxes = () => {
    return (
      <div className="flex flex-col justify-center items-start gap-1">
        <div className="w-full p-1 rounded-sm border border-neutral-800 bg-neutral-900">
          <fieldset>
            <label
              htmlFor="checkbox-accordion-type"
              className="grid grid-cols-[24px_80px_1fr] items-center gap-2 pr-2"
            >
              <Checkbox
                id="checkbox-accordion-type"
                checked={blockProps.type}
                onCheckedChange={() => blockProps.setType(!blockProps.type)}
                className="cursor-pointer"
              />
              <p className="text-neutral-100 text-xs">Único</p>
              <p className="text-neutral-500 text-xs">
                Apenas um item é expandido por vez.
              </p>
            </label>
          </fieldset>
        </div>
        <div className="p-1 pr-4 rounded-sm border border-neutral-800 bg-neutral-900">
          <fieldset className="w-full">
            <label
              htmlFor="checkbox-accordion-collapsible"
              className="grid grid-cols-[24px_80px_1fr] items-center gap-2 pr-2"
            >
              <Checkbox
                id="checkbox-accordion-collapsible"
                checked={blockProps.collapsible}
                onCheckedChange={() =>
                  blockProps.setCollapsible(!blockProps.collapsible)
                }
                className="cursor-pointer"
              />
              <p className="text-neutral-100 text-xs">Colapsável</p>
              <ul>
                <li>
                  <p className="text-neutral-500 text-xs">
                    Permite expandir ou colapsar o acordeão.
                  </p>
                </li>
              </ul>
            </label>
          </fieldset>
        </div>
      </div>
    );
  };

  console.log("AccordionEditor REMOUNT"); // TODO (DEBUG): remove me

  return (
    <BlockEditorWrapper {...blockProps}>
      <div className="max-w-full mx-auto p-2 flex flex-col items-start gap-2">
        <CheckBoxes />
        <div className="w-full flex flex-1 flex-col justify-center gap-2">
          {accordions.map((accordion, index) => (
            <div
              key={accordion.id}
              className="w-full grid grid-cols-[24px_minmax(0,1fr)_36px] items-start rounded p-2 gap-2 border border-neutral-800 has-[input:checked]:bg-neutral-800 has-[input:checked]:ring-2 has-[input:checked]:ring-theme-color"
            >
              <Checkbox
                id="checkbox-accordion-type"
                className="cursor-pointer my-[5px]"
                checked={accordion.checked}
                onCheckedChange={() => {
                  accordDispatch({
                    type: "UPDATE_CHECK",
                    id: accordion.id,
                    value: !accordion.checked,
                  });
                }}
              />
              <div className="flex flex-col gap-2">
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
                  <FloatingTextArea
                    id={`message-${accordion.id}`}
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
                </FloatingFieldset>
              </div>
              {index > 0 && <RemoveButton accordionId={accordion.id} />}
            </div>
          ))}
          <AddButton />
        </div>
      </div>
    </BlockEditorWrapper>
  );
}; // TODO

const AlertEditor = ({
  value,
  setVal,
  ...blockProps // Block attributes
}: AlertEditorProps & AccordionBlockEditorWrapperProps) => {
  const alertEditorId = "input-alert-" + blockProps.id; // input-alert-text-1, 2, 3, 4, ..., n

  console.log("AlertEditor REMOUNT"); // TODO (DEBUG): remove me

  return (
    <BlockEditorWrapper {...blockProps}>
      <fieldset className="h-full flex flex-col p-1">
        <TipTapAlertEditor
          id={alertEditorId}
          setVal={setVal}
          defaultValue={value}
        />
      </fieldset>
    </BlockEditorWrapper>
  );
};

const ImageCarouselEditor = ({
  ...blockProps // Block attributes
}: ImageCarouselEditorProps & AccordionBlockEditorWrapperProps) => (
  <BlockEditorWrapper {...blockProps}>ImageCarousel</BlockEditorWrapper>
); // TODO

const ImageEditor = ({
  id,
  // src,
  alt,
  filename,
  caption,
  setFile,
  // setSrc,
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
      const dims = await getImageDimensionsByFile(file);
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

const QuizEditor = ({
  ...blockProps // Block attributes
}: QuizEditorProps & AccordionBlockEditorWrapperProps) => (
  <BlockEditorWrapper {...blockProps}>Quiz</BlockEditorWrapper>
); // TODO

const CodeEditor = ({
  code,
  filename,
  language,
  setCode,
  setFilename,
  setLanguage,
  ...blockProps // Block attributes
}: CodeEditorProps & AccordionBlockEditorWrapperProps) => {
  const filenameEditorId = "input-filename-" + blockProps.id; // input-filename-1, 2, 3, 4, ..., n
  const codeEditorId = "input-codebody-" + blockProps.id; // input-codebody-1, 2, 3, 4, ..., n

  console.log("CodeEditor REMOUNT"); // TODO (DEBUG): remove me

  return (
    <BlockEditorWrapper {...blockProps}>
      <fieldset className="h-full flex flex-col gap-1 p-1 [&_fieldset]:mt-0">
        <FloatingFieldset>
          <FloatingInput
            id={filenameEditorId}
            placeholder="path/to/my/file.py"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
          <FloatingLabel
            htmlFor={filenameEditorId}
            label="Caminho do Arquivo"
          />
        </FloatingFieldset>
        <TipTapCodeEditor
          id={codeEditorId}
          defaultCode={code}
          defaultlanguage={language}
          setVal={setCode}
          setLanguage={setLanguage}
        />
      </fieldset>
    </BlockEditorWrapper>
  );
};

const QuoteEditor = ({
  author,
  quote,
  setAuthor,
  setQuote,
  ...blockProps // Block attributes
}: QuoteEditorProps & AccordionBlockEditorWrapperProps) => {
  const quoteEditorId = "input-quote-" + blockProps.id; // input-quote-text-1, 2, 3, 4, ..., n
  const authorEditorId = "input-author-" + blockProps.id; // input-author-text-1, 2, 3, 4, ..., n

  console.log("QuoteEditor REMOUNT"); // TODO (DEBUG): remove me

  return (
    <BlockEditorWrapper {...blockProps}>
      <fieldset className="h-full flex flex-col gap-1 p-1 [&_fieldset]:mt-0">
        <FloatingFieldset>
          <FloatingInput
            id={authorEditorId}
            placeholder="Arthur Schopenhauer"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <FloatingLabel htmlFor={authorEditorId} label="Autor da citação" />
        </FloatingFieldset>
        <TipTapQuoteEditor
          id={quoteEditorId}
          setVal={setQuote}
          defaultValue={quote}
        />
      </fieldset>
    </BlockEditorWrapper>
  );
};

const TextEditor = ({
  value,
  setVal,
  ...blockProps // Block attributes
}: TextEditorProps & AccordionBlockEditorWrapperProps) => {
  const textEditorId = "input-body-" + blockProps.id; // input-body-text-1, 2, 3, 4, ..., n

  console.log("TextEditor REMOUNT"); // TODO (DEBUG): remove me

  return (
    <BlockEditorWrapper {...blockProps}>
      <fieldset className="h-full flex flex-col p-1">
        <TipTapTextEditor
          id={textEditorId}
          setVal={setVal}
          defaultValue={value}
        />
      </fieldset>
    </BlockEditorWrapper>
  );
};

export {
  AccordionEditor,
  AlertEditor,
  CodeEditor,
  ImageCarouselEditor,
  ImageEditor,
  QuizEditor,
  QuoteEditor,
  TextEditor,
};
