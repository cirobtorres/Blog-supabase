<h1>BLOG</h1>

<h2>INSTALLATION</h2>

<h2>DATABASE</h2>

<details>
  <summary style="font-size:18px;cursor:pointer">SCHEMA</summary>

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  username text,
  avatar_url text,
  updated_at timestamptz default null,
  created_at timestamp default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid null references public.profiles(id) on delete set null,
  username text,
  avatar_url text,
  updated_at TIMESTAMPTZ default null,
  created_at TIMESTAMPTZ default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid null references authors(id) on delete set null,
  title varchar(128) not null,
  sub_title varchar(256) null,
  slug text unique not null,
  body text,
  is_private boolean default false,
  updated_at TIMESTAMPTZ default null,
  created_at TIMESTAMPTZ default now()
);

create table if not exists public.article_likes (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default now(),
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
  updated_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  comment_id uuid not null references public.comments(id) on delete cascade,
  created_at timestamp with time zone default now()
);
```

</details>
<small>(last updated 08-22-2025)</small>

<details>
  <summary style="font-size:18px;cursor:pointer">like_count TRIGGER</summary>

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
<small>(last updated 08-22-2025)</small>

<h2>TODO</h2>
<small>Temporário</small>

<ol style="font-size:18px">
  <li>ALTERAR: alterar essa forma estranha de capturar o "id" dos fieldsets;</li>
  <li>CORRIGIR: comentários deletados não atualizam CommentCount na mesma sessão;</li>
  <li>CORRIGIR: redirecionar usuário recém logado de volta para página de origem;</li>
  <li>ADICIONAR: criar "você precisa fazer log in" para botão responder;</li>
  <li>ADICIONAR: criar menções (ao responder um comentário, o autor do comentário respondido tem seu nome no início do comentário resposta);</li>
  <li>ADICIONAR: criar feature "Salvar Artigos" (manter artigos armazenados sem que sejam enviados para publicação);</li>
  <li>ADICIONAR: criar "blocos" similares ao do Strapi na criação de conteúdo e adicionaras seguintes features:</li>
  <ul>
    <li>ADICIONAR: criar blocos de códigos (code);</li>
    <li>ADICIONAR: criar blocos de imagens (apenas 1 imagem);</li>
    <li>ADICIONAR: criar blocos de múltiplas imagens (carrossel);</li>
    <li>ADICIONAR: criar blocos de citação (quote);</li>
    <li>ADICIONAR: criar blocos de quiz;</li>
    <li>ADICIONAR: criar blocos de acordeão;</li>
    <li>ADICIONAR: criar blocos de alert;</li>
    <li>REFATORAR: BlockEditorWrapper, EditorHeader, BlockExpand e BlockUtils (controlar o dialog por meio de provider);</li>
  </ul>
</ol>

<h2></h2>
