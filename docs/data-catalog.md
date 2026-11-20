# Data catalogue

| Collection | Authoritative location | Count | Notes |
| --- | --- | ---: | --- |
| Birthday copy, date, music path | `src/features/celebration/data/birthday.ts` | 1 object | Values read `NEXT_PUBLIC_*` variables at build time. |
| Gallery photos | `src/features/celebration/data/birthday.ts` | 7 | Public asset filenames and display order are preserved. |
| Cake flavours | `src/features/cakes/data/cake-options.ts` | 6 | Each option supplies its exact ID, display copy, swatch, frosting and filling colours. |
| Cake shapes | `src/features/cakes/data/cake-options.ts` | 4 | `heart` has the one-candle constraint. |
| Tier choices | `src/features/cakes/data/cake-options.ts` | 3 | IDs are 1, 2, and 3. |
| Candle choices | `src/features/cakes/data/cake-options.ts` | 3 | IDs are 1, 2, and 3. |
| Petal choices | `src/features/cakes/data/cake-options.ts` | 3 | IDs are 36, 72, and 108. |
| Cake type contracts | `src/features/cakes/types/cake.types.ts` | 5 unions + 5 interfaces | UI and Three.js scene use the same contracts. |

Do not move public assets or rename option IDs without updating every consumer and validating the exported site under its GitHub Pages subpath.
