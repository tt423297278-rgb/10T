# Route-Specific Field Decoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage hero read as a real illustrated field and give each site section a distinct agricultural scrapbook decoration instead of repeating one wheat overlay everywhere.

**Architecture:** Extend the existing route decoration data with a small visual theme key. `FanPageDoodles` maps that key to a route-specific asset and placement classes, while the homepage receives a denser dedicated field treatment. Generated raster assets remain decorative, transparent, non-interactive, and documented in the image authorization ledger.

**Tech Stack:** React, TypeScript, CSS, Vite, built-in ImageGen, transparent WebP assets.

---

### Task 1: Generate distinct field-journal assets

**Files:**
- Create: `public/images/decor/field-horizon-home.webp`
- Create: `public/images/decor/wildflower-meadow-overlay.webp`
- Create: `public/images/decor/seedling-soil-overlay.webp`
- Create: `public/images/decor/harvest-table-overlay.webp`
- Create: `public/images/decor/film-field-overlay.webp`
- Modify: `docs/image-authorization.md`

- [ ] **Step 1: Generate each motif as a separate chroma-key asset**

Use the built-in image generation tool once per asset. Keep the same refined Chinese field-journal watercolor style, but make the subjects and silhouettes clearly different.

- [ ] **Step 2: Remove the chroma key and optimize**

Run `remove_chroma_key.py` with border auto-key, soft matte, despill, and WebP output. Verify transparent corners and no magenta fringe.

- [ ] **Step 3: Record provenance**

Add one row per generated asset to `docs/image-authorization.md`, identifying it as an original AI-generated decorative asset used by the route decoration system.

### Task 2: Add route visual themes

**Files:**
- Modify: `src/data/fanHomeDecor.ts`
- Modify: `src/components/layout/FanPageDoodles.tsx`
- Test: `src/data/fanHomeDecor.test.ts`

- [ ] **Step 1: Extend the decor model**

Add `visualTheme: 'home-field' | 'people-wheat' | 'event-wildflower' | 'aid-seedling' | 'canteen-harvest' | 'memory-film'` to `FanHomeDecor` and assign a theme to each route.

- [ ] **Step 2: Render theme-specific assets**

Replace the three repeated wheat panorama images with a route theme configuration containing unique asset paths and positions. Render two complementary placements of the selected asset without repeating the homepage field on other routes.

- [ ] **Step 3: Test route mappings**

Assert that `/`, `/canteen`, `/agri-aid`, `/events`, `/gallery`, and `/members` resolve to the expected visual theme.

### Task 3: Strengthen the homepage field and surface layering

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Make the hero field recognizable**

Use the dedicated home field horizon as a foreground band over the dark green field, increase its visual weight, and keep the central reading area clear.

- [ ] **Step 2: Add theme placement rules**

Define theme-specific sizes, opacity, mirroring, and vertical anchors. Keep `pointer-events: none`, avoid covering controls, and reduce density on mobile.

- [ ] **Step 3: Respect accessibility and performance**

Keep decorative images empty-alt and lazy-load offscreen placements. Disable decorative motion under `prefers-reduced-motion` and ensure no horizontal overflow.

### Task 4: Verify the complete site

**Files:**
- Verify: homepage, members, events, agri-aid, canteen, check-in, community, moments, gallery

- [ ] **Step 1: Run automated checks**

Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`. Expected result: all commands exit 0.

- [ ] **Step 2: Visual QA representative routes**

Inspect `/`, `/canteen`, `/agri-aid`, `/events`, and `/gallery` at desktop width. Confirm each route has a visibly different motif, the homepage reads as a field, and interactive content remains unobstructed.

- [ ] **Step 3: Mobile QA**

Inspect the homepage and canteen at a narrow viewport. Confirm no horizontal overflow, decoration opacity is reduced, and buttons remain readable and clickable.
