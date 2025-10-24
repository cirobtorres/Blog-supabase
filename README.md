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

<details>
  <summary style="font-size:18px;cursor:pointer;background-color:#262626;padding:10px;border-radius:6px;width:fit-content;border:1px solid #404040;margin-bottom:1rem">Bucket RLS</summary>
  <small>(last updated 10-24-2025)</small>

```sql
-- Remove old policies
drop policy if exists "Public can read article images" on storage.objects;
drop policy if exists "Only admin users can insert article images" on storage.objects;
drop policy if exists "Only admin users can update article images" on storage.objects;
drop policy if exists "Only admin users can delete article images" on storage.objects;

-- SELECT: any user (AUTH or ANON)
create policy "Public can read article images"
on storage.objects
for select
using (bucket_id = 'articles');

-- INSERT: ADMIN only
create policy "Only admin users can insert article images"
on storage.objects
for insert
to authenticated
with check (
bucket_id = 'articles'
and exists (
  select 1
  from public.profiles p
  where p.id = auth.uid()
  and p.admin = true
)
);

-- UPDATE: ADMIN only
create policy "Only admin users can update article images"
on storage.objects
for update
to authenticated
using (
bucket_id = 'articles'
and exists (
  select 1
  from public.profiles p
  where p.id = auth.uid()
  and p.admin = true
)
);

-- DELETE: ADMIN only
create policy "Only admin users can delete article images"
on storage.objects
for delete
to authenticated
using (
bucket_id = 'articles'
and exists (
  select 1
  from public.profiles p
  where p.id = auth.uid()
  and p.admin = true
)
);
```

</details>

<details>
  <summary style="font-size:18px;cursor:pointer;background-color:#262626;padding:10px;border-radius:6px;width:fit-content;border:1px solid #404040;margin-bottom:1rem">Comment Safe View</summary>
  <small>(last updated 10-24-2025)</small>
  
  ```sql
  drop view if exists public.comments_safe;
  create view public.comments_safe as
  select
  c.id,
  c.parent_id,
  c.article_id,
  c.like_count,
  case
  when c.is_deleted then '[excluído]'
  when c.is_blocked then '[bloqueado]'
  else c.body
  end as body,
  c.is_edited,
  c.is_blocked,
  c.is_deleted,
  c.updated_at,
  c.created_at,
  -- nested user profile data
  json_build_object(
  'id', case when c.is_deleted then null else p.id end,
  'username', case when c.is_deleted then '[excluído]' else p.username end,
  'avatar_url', case when c.is_deleted then null else p.avatar_url end,
  'email', case when c.is_deleted then null else p.email end,
  'updated_at', p.updated_at,
  'created_at', p.created_at
  ) as profiles
  from public.comments c
  left join public.profiles p on p.id = c.profile_id;
  ```

</details>

<details>
<summary style="font-size:18px;cursor:pointer;background-color:#262626;padding:10px;border-radius:6px;width:fit-content;border:1px solid #404040;margin-bottom:1rem">Profile Creation from User Authentication</summary>
<small>(last updated 10-24-2025)</small>

```sql
-- inserts a row into public.profiles
create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
insert into public.profiles (id, email, username, avatar_url)
values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url');
return new;
end;
$$;
-- trigger the function every time a user is created
create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.create_profile_for_new_user();
```

</details>

<details>
  <summary style="font-size:18px;cursor:pointer;background-color:#262626;padding:10px;border-radius:6px;width:fit-content;border:1px solid #404040;margin-bottom:1rem">Article Privacy Toggle</summary>
  <small>(last updated 10-24-2025)</small>

```sql
-- Alternate article is_private from true to false and vice versa
create or replace function toggle_article_privacy(article_id uuid)
returns void as $$
begin
  update articles
  set is_private = not is_private
  where id = article_id;
end;
$$ language plpgsql;
```

</details>

<h2 style="font-weight:500;font-size:30px;color:#9c2f70">TODO</h2>
<small>Temporário</small>

<ol style="font-weight:500;font-size:15px">
  <li>MELHORAR: redirecionar usuário recém logado de volta para página de origem;</li>
  <li>MELHORAR: uniformizar os headers. Em /admin, ele deve ser fixed também;</li>
  <li>MELHORAR: uniformizar os types;</li>
  <li>MELHORAR: a altura hardcoded dos editores, que devem ocupar o espaço máximo definido pelo seu wrapper;</li>
  <li style="color:#b22222">CORRIGIR (BUG): comentários deletados não atualizam CommentCount na mesma sessão;</li>
  <li style="color:#b22222">CORRIGIR (BUG): códigos copiados do vscode diretamente para o codeblock não são formatados corretamente para o usuário em articles;</li>
  <li style="color:#b22222">CORRIGIR (BUG): AdminPanel precisa criar o highlight de currentPage seguindo uma ordem de prioridade, da URL mais específica para a mais genérica;</li>
  <li>ADICIONAR: indicativo ao "CreateArticleForm" de que o artigo não está publicado, apenas salvo;</li>
  <li>ADICIONAR: criar "você precisa fazer log in" para botão responder;</li>
  <li>ADICIONAR: menções nas sessões de comentários (ao responder um comentário, o autor do comentário respondido tem seu nome no início do comentário resposta);</li>
  <li>ADICIONAR: "Save Article";</li>
  <li>ADICIONAR: imagem do artigo;</li>
  <ul>
    <li style="color:#b22222">CRIAR: bloco de vídeos;</li>
    <li style="color:#b22222">CRIAR: bloco de arquivos;</li>
    <li>FINALIZAR: bloco de imagens;</li>
    <li>FINALIZAR: bloco de múltiplas imagens (carrossel);</li>
    <li>FINALIZAR: bloco de quiz;</li>
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
```
````
