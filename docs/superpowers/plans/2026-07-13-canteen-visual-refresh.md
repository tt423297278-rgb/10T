# Canteen Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the canteen module a warm, food-led atmosphere while preserving all existing filters, loading states, ratings, and responsive behavior.

**Architecture:** Add one generated editorial food photograph as a responsive hero asset, derive optimized desktop/mobile WebP crops, and apply a small canteen-specific visual layer in the existing page and global stylesheet. Keep all business logic in `CanteenPage.tsx` unchanged; only presentation markup, iconography, and CSS hooks are adjusted.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Lucide React, Vite, generated raster artwork.

---

### Task 1: Generate and optimize the canteen hero artwork

**Files:**
- Create: `public/images/canteen/canteen-hero-feast.webp`
- Create: `public/images/canteen/canteen-hero-feast-mobile.webp`

- [ ] **Step 1: Generate the source artwork**

Use the built-in image generation tool with this exact production brief:

```text
Use case: photorealistic-natural
Asset type: responsive website hero background for a Chinese food directory
Primary request: a warm, inviting Chinese shared dining table with several freshly served everyday regional dishes, visible steam, ceramic bowls, chopsticks, chili oil and scallion details; authentic and appetizing rather than luxury banquet styling
Style/medium: photorealistic editorial food photography with tactile natural textures and subtle film grain
Composition/framing: panoramic landscape, three-quarter overhead viewpoint; keep the left 48% calm and dark with softly textured wooden tabletop for white UI copy; arrange the food mainly across the center-right; all important food remains safe inside the middle 70% for responsive cropping
Lighting/mood: warm evening window light and soft restaurant practical light, intimate neighborhood eatery atmosphere, rich but natural contrast
Color palette: deep forest green shadows, warm amber, chili red, wheat gold, dark walnut
Constraints: no people, no hands, no text, no logos, no trademarks, no watermark, no decorative typography, no identifiable branded packaging, no oversized single dish
Avoid: stock-photo perfection, cold studio lighting, excessive saturation, visual clutter in the left copy area, western fine-dining styling
```

- [ ] **Step 2: Inspect the image**

Confirm that the image contains no text or logos, the left copy zone is legible under a dark gradient, and the food is not cropped at the desktop focal area.

- [ ] **Step 3: Create responsive assets**

Save a desktop crop at approximately `2400x900` and a mobile crop at approximately `1200x1500`, both as WebP, preserving the food focal point and avoiding upscaling.

### Task 2: Rebuild the hero and filter presentation

**Files:**
- Modify: `src/pages/canteen/CanteenPage.tsx`

- [ ] **Step 1: Add semantic icons**

Extend the Lucide import with `BookOpen`, `Map`, `MapPinned`, `Sparkles`, and `Soup` so the hero facts and filter labels have recognisable visual cues.

- [ ] **Step 2: Replace the solid hero shell**

Render a responsive `<picture>` as decorative background media, layer a left-to-right forest gradient and subtle amber glow above it, and keep all text in a relative content layer. Add two concise fact pills using live import statistics without introducing new state or data flow.

- [ ] **Step 3: Improve the filter panel**

Add canteen-specific classes to the panel, labels, selects, and price chips. Pair each field label with one semantic icon while preserving native `<select>` behavior, fieldset semantics, keyboard focus, and 44px minimum hit targets.

- [ ] **Step 4: Carry the visual system into results**

Add a canteen page wrapper class, a result-header hook, and a place-card hook. Preserve card content, links, rating controls, grid breakpoints, and all loading/empty/error states.

### Task 3: Implement responsive visual styling

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add canteen atmosphere styles**

Create `.canteen-page`, `.canteen-hero`, `.canteen-hero-media`, and overlay rules with warm forest/amber colors, a quiet grain layer, controlled contrast, and `object-position` tuned for desktop and mobile.

- [ ] **Step 2: Style the filter surface and controls**

Create a warm translucent paper panel with backdrop blur, amber edge highlight, stronger native field contrast, and selected price chips that remain clearly distinguishable without relying on color alone.

- [ ] **Step 3: Refine results and cards**

Add a subtle ruled-paper header accent and food-directory card hover treatment. Disable decorative movement under `prefers-reduced-motion` and keep the card layout stable.

- [ ] **Step 4: Add responsive rules**

At small widths, increase hero height, switch to the portrait crop, strengthen the vertical overlay, hide nonessential fact detail when space is constrained, and avoid overlap with the filter panel.

### Task 4: Verify the complete module

**Files:**
- Test: existing project checks

- [ ] **Step 1: Run static checks**

```powershell
pnpm typecheck
pnpm lint
```

Expected: both commands exit with code 0.

- [ ] **Step 2: Run behavioral tests**

```powershell
pnpm test
```

Expected: all existing canteen filter, rating, data-service, and app tests pass.

- [ ] **Step 3: Build production assets**

```powershell
pnpm build
```

Expected: Vite production build succeeds and both generated WebP files are emitted from `public/`.

- [ ] **Step 4: Review changed files**

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors; only the plan, responsive image assets, `CanteenPage.tsx`, and `index.css` are changed.

## Self-review

- Spec coverage: generated food background, exact hero-fit crops, module-wide visual refresh, supplemental icons, responsive behavior, accessibility, and verification are covered.
- Placeholder scan: no placeholder implementation steps remain.
- Type consistency: all referenced classes and Lucide imports are introduced in the same task that consumes them; no business-domain types change.
