-- 禾伙人食堂：为到店评分增加一句话点评。
-- 文字暂只对评价本人可读；公开展示前需要接入内容审核。
alter table public.canteen_ratings
  add column review_text text;

alter table public.canteen_ratings
  add constraint canteen_ratings_review_text_length_check
  check (
    review_text is null
    or (char_length(trim(review_text)) between 1 and 120)
  );
