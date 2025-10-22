type BlockType<T extends object> = T & {
  id: string;
  type:
    | "accordion"
    | "text"
    | "code"
    | "quote"
    | "alert"
    | "image"
    | "imageCarousel"
    | "quiz";
};

type BlogAccordion = { type: boolean; collapsible: boolean };
type BlogText = { body: string };
type BlogCode = { filename: string; code: string; language: BundledLanguage };
type BlogQuote = { author: string; quote: string };
type BlogAlert = {}; // TODO
type BlogImage = {
  file?: File;
  src: string;
  alt: string;
  filename: string;
  caption: string;
};
type BlogImageCarousel = {}; // TODO
type BlogQuiz = {}; // TODO

type AccordionBlock = { data?: BlogAccordion };
type TextBlock = { data?: BlogText };
type CodeBlock = { data?: BlogCode };
type QuoteBlock = { data?: BlogQuote };
type AlertBlock = { data?: BlogAlert }; // TODO
type ImageBlock = { data?: BlogImage };
type ImageCarouselBlock = { data?: BlogImageCarousel };
type QuizBlock = { data?: BlogQuiz }; // TODO

type Block =
  | BlockType<AccordionBlock>
  | BlockType<TextBlock>
  | BlockType<CodeBlock>
  | BlockType<QuoteBlock>
  | BlockType<AlertBlock>
  | BlockType<ImageBlock>
  | BlockType<ImageCarouselBlock>
  | BlockType<QuizBlock>;

type ArticleAccordion = BlockType<{ data: BlogAccordion }>;
type ArticleText = BlockType<{ data: BlogText }>;
type ArticleCode = BlockType<{ data: BlogCode }>;
type ArticleQuote = BlockType<{ data: BlogQuote }>;
type ArticleImage = BlockType<{ data: Image }>; // TODO: checar esse Image
type ArticleImageCarousel = BlockType<{ data: BlogImageCarousel }>;
type ArticleQuiz = BlockType<{ data: QuizBlock }>;
