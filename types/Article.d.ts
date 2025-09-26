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
    | "img"
    | "imgCarousel"
    | "quiz";
};

type Body = { body: string };
type Code = { filename: string; code: string; language: BundledLanguage };
type Quote = { author: string; quote: string };
type Image = {
  src: string;
  alt: string;
  filename: string;
  caption: string;
};

type TextBlock = { data?: { body: string } };
type CodeBlock = { data?: Code };
type QuoteBlock = { data?: Quote };
type ImageBlock = { data?: Image };

type Block =
  | BlockType<TextBlock>
  | BlockType<CodeBlock>
  | BlockType<QuoteBlock>
  | BlockType<ImageBlock>;

type ArticleBodyText = BlockType<{ data: { body: string } }>;
type ArticleBodyCode = BlockType<{ data: Code }>;
type ArticleQuoteText = BlockType<{ data: Quote }>;
type ArticleImage = BlockType<{ data: Image }>;
