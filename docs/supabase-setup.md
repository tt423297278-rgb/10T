# Supabase 接入说明

## 结论

阶段三已经加入 Supabase Auth、公开数据读取、社区基础写入、每日签到 RPC、麦粒值明细和帖子媒体上传。未配置 Supabase 时，前端保留原型演示能力；真实写入会显示不可用提示，不伪造数据库成功状态。

## 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_NAME=十个勤天陪伴社区
VITE_APP_URL=http://localhost:5173
```

前端只能放 anon key。Service Role Key 只能放 Supabase Edge Functions 或安全服务端环境变量。

## 数据库迁移

迁移文件：

```text
supabase/migrations/202607010001_initial_schema.sql
supabase/migrations/202607010002_check_in_rpc.sql
```

已包含：

- profiles、members、events、official_updates、posts、comments、check_ins、point_ledger 等核心表。
- `public.is_admin()` 管理员判断函数。
- `public.handle_new_user()` 注册后自动创建 profile。
- 所有业务表启用 RLS。
- `member-media`、`post-media` 两个 Storage bucket 和基础对象策略。
- `perform_daily_check_in()` RPC，用服务端时间、用户身份、唯一约束和 advisory lock 防止重复签到。

## Auth 行为

- Supabase 配置完整：登录、注册、找回密码走 Supabase Auth。
- Supabase 未配置：登录和注册表单进入原型用户态，后台入口保留管理员原型态。
- Auth 状态通过 `useSupabaseAuthBridge()` 监听 session，并同步到 Zustand 的少量全局用户状态。

## 公开数据读取

- 成员列表和详情优先读取 `members`，并关联 `member_timeline`、`member_works`、`member_media`。
- 活动日历和详情优先读取 `events`，并关联 `event_members`。
- 成员动态列表和详情优先读取 `official_updates`，并关联 `official_update_members`。
- 社区列表和帖子详情优先读取 `posts`，并关联 `post_members`、`post_media`、`profiles`。
- 评论优先读取 `comments`，并关联 `profiles`。
- 未配置 Supabase 时，服务层自动回退到 `src/data/` 的本地模拟数据。

## 社区写入

- 发布帖子：写入 `posts`，关联成员写入 `post_members`，默认 `reviewing`。
- 上传媒体：上传到 Storage bucket `post-media`，再写入 `post_media`。
- 发布评论：写入 `comments`，默认 `published`。
- 点赞：写入或删除 `likes`。
- 收藏：写入或删除 `favorites`。
- 未配置 Supabase 时，页面给出提示，不伪造真实写入。

### 媒体上传限制

前端上传前会进行格式和大小校验：

- 图片 MIME：`image/jpeg`、`image/png`、`image/webp`、`image/avif`。
- 视频 MIME：`video/mp4`、`video/webm`。
- 图片单文件不超过 10MB。
- 视频单文件不超过 50MB。

Storage 与数据库仍需要保留服务端权限边界：

- 用户只能上传自己的帖子媒体。
- 管理员可隐藏或删除违规媒体。
- 文件类型和大小后续应在 Edge Function 或服务端链路再次校验。
- 正式运营前需要配置病毒扫描、内容审核和异常上传记录。

## 签到和麦粒值

- 签到页读取 `check_ins` 和 `point_ledger`。
- 每日签到通过 RPC `perform_daily_check_in()` 完成。
- RPC 内部使用 `auth.uid()`、事务级 advisory lock、`check_ins(user_id, check_date)` 唯一约束，防止重复和并发签到。
- 麦粒值只通过 `point_ledger` 写入明细，不允许前端直接修改积分总数。

## 个人中心读取

- 读取 `profiles` 展示本人公开资料。
- 读取本人 `posts`、`comments`、`favorites`、`user_follows`。
- 读取本人 `user_badges`、`notifications`、`point_ledger`。
- 未配置 Supabase 时回退到本地原型数据，方便继续验收页面结构。

## 当前仍为模拟或待运营规则完善的数据

- 徽章。
- 后台复杂表单。
- 管理员操作日志自动写入。

## 后台管理读取与审核

- 后台概览读取待审核帖子、待确认活动和待处理举报数量。
- 帖子审核读取 `posts` 中 `reviewing`、`hidden` 状态内容。
- 评论审核读取 `comments` 中 `reviewing`、`hidden` 状态内容。
- 举报处理读取 `reports` 中 `open` 状态内容。
- 审核操作会更新帖子、评论或举报状态；是否成功由 Supabase RLS 和管理员策略决定。
- 后续需要把关键审核操作迁移到 Edge Function，并写入 `admin_logs`。

## 活动和社区交互

- 活动提醒写入 `event_reminders`，默认提醒时间为活动开始前 30 分钟。
- 活动收藏复用 `favorites`，`target_type` 为 `event`。
- 活动详情可生成 ICS 文件，不依赖服务端。
- 帖子和评论举报写入 `reports`。
- 作者删除帖子通过 `posts` 删除操作完成，RLS 保证普通用户只能删除自己的内容。

## 下一步

1. 在 Supabase 项目执行 migration。
2. 确认邮箱登录和 redirect URL。
3. 录入 members、events、official_updates 的真实公开数据并检查页面读取。
4. 继续接入个人中心统计、徽章和通知。
5. 继续接入后台复杂表单、管理员操作日志和服务端审核函数。
