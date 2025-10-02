import { EditorFieldset, CodeFieldset, QuoteFieldset } from "../Fieldsets";
import { BlockEditorWrapper } from "./utils";
import {
  DragAndDropZone,
  getImageWidthAndHeight,
  InfoZone,
  isNotImageFile,
} from "../Fieldsets/ArticleEditor";
import { MouseEventHandler, useEffect, useReducer, useRef } from "react";
import { comercialDate } from "@/utils/dates";

const AccordionEditor = ({
  id,
  onRemove,
}: {
  id: string;
  onRemove: (id: string) => void;
}) => <div>Accordion</div>;

const AlertEditor = ({
  id,
  onRemove,
}: {
  id: string;
  onRemove: (id: string) => void;
}) => <div>Alert</div>;

const CodeEditor = (props: {
  id: string;
  wrapperLabel: string;
  filename: string;
  code: string;
  language: string;
  setFilename: (data: string) => void;
  setCode: (data: string) => void;
  setLanguage: (language: string) => void;
  moveToNext: any;
  onRemove: (id: string) => void;
}) => {
  return (
    <BlockEditorWrapper {...props}>
      <CodeFieldset {...props} />
    </BlockEditorWrapper>
  );
};

const TextEditor = (props: {
  id: string;
  wrapperLabel: string;
  value: string;
  setVal: (data: string) => void;
  onRemove: (id: string) => void;
  moveToNext: any;
}) => {
  return (
    <BlockEditorWrapper {...props}>
      <EditorFieldset id={props.id} value={props.value} setVal={props.setVal} />
    </BlockEditorWrapper>
  );
};

const initialState: ImageState = {
  preview: null,
  filename: null,
  file: null,
  size: null,
  type: "--",
  width: null,
  height: null,
  date: "--",
};

const reducer = (state: ImageState, action: ImageStateAction): ImageState => {
  switch (action.type) {
    case "SET_ALL":
      return { ...state, ...action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

interface ImageEditorProps {
  id: string;
  src: string;
  alt: string;
  filename: string;
  caption: string;
  setFile: (file: File) => void;
  setSrc: (src: string) => void;
  setAlt: (alt: string) => void;
  setFilename: (filename: string) => void;
  setCaption: (caption: string) => void;
  wrapperLabel: string;
  moveToNext: any;
  onRemove: (id: string) => void;
}

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
  const [imageData, dispatch] = useReducer(reducer, initialState);

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

const ImageCarouselEditor = ({
  id,
  onRemove,
}: {
  id: string;
  onRemove: (id: string) => void;
}) => <div>ImgCarousel</div>;

const QuoteEditor = (props: {
  id: string;
  wrapperLabel: string;
  author: string;
  setAuthor: (author: string) => void;
  quote: string;
  setQuote: (author: string) => void;
  moveToNext: any;
  onRemove: (id: string) => void;
}) => (
  <BlockEditorWrapper {...props}>
    <QuoteFieldset {...props} />
  </BlockEditorWrapper>
);

const QuizEditor = ({
  id,
  onRemove,
}: {
  id: string;
  onRemove: (id: string) => void;
}) => <div>Quiz</div>;

const HoverCardEditor = () => <div />; // TODO

export {
  AccordionEditor,
  AlertEditor,
  CodeEditor,
  TextEditor,
  ImageEditor,
  ImageCarouselEditor,
  QuoteEditor,
  QuizEditor,
};
