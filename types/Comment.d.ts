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
  updated_at: Date | null;
  created_at: Date;
  profiles: Profile;
};

type CommentsSafe = {
  id: string;
  article_id: string;
  parent_id: string | null;
  like_count: number;
  body: "[excluído]" | "[bloqueado]" | string;
  is_edited: boolean;
  is_blocked: boolean;
  is_deleted: boolean;
  profiles: ProfileSafe;
  updated_at: Date | null;
  created_at: Date;
};
