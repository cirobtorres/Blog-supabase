type Article = {
  id: string;
  author_id: string | null;
  title: string;
  sub_title: string | null;
  body: string;
  is_private: boolean;
  updated_at: Date | null;
  created_at: Date;
};
