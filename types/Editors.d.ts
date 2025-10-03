// EDITORS
type AccordionEditorProps = {
  id: string;
  wrapperLabel: string;
  onRemove: (id: string) => void;
  moveToNext: (id: string) => void;
};

type AlertEditorProps = {
  id: string;
  wrapperLabel: string;
  onRemove: (id: string) => void;
  moveToNext: (id: string) => void;
};

type CodeEditorProps = {
  id: string;
  wrapperLabel: string;
  filename: string;
  code: string;
  language: string;
  setFilename: (data: string) => void;
  setCode: (data: string) => void;
  setLanguage: (language: string) => void;
  moveToNext: (id: string) => void;
  onRemove: (id: string) => void;
};

type HoverCardEditorProps = {
  id: string;
  wrapperLabel: string;
  onRemove: (id: string) => void;
  moveToNext: (id: string) => void;
};

type ImageCarouselEditorProps = {
  id: string;
  wrapperLabel: string;
  onRemove: (id: string) => void;
  moveToNext: (id: string) => void;
};

type ImageEditorProps = {
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
  moveToNext: (id: string) => void;
  onRemove: (id: string) => void;
};

type QuizEditorProps = {
  id: string;
  wrapperLabel: string;
  onRemove: (id: string) => void;
  moveToNext: (id: string) => void;
};

type QuoteEditorProps = {
  id: string;
  wrapperLabel: string;
  author: string;
  setAuthor: (author: string) => void;
  quote: string;
  setQuote: (author: string) => void;
  moveToNext: (id: string) => void;
  onRemove: (id: string) => void;
};

type TextEditorProps = {
  id: string;
  wrapperLabel: string;
  value: string;
  setVal: (data: string) => void;
  onRemove: (id: string) => void;
  moveToNext: (id: string) => void;
};

// REDUCERS
type ImageStateAction =
  | { type: "SET_ALL"; payload: Partial<ImageState> }
  | { type: "RESET" };

type AccordionStateAction =
  | { type: "ADD" }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE_TITLE"; id: string; value: string }
  | { type: "UPDATE_MESSAGE"; id: string; value: string };
