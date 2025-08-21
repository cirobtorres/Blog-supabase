type Comments = {
  id: string;
  article_id: string;
  parent_id: string;
  profile_id: string; // Já está em profiles
  like_count: number;
  body: string;
  is_edited: boolean;
  is_blocked: boolean;
  is_deleted: boolean;
  updated_at: Date;
  created_at: Date;
  profiles: Profile;
};
