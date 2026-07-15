# 数据模型

## 结论
数据模型围绕“用户、成员、活动、签到、麦粒值、社区、动态、审核”展开。所有麦粒值变化必须写入 `PointLedger`，不能只改用户积分总数。

## User
- 用途：Supabase Auth 用户主体。
- 主键：`id uuid`。
- 主要字段：`email`, `created_at`, `last_sign_in_at`。
- 权限：用户只能读取和更新自己的认证相关信息；管理员通过服务端权限查看必要字段。

## Profile
- 主键：`user_id uuid`。
- 外键：`user_id -> User.id`。
- 字段：`nickname`, `avatar_url`, `bio`, `role`, `status`, `created_at`, `updated_at`。
- 唯一约束：`nickname` 可选唯一。
- 权限：用户可读公开资料；只能更新自己的资料；不能自行设置 `role`。

## Member
- 主键：`id text`。
- 字段：`name`, `display_order`, `avatar_url`, `cover_url`, `bio`, `tags`, `profile_status`, `created_at`, `updated_at`。
- 权限：公开可读；仅管理员写入。

## MemberMedia
- 主键：`id uuid`。
- 外键：`member_id -> Member.id`。
- 字段：`type`, `url`, `poster_url`, `alt`, `source_label`, `source_url`, `sort_order`。
- 删除规则：成员删除时级联删除媒体记录，Storage 文件由服务端清理。

## MemberTimeline
- 主键：`id uuid`。
- 外键：`member_id -> Member.id`。
- 字段：`date`, `title`, `description`, `source_label`, `source_url`, `status`。

## MemberWork
- 主键：`id uuid`。
- 外键：`member_id -> Member.id`。
- 字段：`type`, `title`, `description`, `published_at`, `source_url`, `cover_url`。

## Event
- 主键：`id uuid`。
- 字段：`title`, `type`, `status`, `starts_at`, `ends_at`, `location`, `platform`, `description`, `watch_url`, `ticket_url`, `source_label`, `source_url`, `cover_url`, `notes`, `updated_at`。
- 权限：公开可读；管理员写入。

## EventMember
- 主键：`event_id`, `member_id`。
- 外键：`event_id -> Event.id`, `member_id -> Member.id`。
- 用途：活动与成员多对多关系。

## EventReminder
- 主键：`id uuid`。
- 外键：`event_id -> Event.id`, `user_id -> User.id`。
- 唯一约束：`event_id + user_id`。
- 权限：用户只能管理自己的提醒。

## CheckIn
- 主键：`id uuid`。
- 外键：`user_id -> User.id`。
- 字段：`check_date date`, `created_at`, `source`, `point_ledger_id`。
- 唯一约束：`user_id + check_date`。
- 权限：用户可读自己的记录；签到只能通过数据库函数或 Edge Function 写入。

## PointLedger
- 主键：`id uuid`。
- 外键：`user_id -> User.id`。
- 字段：`amount`, `balance_after`, `reason`, `source_type`, `source_id`, `created_at`, `created_by`。
- 权限：用户只读自己的明细；写入只能通过服务端函数。

## Badge / UserBadge
- `Badge` 主键：`id uuid`，字段：`code`, `name`, `description`, `rule`, `visual_type`, `is_active`。
- `UserBadge` 主键：`id uuid`，外键：`badge_id`, `user_id`，唯一：`user_id + badge_id`。

## UserFollow
- 主键：`user_id`, `member_id`。
- 用途：关注成员。
- 权限：用户只能管理自己的关注。

## Post
- 主键：`id uuid`。
- 外键：`author_id -> User.id`。
- 字段：`title`, `body`, `category`, `status`, `related_member_ids`, `related_event_id`, `like_count`, `comment_count`, `favorite_count`, `created_at`, `updated_at`。
- 权限：公开读已发布；作者可编辑/删除自己的内容；管理员可隐藏/删除。

## PostMedia
- 主键：`id uuid`。
- 外键：`post_id -> Post.id`。
- 字段：`type`, `url`, `poster_url`, `alt`, `mime_type`, `size_bytes`, `sort_order`。
- 权限：上传前检查类型和大小。

## Comment
- 主键：`id uuid`。
- 外键：`post_id -> Post.id`, `author_id -> User.id`, `parent_id -> Comment.id`。
- 权限：公开读已发布；作者可删自己的评论；管理员可隐藏。

## Like / Favorite
- 主键：`id uuid`。
- 唯一约束：`user_id + target_type + target_id`。
- 权限：用户只能管理自己的点赞和收藏。

## Report
- 主键：`id uuid`。
- 字段：`reporter_id`, `target_type`, `target_id`, `reason`, `status`, `handled_by`, `handled_at`。
- 权限：用户创建；管理员处理。

## Notification
- 主键：`id uuid`。
- 字段：`user_id`, `type`, `title`, `body`, `read_at`, `target_url`。
- 权限：用户只能读自己的通知。

## OfficialUpdate / OfficialUpdateMember
- `OfficialUpdate` 字段：`title`, `body`, `type`, `published_at`, `source_label`, `source_url`, `media_url`, `status`。
- `OfficialUpdateMember`：动态与成员多对多。
- 权限：公开读已发布；管理员写入。

## CanteenPlace
- 用途：禾伙人食堂中的餐厅与口味记录。
- 主键：`id text`。
- 字段：`region`, `city`, `district`, `category`, `category_detail`, `name`, `address`, `price`, `tips`, `note`, `source_sheet`, `source_url`, `source_row`。
- 来源：用户确认已获创建人授权的腾讯文档“十个勤天&禾伙人全国巡吃”。当前从 32 个区域 CSV 生成只读数据切片；网页按地区延迟加载，不宣称与原表实时同步。
- 导入规则：每份 CSV 按自身表头识别城市、区县、菜系、地址、店名、价格和提醒列；只保留具有明确店名与食物信息的记录，拒绝价格型标题、未知店名、说明文字、表头和空行。
- 权限：公开只读；后续若进入数据库，仅管理员或受信任导入流程可写入。

## CanteenRating
- 用途：记录登录用户对静态餐厅记录的真实到店评分。
- 主键：`id uuid`；餐厅关联使用稳定的 `place_id text`，不对静态 JSON 建外键。
- 字段：`user_id`, `place_id`, `taste_score`, `service_score`, `value_score`, `environment_score`, `visited_confirmed`, `created_at`, `updated_at`。
- 分值：四项均为 `0.5–5.0`，只允许半星递增；综合分为四项均值。
- 唯一约束：`user_id + place_id`，再次提交通过 upsert 更新原记录，不重复计数。
- 权限：用户只可读写自己的评分；公开页面通过安全聚合 RPC 读取餐厅人数与各项均分，不返回 `user_id`。
- 到店边界：当前采用用户自我确认，不宣称已通过订单、定位或管理员人工核验。

## CanteenRatingMedia
- 用途：保存用户随到店评价提交的餐厅图片；当前不直接公开展示，后续公开前需接入内容审核。
- 主键：`id uuid`；通过 `rating_id` 关联 `CanteenRating`，通过 `user_id` 校验素材所有者。
- 字段：`storage_path`, `alt`, `mime_type`, `size_bytes`, `position`, `created_at`。
- 限制：每条评价最多 4 张；支持 JPEG、PNG、WebP、AVIF，单张不超过 10MB。
- 存储：私有 `canteen-rating-media` bucket，路径按 `user_id/rating_id` 隔离。
- 权限：用户只能读取、创建和删除自己的评价图片记录与 Storage 对象。

## CanteenPlaceSubmission
- 用途：接收登录用户推荐的新餐厅，避免未经核验的数据直接混入授权巡吃表生成的公开目录。
- 主键：`id uuid`；提交者字段为 `submitter_id`。
- 必填字段：`name`, `region`, `city`, `category`, 四项 `0.5–5.0` 半星评分、`visited_confirmed`。
- 选填字段：`district`, `address`, `price`, `note`, `longitude`, `latitude`, `amap_poi_id`；经纬度必须同时存在或同时为空。
- 审核字段：`status`, `reviewed_by`, `reviewed_at`, `review_note`；新投稿固定为 `reviewing`。
- 权限：登录用户只能创建并读取自己的投稿，不能自行修改审核状态；管理员可读取和审核。
- 发布边界：投稿审核通过后仍需由受信任的导入或后台流程生成正式餐厅记录；当前不会在前端直接写入静态 JSON。

## AdminLog
- 主键：`id uuid`。
- 字段：`admin_id`, `action`, `target_type`, `target_id`, `before`, `after`, `created_at`。
- 权限：仅管理员可读；只能服务端写入。

## RLS 基线
- 所有表开启 RLS。
- 前端仅使用 anon key。
- Service Role Key 只允许存在于 Edge Functions 或安全服务端。
- 管理员判断以服务端读取 `Profile.role` 或自定义 claim 为准，不能靠前端隐藏按钮。
