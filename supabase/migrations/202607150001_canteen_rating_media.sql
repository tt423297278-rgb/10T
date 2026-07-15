-- 禾伙人食堂：到店评价图片。
-- 图片默认存放在私有 bucket，仅评价本人可读写；后续公开展示前应接入内容审核流程。
create table public.canteen_rating_media (
  id uuid primary key default gen_random_uuid(),
  rating_id uuid not null references public.canteen_ratings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  alt text,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  position integer not null default 0 check (position >= 0 and position < 4),
  created_at timestamptz not null default now(),
  unique (rating_id, storage_path),
  unique (rating_id, position)
);

create index canteen_rating_media_rating_id_idx on public.canteen_rating_media (rating_id);
create index canteen_rating_media_user_id_idx on public.canteen_rating_media (user_id);

alter table public.canteen_rating_media enable row level security;

create policy "users read own canteen rating media"
  on public.canteen_rating_media for select
  using (
    auth.uid() = user_id
    and exists (
      select 1 from public.canteen_ratings ratings
      where ratings.id = rating_id and ratings.user_id = auth.uid()
    )
  );

create policy "users create own canteen rating media"
  on public.canteen_rating_media for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.canteen_ratings ratings
      where ratings.id = rating_id and ratings.user_id = auth.uid()
    )
  );

create policy "users delete own canteen rating media"
  on public.canteen_rating_media for delete
  using (auth.uid() = user_id);

grant select, insert, delete on public.canteen_rating_media to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'canteen-rating-media',
  'canteen-rating-media',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "users upload own canteen rating media objects"
  on storage.objects for insert
  with check (
    bucket_id = 'canteen-rating-media'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users read own canteen rating media objects"
  on storage.objects for select
  using (bucket_id = 'canteen-rating-media' and owner = auth.uid());

create policy "users delete own canteen rating media objects"
  on storage.objects for delete
  using (bucket_id = 'canteen-rating-media' and owner = auth.uid());
