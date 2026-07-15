# 十个勤天陪伴社区

面向“十个勤天”粉丝的 React + Vite 互动型网站。项目定位为：记录十位成员成长、整理成员活动、支持粉丝签到和互动交流的温暖陪伴型社区。

## 当前阶段

- 阶段一：产品规划、信息架构、页面地图、用户流程、设计系统、组件清单、数据模型、动效和响应式规范已完成。
- 阶段二：本地模拟数据驱动的高质量前端原型已完成。
- 阶段三：已接入 Supabase Auth、公开数据读取、社区基础写入、每日签到 RPC、麦粒值明细和社区媒体上传。

未配置 Supabase 时，页面仍可使用本地模拟数据演示；涉及真实写入的操作会给出提示，不伪造成功状态。

## 本地运行

```bash
pnpm install
pnpm dev
```

默认开发地址：

```text
http://127.0.0.1:5173/
```

## 常用命令

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

## 环境变量

复制 `.env.example` 为 `.env.local` 并填写：

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_NAME=
VITE_APP_URL=
VITE_AMAP_KEY=
VITE_AMAP_SECURITY_JS_CODE=
VITE_AMAP_SERVICE_HOST=
```

不要把 Supabase Service Role Key、数据库管理员密码、第三方私钥或管理后台密钥放进前端环境变量。

## Supabase

迁移文件位于：

```text
supabase/migrations/202607010001_initial_schema.sql
supabase/migrations/202607010002_check_in_rpc.sql
```

当前已接入：

- Supabase Auth：注册、登录、登出、找回密码。
- 公开数据读取：成员、活动、成员动态、社区帖子和评论。
- 社区写入：发布帖子、评论、点赞、收藏。
- 社区治理：举报帖子/评论、作者删除自己的帖子。
- 媒体上传：帖子图片和短视频上传到 `post-media` bucket，并写入 `post_media`。
- 活动操作：设置活动提醒、收藏活动、生成 ICS、复制信息和系统分享。
- 每日签到：通过 `perform_daily_check_in()` RPC 服务端校验，防止重复和并发签到。
- 麦粒值：所有变动写入 `point_ledger`，前端不能直接修改积分总数。
- 个人中心：读取资料、发布、评论、收藏、关注、徽章、通知和麦粒值明细。
- 后台管理：读取审核计数、帖子/评论/举报队列，并提供基础审核状态操作。
- 食堂共建：登录用户可提交包含名称、城市、分类和四项到店评分的新餐厅推荐；详细地址可留空或通过高德地图选取，内容先进入审核队列，不直接公开。

社区媒体上传限制：

- 图片：JPEG、PNG、WebP、AVIF，单文件不超过 10MB。
- 视频：MP4、WebM，单文件不超过 50MB。
- 上传前会在前端校验类型和大小；数据库与 Storage RLS 仍是最终权限边界。

仍在后续阶段推进：

- 徽章真实发放。
- 更完整的后台表单、管理员操作日志和审核自动化。
- 更完整的 Supabase Edge Functions。

## 路由刷新配置

React + Vite 是客户端 SPA，部署时必须配置 fallback 到 `index.html`。

Netlify 已提供 `netlify.toml`：

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Nginx 示例：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Vercel 示例：

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

## 多台电脑同步开发

另一台电脑首次使用：

```bash
git clone https://github.com/tt423297278-rgb/10T.git
cd 10T
pnpm install
cp .env.example .env
pnpm dev
```

Windows PowerShell 复制环境变量文件时使用：

```powershell
Copy-Item .env.example .env
```

每次开始编辑前先同步远程更新：

```bash
git pull --rebase
```

编辑完成并通过检查后提交：

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
git add .
git commit -m "简要说明本次修改"
git push
```

不要提交真实 `.env`、Service Role Key、数据库密码或其他私钥。两台电脑不要同时修改同一文件；若确实需要并行开发，应分别创建分支再合并。

## 素材说明

首页首屏已按最新要求改为以“十位成员群像”为视觉核心。当前没有授权合照素材，因此使用本地十人剪影占位图，不包含真实人脸，不代表成员真实外貌。正式上线前必须替换为用户确认有权使用的十位成员群像素材。

## 文档

核心规划文档位于 `docs/`：

- `product-requirements.md`
- `information-architecture.md`
- `page-map.md`
- `user-flows.md`
- `design-system.md`
- `component-inventory.md`
- `data-model.md`
- `animation-guidelines.md`
- `responsive-guidelines.md`
- `development-roadmap.md`
- `supabase-setup.md`
