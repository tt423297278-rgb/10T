# 页面地图

## 公开页面
- `/`：首页。
- `/members`：成员列表。
- `/members/:memberId`：成员详情。
- `/events`：活动日历和列表。
- `/events/:eventId`：活动详情。
- `/check-in`：每日签到。
- `/community`：粉丝社区。
- `/community/:postId`：帖子详情。
- `/updates`：成员动态。
- `/updates/:updateId`：动态详情。
- `/login`：登录。
- `/register`：注册。
- `/about`：网站说明。
- `/rules`：社区规则。

## 个人中心
- `/profile`
- `/profile/posts`
- `/profile/comments`
- `/profile/favorites`
- `/profile/following`
- `/profile/check-ins`
- `/profile/points`
- `/profile/badges`
- `/profile/notifications`
- `/profile/settings`

## 后台管理
- `/admin`
- `/admin/members`
- `/admin/events`
- `/admin/updates`
- `/admin/posts`
- `/admin/comments`
- `/admin/reports`
- `/admin/users`
- `/admin/check-ins`
- `/admin/badges`
- `/admin/settings`

## 状态页面
- 404：路径不存在。
- 未登录提示：AuthGuard 内联展示登录入口。
- 无权限提示：AdminGuard 内联展示权限说明。
- 加载/空/错误：所有核心列表页面保留组件。

