<h1 style="font-weight:900;font-size:40px;color:#6f5099">BLOG</h1>

<h2 style="font-weight:500;font-size:30px;color:#9c2f70">INSTALLATION</h2>

<h2 style="font-weight:500;font-size:30px;color:#9c2f70">DATABASE</h2>

<details>
  <summary style="font-size:18px;cursor:pointer;background-color:#262626;padding:10px;border-radius:6px;width:fit-content;border:1px solid #404040;margin-bottom:1rem">SCHEMA</summary>
  <small>(last updated 10-20-2025)</small>

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  admin boolean default false,
  email text unique,
  username text,
  avatar_url text,
  updated_at timestamptz default null,
  created_at timestamptz default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid null references public.profiles(id) on delete set null,
  username text,
  email text unique not null,
  avatar_url text,
  updated_at timestamptz default null,
  created_at timestamptz default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid null references authors(id) on delete set null,
  title varchar(128) not null,
  sub_title varchar(256) null,
  slug text unique not null,
  body text,
  is_private boolean default false,
  updated_at timestamptz default null,
  created_at timestamptz default now()
);

create table if not exists public.article_likes (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  updated_at timestamptz with time zone,
  created_at timestamptz with time zone default now(),
  primary key (profile_id, article_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.comments(id) on delete set null,
  article_id uuid not null references public.articles(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  like_count integer not null default 0,
  body text not null,
  is_edited boolean not null default false,
  is_blocked boolean not null default false,
  is_deleted boolean not null default false, -- Soft delete
  updated_at timestamptz with time zone,
  created_at timestamptz with time zone default now()
);

create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  comment_id uuid not null references public.comments(id) on delete cascade,
  created_at timestamptz with time zone default now()
);

create table if not exists public.media_metadata (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,  -- Supabase storage file path (ex: "public/videos/foo.mp4")
  caption text null,                  -- Caption (opcional)
  mime_type text null,                -- Ex: "image/png", "video/mp4"
  metadata jsonb default '{}'::jsonb, -- Extras (ex: { "width": 1920, "height": 1080 })
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);
```

</details>

<details>
  <summary style="font-size:18px;cursor:pointer;background-color:#262626;padding:10px;border-radius:6px;width:fit-content;border:1px solid #404040;margin-bottom:1rem">like_count TRIGGER</summary>
  <small>(last updated 08-22-2025)</small>

```sql
-- Updates like_count for every insert/delete on comment_likes
create or replace function update_comment_like_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.comments
      set like_count = like_count + 1
      where id = new.comment_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.comments
      set like_count = greatest(like_count - 1, 0) --Avoids negatives
      where id = old.comment_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

--INSERT Trigger
create trigger comment_likes_after_insert
after insert on public.comment_likes
for each row
execute function update_comment_like_count();

--DELETE Trigger
create trigger comment_likes_after_delete
after delete on public.comment_likes
for each row
execute function update_comment_like_count();
```

</details>

<h2 style="font-weight:500;font-size:30px;color:#9c2f70">TODO</h2>
<small>Temporário</small>

<ol style="font-weight:500;font-size:15px">
  <li>ALTERAR: alterar essa forma estranha de capturar o "id" dos fieldsets;</li>
  <li style="color:#b22222">CORRIGIR: ImageState e ImageProps (duplicidade). Integrar melhor o ImageDataInfo;</li>
  <li>CORRIGIR: comentários deletados não atualizam CommentCount na mesma sessão;</li>
  <li>CORRIGIR: z-index de AdminMenu em relação aos dialogs;</li>
  <li>CORRIGIR: botão "return home" deve salvar o artigo antes de retornar;</li>
  <li>CORRIGIR: redirecionar usuário recém logado de volta para página de origem;</li>
  <li>CORRIGIR: a altura hardcoded dos editores, que devem ocupar o espaço máximo definido pelo seu wrapper;</li>
  <li style="color:#b22222">CORRIGIR: mover o code editor para baixo na linha de blocos reseta o editor;</li>
  <li>ADICIONAR: indicativo ao "CreateArticleForm" de que o artigo não está publicado, apenas salvo;</li>
  <li>ADICIONAR: criar "você precisa fazer log in" para botão responder;</li>
  <li>ADICIONAR: criar menções (ao responder um comentário, o autor do comentário respondido tem seu nome no início do comentário resposta);</li>
  <li>ADICIONAR: criar feature "Salvar Artigos" (manter artigos armazenados sem que sejam enviados para publicação);</li>
  <li>ADICIONAR: criar "blocos" similares ao do Strapi na criação de conteúdo e adicionaras seguintes features:</li>
  <ul>
    <li>ADICIONAR: criar blocos de imagens (apenas 1 imagem);</li>
    <li>ADICIONAR: criar blocos de hover card;</li>
    <li>ADICIONAR: criar blocos de múltiplas imagens (carrossel);</li>
    <li>ADICIONAR: criar blocos de citação (quote);</li>
    <li>ADICIONAR: criar blocos de quiz;</li>
    <li>ADICIONAR: criar blocos de acordeão;</li>
    <li>ADICIONAR: criar blocos de alert;</li>
    <li>REFATORAR: BlockEditorWrapper, EditorHeader, BlockExpand e BlockUtils (controlar o dialog por meio de provider);</li>
  </ul>
</ol>

<h2 style="font-weight:500;font-size:30px;color:#9c2f70">Aide</h2>

<h3 style="font-weight:500;font-size:20px;color:#15bf67">TipTapCodeEditor</h3>

<p style="font-weight:500;font-size:15px;color:#b22222;background-color:#262626;padding:10px;border-radius:6px;width:fit-content;border:1px solid #404040">Está impedido de criar novos nodes.</p>

<p style="font-weight:500;font-size:15px">O comportamento padrão do TipTap CodeBlock Lowlight é o de criar novos &lt;pre&gt;&lt;code&gt; por meio de:</p>

<ol style="font-weight:500;font-size:15px">
  <li>Triple Enter; ou</li>
  <li>Arrow Down &#40;ao final de cada code block&#41;;</li>
</ol>

<p style="font-weight:500;font-size:15px">Esse comportamento foi removido por meio de CustomCodeBlockShiki. <a href="https://github.com/timomeh/tiptap-extension-code-block-shiki" style="color:#1e90ff;text-decoration:underline;">CodeBlockShiki</a> é uma third party extention do tiptap para integração com <a href="https://shiki.matsu.io/" style="color:#1e90ff;text-decoration:underline;">Shiki</a>. O tiptap por padrão trabalha com <a href="https://github.com/wooorm/lowlight" style="color:#1e90ff;text-decoration:underline;">Lowlight</a> por meio de sua extensão nativa CodeBlockLowlight.</p>

<p style="font-weight:500;font-size:15px">O Shiki faz um wrapper &#40;envelopa&#41; do conteúdo por padrão &#40;em tags &lt;pre&gt;&lt;code&gt;&#41;. O TipTap também envelopa o conteúdo nessas tags. Foi optado pela remoção, então, das tags provenientes do TipTap. Ao editor de código TipTapCodeEditor é permitido apenas um pré formatador de code block.</p>

<h2 style="font-weight:500;font-size:30px;color:#9c2f70">Mots Utiles</h2>
