-- 禾伙人食堂：到店用户四维评分。
-- 餐厅主体保留在授权 CSV 生成的静态数据中，因此 place_id 使用稳定文本标识，不建立外键。
create table public.canteen_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null,
  taste_score numeric(2, 1) not null,
  service_score numeric(2, 1) not null,
  value_score numeric(2, 1) not null,
  environment_score numeric(2, 1) not null,
  visited_confirmed boolean not null default true check (visited_confirmed),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, place_id),
  check (taste_score between 0.5 and 5 and mod(taste_score * 2, 1) = 0),
  check (service_score between 0.5 and 5 and mod(service_score * 2, 1) = 0),
  check (value_score between 0.5 and 5 and mod(value_score * 2, 1) = 0),
  check (environment_score between 0.5 and 5 and mod(environment_score * 2, 1) = 0)
);

create index canteen_ratings_place_id_idx on public.canteen_ratings (place_id);

create or replace function public.set_canteen_rating_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger canteen_ratings_set_updated_at
  before update on public.canteen_ratings
  for each row execute procedure public.set_canteen_rating_updated_at();

alter table public.canteen_ratings enable row level security;

create policy "users read own canteen ratings"
  on public.canteen_ratings for select
  using (auth.uid() = user_id);

create policy "users create own canteen ratings"
  on public.canteen_ratings for insert
  with check (auth.uid() = user_id and visited_confirmed);

create policy "users update own canteen ratings"
  on public.canteen_ratings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and visited_confirmed);

grant select, insert, update on public.canteen_ratings to authenticated;

create or replace function public.get_canteen_rating_summaries(target_place_ids text[])
returns table (
  place_id text,
  rating_count bigint,
  taste_avg numeric,
  service_avg numeric,
  value_avg numeric,
  environment_avg numeric,
  overall_avg numeric
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if coalesce(cardinality(target_place_ids), 0) > 100 then
    raise exception 'A maximum of 100 place ids is allowed';
  end if;

  return query
  select
    ratings.place_id,
    count(*)::bigint,
    round(avg(ratings.taste_score), 2),
    round(avg(ratings.service_score), 2),
    round(avg(ratings.value_score), 2),
    round(avg(ratings.environment_score), 2),
    round(avg((ratings.taste_score + ratings.service_score + ratings.value_score + ratings.environment_score) / 4), 2)
  from public.canteen_ratings as ratings
  where ratings.place_id = any(coalesce(target_place_ids, array[]::text[]))
  group by ratings.place_id;
end;
$$;

revoke all on function public.get_canteen_rating_summaries(text[]) from public;
grant execute on function public.get_canteen_rating_summaries(text[]) to anon, authenticated;
