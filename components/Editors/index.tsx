import { FloatingFieldset, FloatingInput, FloatingLabel } from "../Fieldsets";
import { DragAndDropZone, InfoZone, isNotImageFile } from "./ImageEditor";
import { useEffect, useReducer, useRef } from "react";
import { comercialDate } from "../../utils/dates";
import { imageInitialState, imageReducer } from "@/reducers";
import { getImageDimensionsByFile } from "../../utils/media";
import TipTapTextEditor from "./TipTapTextEditor";
import BlockEditorWrapper from "./accordion";
import TipTapQuoteEditor from "./TipTapQuoteEditor";
import TipTapCodeEditor from "./TipTapCodeEditor";
import TipTapAlertEditor from "./TipTapAlertEditor";
import AccordionEditorContent from "./AccordionEditor";

const AccordionEditor = ({
  ...blockProps
}: AccordionEditorProps & AccordionBlockEditorWrapperProps) => {
  console.log("AccordionEditor REMOUNT"); // TODO (DEBUG): remove me

  return (
    <BlockEditorWrapper {...blockProps}>
      <AccordionEditorContent {...blockProps} />
    </BlockEditorWrapper>
  );
};

const AlertEditor = ({
  type,
  setType,
  body,
  setBody,
  ...blockProps // Block attributes
}: AlertEditorProps & AccordionBlockEditorWrapperProps) => {
  const alertEditorId = "input-alert-" + blockProps.id; // input-alert-text-1, 2, 3, 4, ..., n

  console.log("AlertEditor REMOUNT"); // TODO (DEBUG): remove me

  return (
    <BlockEditorWrapper {...blockProps}>
      <fieldset className="h-full flex flex-col p-1">
        <TipTapAlertEditor
          id={alertEditorId}
          setVal={setBody}
          defaultBody={body}
          defaultType={type}
          setDefaultType={setType}
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
}; // TODO

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
