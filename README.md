# A Little World for You

A static, private-by-design birthday experience: a cinematic invitation, an interactive Three.js room, candle ceremony, gift surprises, personal gallery, wishes wall, optional music, and a finale.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Production validation/export is `npm run build`, which writes the site to `out/`.

## Personalize

All copy, the display name, birthday letter, wishes, finale, and music filename are centralized in `src/features/celebration/data/birthday.ts`. Cake choices and their typed contracts live in `src/features/cakes/`. Update those data modules rather than the scene components. Copy `.env.example` to `.env.local` to set the birthday name and `MM-DD` birthday date. The browser-local countdown is enabled by default and is a strict gate: the surprise becomes available only at midnight in the visitor's local time on the birthday. For a developer preview, set `NEXT_PUBLIC_COUNTDOWN_NOT_ENABLED=true`; otherwise leave it unset or `false`. These `NEXT_PUBLIC_*` variables are embedded at build time, so rebuild after changing them.

Put JPEG, PNG, or WebP photos in `public/assets/photos/` and update the `photoPaths` list in that same config. Portrait assets belong in `public/assets/avatars/`, and optional music belongs in `public/assets/music/`. The current supplied photos are already wired in, encoded safely for filenames with spaces, and displayed with `object-fit: contain` in the featured viewer.

Optional music goes in `public/assets/music/`; the default configured filename is `birthday.mp3`. The player is only started after a visitor interaction. A missing file simply leaves the player paused.

## GitHub Pages

The included workflow deploys automatically after a push to `main`.

1. In GitHub, open **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Push this project to `main`.
4. The published URL will be `https://USERNAME.github.io/REPOSITORY/`.

The workflow sets `NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }}` at build time. This configures `basePath`, `assetPrefix`, and the app's reusable `assetUrl()` helper so public images/audio work under repository subpaths. For local testing of that exact mode:

```bash
NEXT_PUBLIC_BASE_PATH=/REPOSITORY npm run build
```

For a custom domain, omit `NEXT_PUBLIC_BASE_PATH` in the build environment and configure the domain in GitHub Pages.

## Stack and notes

Next.js App Router + TypeScript, Tailwind CSS, React Three Fiber/Drei, Framer Motion, and Lucide are used. The app is static-export compatible (`output: "export"`), contains no API routes or server actions, and has reduced-motion styling plus keyboard Escape/arrow support for the gallery.

### Troubleshooting

- If an image 404s, verify its exact filename and add it to `photoPaths`.
- If project-page assets 404, verify the workflow used the repository name as `NEXT_PUBLIC_BASE_PATH` and rebuild.
- If WebGL is unavailable, the UI still opens the letter, memories, wishes, and finale; the 3D canvas may not render on that device.

### Privacy

Photos are not sent to any third-party image service. However, files deployed to GitHub Pages are public to anyone who knows their URLs. A private GitHub repository does **not** make its published Pages site or photo assets private.
