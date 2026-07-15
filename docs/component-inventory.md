# 组件清单

## 通用组件
- `Button`：主按钮、次按钮、幽灵按钮、危险按钮、加载/禁用状态。
- `SectionHeader`：区域标题、说明、操作入口。
- `PageMeta`：页面 title、description、canonical、OG。
- `StateBlock`：加载、空、错误、无权限、未登录。
- `MediaFrame`：图片/视频占位、alt、来源、失败状态。
- `StatusBadge`：活动、帖子、审核、签到状态。

## 布局组件
- `AppLayout`：顶部导航、移动底部导航、页脚。
- `SiteHeader`：桌面主导航、登录入口、滚动状态。
- `MobileTabBar`：首页、成员、活动、签到、社区。
- `PageShell`：统一页面宽度和纵向节奏。

## 业务组件
- 成员：`MemberCard`、`MemberHero`、`TimelineList`、`MemberMediaGrid`。
- 活动：`EventFilterBar`、`CalendarMonth`、`EventList`、`EventCard`。
- 食堂：`CanteenFilterBar`（含餐厅名称搜索）、`CanteenCard`、`MealPick`、`CanteenRatingDialog`、半星 `RatingStars`、评价图片选择/预览区、`CanteenRestaurantSubmissionDialog` 与按需加载的 `CanteenAmapPicker`。
- 签到：`CheckInPanel`、`CheckInCalendar`、`PointLedgerList`、`BadgeShelf`。
- 社区：`PostCard`、`PostComposerPreview`、`CommentThread`、`InteractionBar`。
- 动态：`OfficialUpdateCard`、`UpdateFilterBar`。
- 个人中心：`ProfileSummary`、`ProfileSectionNav`。
- 后台：`AdminShell`、`AdminStatGrid`、`AdminQueueTable`。

## 状态覆盖
每个核心列表页面必须有 `loading`、`empty`、`error` 三类状态；所有登录动作必须有未登录状态；后台必须有无权限状态。
