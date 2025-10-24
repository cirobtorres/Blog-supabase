type ArticleActionStateProps = {
  ok: boolean;
  success: string | null;
  error: string | null;
  data: Article | null;
};

type AuthenticateActionStateProps = {
  ok: boolean;
  success: string | null;
  error: Record<string, string[]>;
  data: any;
};

type MediaStateProps = {
  ok: boolean;
  success: string | null;
  error: string | null;
  data: File | null;
};
