# Canteen Card Covers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add appetizing, clearly labelled category cover images to canteen restaurant cards without copying third-party restaurant photos or exposing private, unreviewed rating media.

**Architecture:** Generate seven local category-level editorial food images and resolve each restaurant's category, source cuisine, and name to one deterministic cover. Keep the resolver in a small tested feature module, render the image as a non-restaurant-specific illustration in the existing card, and preserve the current private rating-media boundary until a moderation workflow exists.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Vitest, Vite, local WebP assets generated with ImageGen.

---

### Task 1: Generate the reusable category artwork

**Files:**
- Create: `public/images/canteen/covers/canteen-cover-classic.webp`
- Create: `public/images/canteen/covers/canteen-cover-fresh.webp`
- Create: `public/images/canteen/covers/canteen-cover-smoke.webp`
- Create: `public/images/canteen/covers/canteen-cover-spicy.webp`
- Create: `public/images/canteen/covers/canteen-cover-staple.webp`
- Create: `public/images/canteen/covers/canteen-cover-sweet.webp`
- Create: `public/images/canteen/covers/canteen-cover-western.webp`

- [x] **Step 1: Generate seven consistent food photographs**

Use ImageGen once per category with the shared direction: warm editorial Chinese food photography, landscape card crop, natural side light, ceramic tableware, restrained beige/clay/wheat palette, no people, no hands, no text, no logos, no watermark, no branded packaging, and no identifiable restaurant.

- [x] **Step 2: Inspect each source image**

Confirm that every image reads clearly at card size, contains no text or brand marks, and does not imply that it is an actual photograph of a listed restaurant.

- [x] **Step 3: Optimize and save WebP assets**

Create `960x600` WebP outputs in `public/images/canteen/covers/` with consistent framing and reasonable file size.

### Task 2: Add a deterministic cover resolver

**Files:**
- Create: `src/features/canteen/canteenCovers.ts`
- Create: `src/features/canteen/canteenCovers.test.ts`

- [x] **Step 1: Write resolver tests**

Cover spicy, sweet, fresh, staple, smoke, western, name-assisted, and default categories. Assert both the selected asset path and the human-readable category label.

- [x] **Step 2: Implement the resolver**

Export the flavor-tone type, category matching, asset mapping, and `getCanteenCover()` result. Keep it pure and independent of React so future approved cover URLs can be added without changing card layout.

- [x] **Step 3: Run the focused test**

```powershell
pnpm test -- src/features/canteen/canteenCovers.test.ts
```

Expected: all cover mapping cases pass.

### Task 3: Integrate the covers into restaurant cards

**Files:**
- Modify: `src/pages/canteen/CanteenPage.tsx`
- Modify: `src/index.css`

- [x] **Step 1: Use the shared resolver**

Remove the page-local flavor resolver and import `getCanteenCover()`. Preserve the existing category-specific Lucide icons.

- [x] **Step 2: Add the semantic cover figure**

Render a lazy-loaded image at the top of each card. Place the category icon over the image and show a visible `品类示意` badge so the generated image is never mistaken for that restaurant's real storefront or dish photo.

- [x] **Step 3: Refine the responsive card layout**

Use a stable landscape aspect ratio, subtle warm overlay, object-fit cropping, accessible contrast, and a compact height that does not overwhelm the existing restaurant details. Preserve picked-card state, rating controls, links, and all grid breakpoints.

- [x] **Step 4: Respect motion and loading constraints**

Use native lazy loading and async decoding. Keep hover effects restrained and disable decorative image scaling under `prefers-reduced-motion`.

### Task 4: Document image provenance and verify

**Files:**
- Modify: `docs/image-authorization.md`
- Test: existing project checks

- [x] **Step 1: Record the generated assets**

Add the seven covers to the authorization ledger as generated category illustrations. State explicitly that they are not restaurant photographs and must not be presented as such.

- [x] **Step 2: Run all checks**

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Expected: all commands exit with code 0.

- [x] **Step 3: Review the diff**

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors and only the planned code, documentation, tests, plan, and image assets are changed.

- [x] **Step 4: Visually verify the live page**

Check the Hangzhou canteen route at desktop and mobile widths. Confirm image cropping, labels, text contrast, keyboard focus, card height, and that image failures do not hide restaurant information.

## Self-review

- Spec coverage: card imagery, safe provenance, non-misleading labels, category variation, responsive behavior, accessibility, and verification are included.
- Permission boundary: private rating photos remain private; no platform scraping or third-party hotlinking is introduced.
- Type consistency: cover selection is a pure typed feature module and the existing `CanteenPlace` model remains unchanged.
- Future path: an approved public cover URL can later take precedence in the resolver after moderation and storage policies are added.
