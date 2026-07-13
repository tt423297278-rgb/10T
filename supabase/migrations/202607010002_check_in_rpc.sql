-- 每日签到 RPC：服务端校验每日唯一签到，并通过 PointLedger 记录麦粒值变化。

create or replace function public.perform_daily_check_in()
returns table (
  check_date date,
  already_checked boolean,
  amount int,
  balance_after int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  today date := current_date;
  existing_check_in_id uuid;
  new_check_in_id uuid;
  current_balance int;
  reward_amount int := 5;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  perform pg_advisory_xact_lock(hashtext(current_user_id::text));

  select coalesce(pl.balance_after, 0)
    into current_balance
  from public.point_ledger pl
  where pl.user_id = current_user_id
  order by pl.created_at desc
  limit 1;

  current_balance := coalesce(current_balance, 0);

  select ci.id
    into existing_check_in_id
  from public.check_ins ci
  where ci.user_id = current_user_id
    and ci.check_date = today
  limit 1;

  if existing_check_in_id is not null then
    return query select today, true, 0, current_balance;
    return;
  end if;

  insert into public.check_ins (user_id, check_date, source)
  values (current_user_id, today, 'daily')
  returning id into new_check_in_id;

  insert into public.point_ledger (
    user_id,
    amount,
    balance_after,
    reason,
    source_type,
    source_id,
    created_by
  )
  values (
    current_user_id,
    reward_amount,
    current_balance + reward_amount,
    '每日签到',
    'check_in',
    new_check_in_id,
    current_user_id
  );

  return query select today, false, reward_amount, current_balance + reward_amount;
end;
$$;

grant execute on function public.perform_daily_check_in() to authenticated;
