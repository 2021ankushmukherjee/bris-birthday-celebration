<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repository guide

This is a Next.js 16 App Router, TypeScript, static-export birthday experience. It uses React Three Fiber/Drei for the interactive room, Framer Motion for DOM transitions, Lucide icons, and plain CSS in `src/app/globals.css`.

### Source ownership

- `src/app/` contains the single route, root layout, and global styles.
- `src/components/experience/` owns the client-side celebration flow, countdown, modals, gallery, ceremony, music synthesis, and finale.
- `src/components/three/` owns the WebGL room and the reusable cake preview canvas. Keep it client-only and dynamically imported with `ssr: false`.
- `src/features/celebration/data/birthday.ts` is the authoritative birthday copy and photo catalogue.
- `src/features/cakes/data/cake-options.ts` is the authoritative cake/menu option catalogue; `src/features/cakes/types/cake.types.ts` owns its domain types.
- `src/lib/assets.ts` is the only helper for public asset URLs in rendered UI.

### Conventions and invariants

- Use PascalCase components, `use*` names for hooks, kebab-case data/type filenames, and type-only imports for type contracts.
- Preserve existing DOM class names, CSS values, animation timings, state defaults, asset paths, menu order, and interaction order unless a task explicitly authorizes a visual or behavioral change.
- Never invent features, types, data fields, assets, or configuration values. Inspect the actual codebase and existing contracts before making changes.
- Heart cakes intentionally force a single candle. The countdown is intentionally based on a visitor's local date/time.

### Static export and Pages deployment

`next.config.ts` must retain `output: "export"`, `trailingSlash: true`, `images.unoptimized`, and the environment-derived `basePath`/`assetPrefix`. Public assets must be passed through `assetUrl()` so they work at GitHub Pages repository subpaths. Store photographs in `public/assets/photos/`, portraits in `public/assets/avatars/`, optional music in `public/assets/music/`, and generic static SVGs in `public/assets/icons/`. Keep `.nojekyll` and App Router `icon.svg` at the public root. The deployment workflow sets `NEXT_PUBLIC_BASE_PATH` to the repository name.

### Validation

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`. `next build` creates the static `out/` export. The project has no automated test suite; browser verification should cover countdown gating, the invitation, room controls, cake modal and all 6 flavours/4 shapes/3 tier/3 candle/3 petal options, gallery navigation, wishes, finale, keyboard Escape and gallery arrows, and a build with `NEXT_PUBLIC_BASE_PATH=/bris-birthday-celebration`.
