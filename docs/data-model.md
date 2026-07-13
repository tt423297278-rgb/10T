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

## AdminLog
- 主键：`id uuid`。
- 字段：`admin_id`, `action`, `target_type`, `target_id`, `before`, `after`, `created_at`。
- 权限：仅管理员可读；只能服务端写入。

## RLS 基线
- 所有表开启 RLS。
- 前端仅使用 anon key。
- Service Role Key 只允许存在于 Edge Functions 或安全服务端。
- 管理员判断以服务端读取 `Profile.role` 或自定义 claim 为准，不能靠前端隐藏按钮。

