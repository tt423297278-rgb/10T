-- 十个勤天陪伴社区：阶段三初始 Supabase Schema
-- 说明：所有业务表启用 RLS；前端只使用 anon key，管理员写入必须依赖 role 校验或 Edge Function。

create extension if not exists "pgcrypto";

create type public.app_role as enum ('user', 'admin');
create type public.account_status as enum ('active', 'muted', 'banned');
create type public.media_type as enum ('image', 'video');
create type public.event_type as enum ('直播', '演出', '综艺', '音乐', '品牌活动', '线下活动', '生日', '节目录制', '公开行程', '其他');
create type public.event_status as enum ('待确认', '即将开始', '正在进行', '已结束', '已取消', '已延期');
create type public.content_status as enum ('draft', 'reviewing', 'published', 'hidden', 'deleted');

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  avatar_url text,
  bio text default '',
  role public.app_role not null default 'user',
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.members (
  id text primary key,
  name text not null,
  display_order int not null default 0,
  avatar_url text,
  cover_url text,
  bio text not null default '资料待核验',
  tags text[] not null default '{}',
  profile_status text not null default 'placeholder',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.member_media (
  id uuid primary key default gen_random_uuid(),
  member_id text not null references public.members(id) on delete cascade,
  type public.media_type not null,
  url text not null,
  poster_url text,
  alt text not null,
  source_label text not null,
  source_url text,
  sort_order int not null default 0
);

create table public.member_timeline (
  id uuid primary key default gen_random_uuid(),
  member_id text not null references public.members(id) on delete cascade,
  happened_on date,
  title text not null,
  description text not null,
  source_label text not null,
  source_url text,
  status text not null default 'placeholder'
);

create table public.member_works (
  id uuid primary key default gen_random_uuid(),
  member_id text not null references public.members(id) on delete cascade,
  type text not null,
  title text not null,
  description text not null default '',
  published_at timestamptz,
  source_url text,
  cover_url text
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type public.event_type not null,
  status public.event_status not null default '待确认',
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text not null default '待确认',
  platform text not null default '待确认',
  description text not null default '',
  watch_url text,
  ticket_url text,
  source_label text not null,
  source_url text,
  cover_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_members (
  event_id uuid not null references public.events(id) on delete cascade,
  member_id text not null references public.members(id) on delete cascade,
  primary key (event_id, member_id)
);

create table public.event_reminders (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  remind_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table public.official_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  type text not null,
  published_at timestamptz not null,
  source_label text not null,
  source_url text,
  media_url text,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.official_update_members (
  update_id uuid not null references public.official_updates(id) on delete cascade,
  member_id text not null references public.members(id) on delete cascade,
  primary key (update_id, member_id)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  category text not null,
  status public.content_status not null default 'reviewing',
  related_event_id uuid references public.events(id) on delete set null,
  like_count int not null default 0,
  comment_count int not null default 0,
  favorite_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_members (
  post_id uuid not null references public.posts(id) on delete cascade,
  member_id text not null references public.members(id) on delete cascade,
  primary key (post_id, member_id)
);

create table public.post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  type public.media_type not null,
  url text not null,
  poster_url text,
  alt text not null,
  mime_type text not null,
  size_bytes int not null check (size_bytes > 0),
  sort_order int not null default 0
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  status text not null default 'open',
  handled_by uuid references auth.users(id) on delete set null,
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.user_follows (
  user_id uuid not null references auth.users(id) on delete cascade,
  member_id text not null references public.members(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, member_id)
);

create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  check_date date not null,
  source text not null default 'daily',
  created_at timestamptz not null default now(),
  unique (user_id, check_date)
);

create table public.point_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount int not null,
  balance_after int not null check (balance_after >= 0),
  reason text not null,
  source_type text not null,
  source_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null,
  rule jsonb not null default '{}'::jsonb,
  visual_type text not null default 'stamp',
  is_active boolean not null default true
);

create table public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  target_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users(id) on delete restrict,
  action text not null,
  target_type text not null,
  target_id uuid,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, nickname)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nickname', split_part(new.email, '@', 1), '麦田同行者')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.member_media enable row level security;
alter table public.member_timeline enable row level security;
alter table public.member_works enable row level security;
alter table public.events enable row level security;
alter table public.event_members enable row level security;
alter table public.event_reminders enable row level security;
alter table public.official_updates enable row level security;
alter table public.official_update_members enable row level security;
alter table public.posts enable row level security;
alter table public.post_members enable row level security;
alter table public.post_media enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.favorites enable row level security;
alter table public.reports enable row level security;
alter table public.user_follows enable row level security;
alter table public.check_ins enable row level security;
alter table public.point_ledger enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_logs enable row level security;

create policy "public profiles are readable" on public.profiles for select using (true);
create policy "users update own profile limited fields" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id and role = (select role from public.profiles where user_id = auth.uid()));
create policy "admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "published catalog is readable" on public.members for select using (true);
create policy "member media is readable" on public.member_media for select using (true);
create policy "member timeline is readable" on public.member_timeline for select using (true);
create policy "member works are readable" on public.member_works for select using (true);
create policy "events are readable" on public.events for select using (true);
create policy "event member links are readable" on public.event_members for select using (true);
create policy "official updates are readable" on public.official_updates for select using (status = 'published' or public.is_admin());
create policy "official update links are readable" on public.official_update_members for select using (true);

create policy "admins manage catalog" on public.members for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage member media" on public.member_media for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage timeline" on public.member_timeline for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage works" on public.member_works for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage events" on public.events for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage event links" on public.event_members for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage updates" on public.official_updates for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage update links" on public.official_update_members for all using (public.is_admin()) with check (public.is_admin());

create policy "users manage own reminders" on public.event_reminders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "published posts readable" on public.posts for select using (status = 'published' or author_id = auth.uid() or public.is_admin());
create policy "users create own posts" on public.posts for insert with check (auth.uid() = author_id);
create policy "users update own posts" on public.posts for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "users delete own posts" on public.posts for delete using (auth.uid() = author_id);
create policy "admins moderate posts" on public.posts for all using (public.is_admin()) with check (public.is_admin());

create policy "post links readable" on public.post_members for select using (true);
create policy "users manage own post member links" on public.post_members for all using (exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid())) with check (exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid()));

create policy "post media readable" on public.post_media for select using (exists (select 1 from public.posts p where p.id = post_id and (p.status = 'published' or p.author_id = auth.uid() or public.is_admin())));
create policy "users manage own post media" on public.post_media for all using (exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid())) with check (exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid()));

create policy "visible comments readable" on public.comments for select using (status = 'published' or author_id = auth.uid() or public.is_admin());
create policy "users create own comments" on public.comments for insert with check (auth.uid() = author_id);
create policy "users update own comments" on public.comments for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "users delete own comments" on public.comments for delete using (auth.uid() = author_id);
create policy "admins moderate comments" on public.comments for all using (public.is_admin()) with check (public.is_admin());

create policy "users manage own likes" on public.likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own favorites" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users create reports" on public.reports for insert with check (auth.uid() = reporter_id);
create policy "users read own reports" on public.reports for select using (auth.uid() = reporter_id or public.is_admin());
create policy "admins handle reports" on public.reports for update using (public.is_admin()) with check (public.is_admin());
create policy "users manage own follows" on public.user_follows for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users read own checkins" on public.check_ins for select using (auth.uid() = user_id or public.is_admin());
create policy "admins manage checkins" on public.check_ins for all using (public.is_admin()) with check (public.is_admin());
create policy "users read own point ledger" on public.point_ledger for select using (auth.uid() = user_id or public.is_admin());
create policy "admins manage point ledger" on public.point_ledger for all using (public.is_admin()) with check (public.is_admin());
create policy "active badges readable" on public.badges for select using (is_active or public.is_admin());
create policy "users read own badges" on public.user_badges for select using (auth.uid() = user_id or public.is_admin());
create policy "admins manage badges" on public.badges for all using (public.is_admin()) with check (public.is_admin());
create policy "admins grant badges" on public.user_badges for all using (public.is_admin()) with check (public.is_admin());

create policy "users read own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "users mark own notifications" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "admins create notifications" on public.notifications for insert with check (public.is_admin());
create policy "admins read logs" on public.admin_logs for select using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('member-media', 'member-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']),
  ('post-media', 'post-media', true, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'])
on conflict (id) do nothing;

create policy "public can read member media objects" on storage.objects for select using (bucket_id = 'member-media');
create policy "public can read post media objects" on storage.objects for select using (bucket_id = 'post-media');
create policy "admins upload member media" on storage.objects for insert with check (bucket_id = 'member-media' and public.is_admin());
create policy "users upload post media" on storage.objects for insert with check (bucket_id = 'post-media' and auth.role() = 'authenticated');
create policy "users delete own post media objects" on storage.objects for delete using (bucket_id = 'post-media' and owner = auth.uid());
