# Architecture

The application has one statically exported App Router route: `src/app/page.tsx`. The server-rendered route mounts `BirthdayExperience`, a client component that owns the end-to-end experience state. It dynamically imports WebGL modules with server-side rendering disabled because React Three Fiber requires browser APIs.

```text
src/
├── app/                         # route, layout, global CSS
├── components/
│   ├── experience/              # interactive celebration flow and countdown
│   └── three/                   # room scene and cake preview canvas
├── features/
│   ├── cakes/
│   │   ├── data/cake-options.ts # menu data
│   │   └── types/cake.types.ts  # cake domain contracts
│   └── celebration/
│       └── data/birthday.ts     # copy and gallery catalogue
└── lib/assets.ts                # GitHub Pages-safe public asset URLs
```

The root flow is: local-date countdown → invitation → 3D room and dashboard → optional modal content or finale. `BirthdayExperience` owns room, ceremony, cake, modal, gallery, and synthesized music state, then passes the current cake and effect state to `BirthdayRoom`. Cake configuration updates this state immediately; the room receives the configuration without a second source of truth.

Static public-image URLs are stored without the repository path. Rendered components call `assetUrl()` to prepend `NEXT_PUBLIC_BASE_PATH` and URI-encode filenames, which preserves GitHub Pages project-site compatibility.
