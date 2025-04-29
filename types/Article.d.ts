type Article = {
  id: string;
  authors: Authors | null;
  title: string;
  body: string;
  private: boolean;
  updated_at: Date;
  created_at: Date;
};
