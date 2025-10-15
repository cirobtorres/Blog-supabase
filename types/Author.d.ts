type Author = {
  id: string;
  profile_id: string | null;
  username: string;
  email: string;
  avatar_url?: string | undefined;
  updated_at: Date | null;
  created_at: Date;
};
