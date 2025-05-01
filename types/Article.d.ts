type Article = {
  id: string;
  author_id: string | null;
  title: string;
  body: string;
  private: boolean;
  updated_at: Date | null;
  created_at: Date;
};
