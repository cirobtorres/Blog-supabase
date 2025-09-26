import { EditorFieldset, CodeFieldset, QuoteFieldset } from "../Fieldsets";
import { BlockEditorWrapper } from "./utils";
import { ImageFieldset } from "../Fieldsets/ArticleEditor";

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

const ImgEditor = (props: {
  id: string;
  src: string;
  alt: string;
  filename: string;
  caption: string;
  setSrc: (src: string) => void;
  setAlt: (alt: string) => void;
  setFilename: (filename: string) => void;
  setCaption: (caption: string) => void;
  wrapperLabel: string;
  onRemove: (id: string) => void;
  moveToNext: any;
}) => {
  return (
    <BlockEditorWrapper {...props}>
      <ImageFieldset {...props} />
    </BlockEditorWrapper>
  );
};

const ImgCarouselEditor = ({
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

export {
  AccordionEditor,
  AlertEditor,
  CodeEditor,
  TextEditor,
  ImgEditor,
  ImgCarouselEditor,
  QuoteEditor,
  QuizEditor,
};
