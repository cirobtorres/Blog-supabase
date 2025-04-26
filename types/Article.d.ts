type Article = {
  id: string;
  user_id: string | null;
  title: string;
  body: string;
  private: boolean;
  updated_at: Date;
  created_at: Date;
};
