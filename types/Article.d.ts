type Article = {
  id: string;
  author_id: string | null;
  title: string;
  slug: string;
  sub_title: string | null;
  body: string;
  is_private: boolean;
  updated_at: Date | null;
  created_at: Date;
};

type Authors = {
  authors: Author;
};

type ArticleJoinAuthor = Article<Authors>;

// BLOCKS--------------------------------------------------
type BlockType<T extends object> = T & {
  id: string;
  type:
    | "text"
    | "code"
    | "quote"
    | "accordion"
    | "alert"
    | "image"
    | "imageCarousel"
    | "quiz";
};

type BlogBody = { body: string };
type BlogCode = { filename: string; code: string; language: BundledLanguage };
type BlogQuote = { author: string; quote: string };
type BlogImage = {
  file?: File;
  src: string;
  alt: string;
  filename: string;
  caption: string;
};

type TextBlock = { data?: { body: string } };
type CodeBlock = { data?: BlogCode };
type QuoteBlock = { data?: BlogQuote };
type ImageBlock = { data?: BlogImage };

type Block =
  | BlockType<TextBlock>
  | BlockType<CodeBlock>
  | BlockType<QuoteBlock>
  | BlockType<ImageBlock>;

type ArticleBodyText = BlockType<{ data: { body: string } }>;
type ArticleBodyCode = BlockType<{ data: BlogCode }>;
type ArticleQuoteText = BlockType<{ data: BlogQuote }>;
type ArticleImage = BlockType<{ data: Image }>;

type ImageState = {
  preview: string | null;
  file?: File | null;
  filename: string | null;
  size: number | null;
  type: string;
  width: number | null;
  height: number | null;
  date: string;
};

type AnchorTracher = {
  id: string;
  text: string | React.ReactNode;
  tag: string;
}[];

type AccordionItem = {
  id: string;
  title: string;
  message: string;
};
