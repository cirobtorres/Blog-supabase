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

interface ArticleJoinAuthor extends Article {
  authors: Author;
}
