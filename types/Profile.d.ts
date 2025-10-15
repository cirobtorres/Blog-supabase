type Profile = {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  updated_at: Date | null;
  created_at: Date;
};

type ProfileSafe = {
  id: string | null;
  avatar_url: string | null;
  email: string | null;
  username: "[excluído]" | string;
  updated_at: Date | null;
  created_at: Date;
};
