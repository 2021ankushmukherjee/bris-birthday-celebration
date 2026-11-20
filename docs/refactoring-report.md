# Refactoring report

## Scope

This was a safe domain-organization refactor. The rendered component hierarchy, JSX, CSS, state ownership, animation timings, asset paths, and public content remain unchanged.

## Changes

- Moved the cake option collections from `src/config/cakes.ts` to `src/features/cakes/data/cake-options.ts`.
- Moved cake unions and option interfaces into `src/features/cakes/types/cake.types.ts`.
- Moved birthday copy and gallery data from `src/config/birthday.ts` to `src/features/celebration/data/birthday.ts`.
- Replaced repeated environment-name interpolation with a single local `birthdayName` value while preserving every computed string.
- Updated component and README imports, then added repository/architecture/data documentation.

## Data-integrity check

| Collection | Before | After |
| --- | ---: | ---: |
| Gallery photos | 7 | 7 |
| Cake flavours | 6 | 6 |
| Cake shapes | 4 | 4 |
| Tier options | 3 | 3 |
| Candle options | 3 | 3 |
| Petal options | 3 | 3 |

All IDs, labels, order, descriptions, colour values, and asset paths were preserved.

## Validation

| Check | Result |
| --- | --- |
| ESLint | Pass — `npm run lint` |
| TypeScript | Pass — `npx tsc --noEmit` |
| Production build/static export | Pass — `npm run build` |
| GitHub Pages subpath build | Pass — `NEXT_PUBLIC_BASE_PATH=/bris-birthday-celebration npm run build` |
| Export asset check | Pass — generated HTML referenced the configured subpath and expected public images were present in `out/assets/` |
| Browser testing | Not run — browser access host unavailable |
| Mobile verification | Not run — browser access host unavailable |
| Visual comparison | Not run — browser access host unavailable |

`git diff --check` also passed. Browser automation was unavailable in the environment, so baseline screenshots and real interaction testing could not be completed; no browser result is claimed.
