// ---------------===== BLOCK ACCORDION =====---------------
type BlockEditorWrapperProps = {
  children: React.ReactNode;
  id: string;
  wrapperLabel: string;
  onRemove: (id: string) => void;
  moveToNext: (id: string) => void;
};

type AccordionBlockEditorWrapperProps = {
  id: string;
  wrapperLabel: string;
  onRemove: (id: string) => void;
  moveToNext: (id: string) => void;
};

// ---------------===== EDITORS =====---------------
type AccordionEditorProps = BlogAccordion & {
  setAccordions: (accordions: AccordionItem[]) => void;
};

type AlertEditorProps = BlogText & {
  type: AlertValuesProps;
  setBody: (data: string) => void;
  setType: (data: string) => void;
};

type CodeEditorProps = {
  code: string;
  filename: string;
  language: string;
  setCode: (data: string) => void;
  setFilename: (data: string) => void;
  setLanguage: (language: string) => void;
};

type ImageCarouselEditorProps = {};

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

type QuizEditorProps = {};

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
  value: string;
  setVal: (data: string) => void;
};

// ---------------===== REDUCERS =====---------------
type ImageStateAction =
  | { type: "SET_ALL"; payload: Partial<ImageState> }
  | { type: "RESET" };

type AccordionStateAction =
  | { type: "ADD" }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE_CHECK"; id: string; value: boolean }
  | { type: "UPDATE_TITLE"; id: string; value: string }
  | { type: "UPDATE_MESSAGE"; id: string; value: string };
