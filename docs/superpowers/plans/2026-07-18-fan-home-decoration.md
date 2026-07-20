# Fan Home Decoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让所有公开页面从正式的信息站转为温暖、克制、有成员陪伴感的“粉丝田野手账之家”。

**Architecture:** 保留现有页面结构和业务组件，只在 `AppLayout` 的共享外壳中增加路线化装饰数据、顶部贴纸手账带、低干扰页面涂鸦和页脚留言角。所有装饰均复用本地授权贴纸资源，交互链接仍指向成员档案，并在移动端和 Reduce Motion 下自动收敛。

**Tech Stack:** React 19、TypeScript、React Router、Framer Motion、Tailwind CSS v4、Vitest。

---

### Task 1: 路线化粉丝文案

**Files:**
- Create: `src/data/fanHomeDecor.ts`
- Create: `src/data/fanHomeDecor.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
expect(getFanHomeDecor('/canteen').title).toBe('一起去吃饭吧')
expect(getFanHomeDecor('/events/summer-live').title).toBe('不落下每一次见面')
expect(getFanHomeDecor('/unknown').title).toBe('今天也在一起')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/data/fanHomeDecor.test.ts`
Expected: FAIL because `fanHomeDecor.ts` does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
export interface FanHomeDecor {
  eyebrow: string
  title: string
  note: string
  stickerIndexes: [number, number, number]
}

export function getFanHomeDecor(pathname: string): FanHomeDecor {
  const match = routeDecor.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))
  return match?.decor ?? defaultDecor
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/data/fanHomeDecor.test.ts`
Expected: PASS.

### Task 2: 将顶部成员导航改为粉丝手账贴纸带

**Files:**
- Modify: `src/components/member/CompanionStickerRibbon.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Add route-aware copy and scrapbook details**

```tsx
const decor = getFanHomeDecor(useLocation().pathname)
const featuredStickers = decor.stickerIndexes.map((index) => companionStickers[index])
```

在原有十人入口旁加入“今日手账”纸条、路线化文案、胶带和三位成员重叠贴纸；十人入口继续保留，保证成员可发现性。

- [ ] **Step 2: Add responsive and reduced-motion styles**

桌面显示完整文案、三人贴纸与十人名册；平板隐藏次要说明；手机只保留标题和五个成员入口。所有 hover 仅轻微抬升，Reduce Motion 时关闭位移。

- [ ] **Step 3: Verify component behavior**

Run: `pnpm typecheck && pnpm lint`
Expected: both commands pass.

### Task 3: 增加全站低干扰手账涂鸦层

**Files:**
- Create: `src/components/layout/FanPageDoodles.tsx`
- Modify: `src/layouts/AppLayout.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Render decorative, non-interactive marks**

```tsx
<div className="fan-page-doodles" aria-hidden="true">
  <span className="fan-doodle fan-doodle-tape" />
  <span className="fan-doodle fan-doodle-note">一起长大</span>
  <Heart className="fan-doodle-heart" />
  <Sprout className="fan-doodle-sprout" />
</div>
```

- [ ] **Step 2: Mount it behind every public page**

把装饰层放在 `motion.main` 内、`Outlet` 前；使用 `pointer-events: none`、低透明度和独立层叠上下文，确保不遮挡任何表单或按钮。

- [ ] **Step 3: Add responsive containment**

大屏将涂鸦放在内容边缘，常规桌面只显示角落元素，手机隐藏大面积装饰并保留一条胶带和一个小印章。

### Task 4: 把正式页脚改为“家禾留言角”

**Files:**
- Modify: `src/components/layout/SiteFooter.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Add a sticker postcard cluster**

复用前三张 `companionStickers`，组成可点击的拍立得贴纸组；加入“今天也一起长大”“下次见面前，也要照顾好自己”等非业务文案。

- [ ] **Step 2: Keep legal and navigation information intact**

版权、来源说明和网站链接全部保留，只调整信息层级和视觉容器，不能把必要说明变成装饰性小字。

- [ ] **Step 3: Verify keyboard and focus states**

用 Tab 检查三张成员贴纸和页脚链接均可聚焦，焦点环不被裁切。

### Task 5: 全量验证与视觉收敛

**Files:**
- Modify if needed: `src/index.css`

- [ ] **Step 1: Run automated checks**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all commands pass.

- [ ] **Step 2: Check representative desktop routes**

在 1280px 宽度检查 `/`、`/events`、`/canteen`、`/community`：无横向滚动、无图片破损、装饰不遮挡操作区。

- [ ] **Step 3: Check mobile layout**

在 390px 宽度检查 `/events` 与 `/canteen`：顶部贴纸带不挤压标题，浮动装饰不覆盖底部导航或按钮。

- [ ] **Step 4: Check reduced motion**

启用 `prefers-reduced-motion: reduce`，确认贴纸和涂鸦不持续晃动，页面功能保持完整。

- [ ] **Step 5: Self-review**

确认没有新增第三方图片、没有硬编码业务状态、没有 P0/P1/P2 可访问性或布局问题后交付。
