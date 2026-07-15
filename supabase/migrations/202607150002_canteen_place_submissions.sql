-- 禾伙人食堂：登录用户推荐新餐厅，审核通过前不进入公开目录。
create table public.canteen_place_submissions (
  id uuid primary key default gen_random_uuid(),
  submitter_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  region text not null,
  city text not null,
  district text,
  address text,
  longitude numeric(10, 7),
  latitude numeric(10, 7),
  amap_poi_id text,
  category text not null,
  price text,
  note text,
  taste_score numeric(2, 1) not null,
  service_score numeric(2, 1) not null,
  value_score numeric(2, 1) not null,
  environment_score numeric(2, 1) not null,
  visited_confirmed boolean not null default true check (visited_confirmed),
  status text not null default 'reviewing' check (status in ('reviewing', 'approved', 'rejected')),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(btrim(name)) between 1 and 80),
  check (char_length(btrim(region)) between 1 and 40),
  check (char_length(btrim(city)) between 1 and 40),
  check (district is null or char_length(btrim(district)) between 1 and 60),
  check (address is null or char_length(btrim(address)) between 5 and 200),
  check ((longitude is null and latitude is null) or (longitude is not null and latitude is not null)),
  check (longitude is null or longitude between -180 and 180),
  check (latitude is null or latitude between -90 and 90),
  check (amap_poi_id is null or char_length(btrim(amap_poi_id)) between 1 and 80),
  check (char_length(btrim(category)) between 1 and 40),
  check (price is null or char_length(btrim(price)) between 1 and 60),
  check (note is null or char_length(note) between 1 and 500),
  check (taste_score between 0.5 and 5 and mod(taste_score * 2, 1) = 0),
  check (service_score between 0.5 and 5 and mod(service_score * 2, 1) = 0),
  check (value_score between 0.5 and 5 and mod(value_score * 2, 1) = 0),
  check (environment_score between 0.5 and 5 and mod(environment_score * 2, 1) = 0)
);

create index canteen_place_submissions_submitter_idx
  on public.canteen_place_submissions (submitter_id, created_at desc);
create index canteen_place_submissions_review_queue_idx
  on public.canteen_place_submissions (status, created_at asc);

create or replace function public.set_canteen_place_submission_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger canteen_place_submissions_set_updated_at
  before update on public.canteen_place_submissions
  for each row execute procedure public.set_canteen_place_submission_updated_at();

alter table public.canteen_place_submissions enable row level security;

create policy "users read own canteen place submissions"
  on public.canteen_place_submissions for select
  using (auth.uid() = submitter_id);

create policy "users create own canteen place submissions"
  on public.canteen_place_submissions for insert
  with check (
    auth.uid() = submitter_id
    and status = 'reviewing'
    and visited_confirmed
    and reviewed_by is null
    and reviewed_at is null
  );

create policy "admins read canteen place submissions"
  on public.canteen_place_submissions for select
  using (public.is_admin());

create policy "admins review canteen place submissions"
  on public.canteen_place_submissions for update
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update on public.canteen_place_submissions to authenticated;
