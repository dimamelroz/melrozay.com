# Project Context — Dima Melroz Portfolio

## What this project is
Personal portfolio website for film director Dima Melroz (commercials, music videos, AI films, documentary). Russian/Eastern European market. Audience: brands and agencies.

Owner has NO web-dev background. Delegates all technical decisions. Works on macOS with iPhone for mobile testing. Plans to host on TimeWeb shared hosting (not purchased yet).

## Stack
- Next.js 16 (App Router) + TypeScript, static export (`output: "export"`, `images.unoptimized: true`, `trailingSlash: true`)
- Tailwind CSS v4
- Framer Motion (LayoutGroup filter indicator, hero exit slide)
- react-icons (Telegram/Instagram/Vimeo)
- Video providers: Kinescope (primary), YouTube — embedded via iframe in lightbox

## Pages & key components

### `/` (home / hero)
- Background video (`/Hero.mp4` — CAPITAL H currently; MUST be renamed to lowercase `hero.mp4` before Linux deploy, code references lowercase)
- Radial vignette overlay
- "Dima Melroz" left, "ABOUT" right (header)
- WORKS button = real `<Link>` with onClick that triggers slide-up of hero `<main>` before navigation
- Bottom-right social icons (Telegram / Instagram / Vimeo)
- All foreground UI has higher z-index than video; HeroVideo wrapper is z-0 (NOT -z-10, which would hide it behind body bg)

### `/works`
- Header with brand left, filter centered absolutely (`left:50%; transform:translate(-50%,-50%)`), ABOUT right
- Masonry CSS Grid: 1/2/3 columns at 768/1024px (JS-measured via `window.innerWidth`, row height in px via `containerRef.getBoundingClientRect`)
- `computeLayout` packs columns shortest-first; verticals rowSpan 2, horizontals rowSpan 1; gap-free for any work mix
- Row-by-row + per-column staggered CSS fade-in (`work-fade-in`); delays computed from `gridRow * 0.12 + gridColumn * 0.06`; items keyed with `gridKey` so animation REPLAYS on filter change
- Marquee footer below, mounted after `requestAnimationFrame` delay to prevent flash on navigation
- VideoLightbox on click (Kinescope / YouTube iframe)

### About overlay
- Semi-transparent (`bg-black/30 backdrop-blur`)
- Two-column desktop (name + vertical photo left, bio right, contacts in right column bottom)
- Right column uses an invisible `<h2>` "spacer" to align bio top with photo top
- Mobile: stacked single column. `.about-spacer { display: none }` and `.about-heading { margin-top: -10px; line-height: 0.9 }` via media query inside the component

### Header (`src/components/layout/Header.tsx`)
- Brand "Dima Melroz" left (`font-bold`, `letterSpacing: -0.04em`, NOT uppercase)
- Filter (segmented control) centered absolutely; LayoutGroup with white indicator via `layoutId="filter-indicator"`, `layout="position"`, `initial={false}`
- Filter buttons: padding 2px 6px, lineHeight 1, font 14px bold white (active = white background, black text)
- Filter click: `window.scrollTo({top:0, behavior:"instant"})` THEN `requestAnimationFrame(() => setActiveFilter(id))` — separates scroll reset from filter change so the indicator slides sideways even when page was scrolled
- ABOUT button right, white bold

### Mobile menu (`src/components/layout/MobileMenu.tsx`)
- Fullscreen overlay opened by `+` button in header (mobile)
- Filter buttons stacked vertically, 24px text, white
- Active filter: white background rectangle around inner `<span>` (NOT the 48px tap-target button itself — so rectangle hugs text height, not the tap area). Padding `1px 6px`, lineHeight 1
- ABOUT separated by 64px top margin, same 24px text size

### WorkCard (`src/components/works/WorkCard.tsx`)
- Renders preview video if `work.previewVideo` is set (autoplay muted loop playsInline), otherwise the image cover
- Hover overlays: title block bottom-left (stacked `headline` bold larger + `subtitle` normal smaller when both exist; just subtitle larger when no headline), `role` top-right, `projectType` bottom-right
- Soft radial gradient backdrops behind top-right and bottom-right text (gradient with transparent fade — NO visible rectangle edges)
- ALL overlays have `pointer-events: none` — CRITICAL for mobile taps; touching elements that block clicks was a recurring bug

### Marquee footer (`src/components/works/MarqueeFooter.tsx`)
- Custom requestAnimationFrame-driven horizontal marquee. CSS keyframe loops flickered in Safari — DO NOT replace with CSS animation
- Measures one group's `offsetWidth`, translates by exact pixels, wraps via `offset -= groupWidth`. Two identical groups for invisible wrap
- Text: "Dima Melroz" bold, `letterSpacing -0.04em`
- SVG oval DM monogram divider between repeats: height `0.75em`, stroke `#8a8a8a` width 8, letters stretched via `scale(1, 1.35)`
- Speed: 60 px/sec (calm)

### Hero exit transition
- On click/swipe/scroll WORKS, `<main>` slides up (`y: "-100%"`) via framer-motion `animate`, then `router.push("/works")` after 500ms
- ScrollIndicator is a `<Link href="/works">` that `e.preventDefault()`s and calls passed onClick → triggers the slide
- NO PageTransition wrapper on the works page itself (multiple attempts caused mobile bugs and black flash; abandoned)

## Data

`src/data/works.ts` — array of `Work` objects, 14 real entries currently (rest are placeholders to delete or replace).

`src/types/work.ts` — Work interface:
```ts
{
  id: string;              // unique latin slug
  headline?: string;       // top line, bold, larger (e.g. artist name, brand, project)
  subtitle: string;        // bottom line, thinner, smaller when headline exists, larger when standalone
  role: string;            // e.g. "DIRECTOR", "DIRECTOR + EDITOR", "Director + Creative Producer"
  projectType: string;     // hover label e.g. "OLV", "MUSIC VIDEO", "Show", "SMM", "DOCUMENTARY"
  filterGroup: "commercial" | "music-video";  // exact strings, no variation
  orientation: "horizontal" | "vertical";
  cover: string;           // svg placeholder path (fallback if no preview)
  previewVideo?: string;   // path to preview mp4, e.g. "/works/dobry-preview.mp4"
  fullVideo: { provider: "youtube" | "vimeo" | "kinescope"; id: string };
}
```

Real works in current order (positions 1–14):
1. dobry-cola (Добрый / Лесные ягоды) — commercial / OLV
2. urban-vibes-2024 — commercial / OLV
3. wls-ya-tebya-lyublyu (WLS / Я тебя люблю) — music-video
4. alblak-7952 (ALBLAK 52 / +7(952)812) — music-video
5. urban-vibes — commercial / OLV
6. ffm-yandex-eda-burger (FFM x Яндекс Еда / Boulevard Depo) — commercial / Show
7. dobry-cola-2 (Добрый Cola) — commercial / OLV
8. wls-zhit-hochu (Я жить хочу) — music-video
9. macan-priglashenie (MACAN / Приглашение) — music-video
10. lamoda-koval-home-alone (Lamoda / Дима Коваль) — commercial / SMM / vertical
11. ffm-freestyle — commercial / Show
12. lamoda-burimova-vacation-swap (Lamoda / Саша Буримова) — commercial / SMM / vertical
13. redbull-music-festival — commercial / DOCUMENTARY
14. lildrughill-relations — music-video

## How to add a work

Owner-facing instructions: `КАК-ДОБАВИТЬ-РАБОТУ.md` in project root. Workflow:
1. Put preview mp4 in `public/works/` (1–3 MB ideal, 720p, no audio, 4–8 sec)
2. Copy a `Work` block in `src/data/works.ts`, fill in all fields
3. Important: `previewVideo` path must match the actual filename CHARACTER-FOR-CHARACTER (case, dashes, special chars). Mismatch = black card with no error.
4. `npm run build` after EVERY change in `public/` — `serve out` gives stale assets otherwise.

## What's done
- Hero with autoplay video + radial vignette + clickable WORKS Link + slide-up exit
- Masonry grid (gap-free for any work mix), responsive 1/2/3 columns
- Filter with sliding white indicator (Framer LayoutGroup)
- About overlay (two-column desktop, stacked mobile, transparent)
- Marquee footer (rAF-driven, no flicker, no flash on navigation)
- Row-by-row + per-column staggered work card fade-in (replays on filter change)
- Mobile menu with white-rectangle active filter
- 14 real works added with headline/subtitle/role/category structure
- All earlier mobile blockers fixed (blank works page, untappable buttons, viewport meta)

## Open tasks / next steps
- Add remaining real works (owner adds via form-driven flow + `КАК-ДОБАВИТЬ-РАБОТУ.md`)
- Replace placeholder entries below position 14 in `src/data/works.ts` (currently 15 placeholders remain; delete or replace as new works come in)
- **BEFORE DEPLOY**: rename `public/Hero.mp4` → `public/hero.mp4` (Mac is case-insensitive, Linux hosting is not). Code references lowercase.
- Deploy to TimeWeb. Plan: static export → upload `out/` via FTP, or GitHub Actions FTP deploy. Hosting not purchased yet.
- Optional / deferred: reverse page transition (/works → /), mix-blend-mode header, additional polish

## Critical conventions & gotchas

### Testing
- **Mobile testing**: ALWAYS use `npm run build` + `npx serve out -l 8080`, then `http://192.168.0.103:8080` on iPhone. `npm run dev` accessed by IP does NOT hydrate properly on mobile — all interactivity dies. This was the source of MANY misdiagnosed bugs.
- After ANY change in `public/`: rebuild (`npm run build`) before retesting on 8080, or serve gives stale assets.

### Data
- `filterGroup` values must be EXACTLY `"commercial"` or `"music-video"` (lowercase, hyphen). No variations.
- `previewVideo` path must match the real filename character-for-character.
- Kinescope: provider `"kinescope"`, id = the part after `/embed/` or the last URL segment.

### Code
- Don't reintroduce CSS keyframe marquee — Safari flickers. Keep the rAF-driven custom implementation.
- Don't put any transform in `style` if also using framer-motion `animate` on transform — Framer overrides CSS transforms, breaks centering.
- Hero `<video>` wrapper must be `z-0` (or positive), NOT `-z-10` (hides behind body bg).
- All hover overlay text must be `pointer-events-none` — otherwise breaks mobile tap-to-open.
- Don't add `overflow:hidden` globally to html/body — breaks scroll/touch on mobile.

### Process
- Stray empty files appear occasionally in commits (e.g. `Hover:`, `vs`, `.!####!`) from accidental terminal pastes. Clean with `git rm` + commit when noticed.
- Commit after EVERY visible working step. Owner does not commit before something works.

## Working style with the owner (Dima)

- He is NOT a developer. Skip explanations entirely. Give direct commands only.
- He gets frustrated by "I found the issue" / cause-and-effect narration. Don't say "I found the problem" until the fix is confirmed working.
- Bias for action. If a fix doesn't work, look at actual code/output (use grep, sed, cat) — don't loop on hypotheses.
- Short, direct messages. No filler, no options nobody asked for.
- Forewarn about strategic steps (GitHub setup, payments, deletions) ONE iteration before doing them.
- Don't keep telling him to restart the dev server when that's not the issue.

## Tools & environment
- macOS (Mac is case-insensitive — be careful with filenames before deploy)
- iPhone for mobile QA
- Node 26.x, npm
- VS Code editor
- Editor → file system permissions occasionally drop on macOS (EPERM on writes). Fix: System Settings → Privacy & Security → Files and Folders → Terminal → enable Desktop Folder. Restart Terminal after.
- Dev URL: `localhost:3000` (Mac only — broken on iPhone by IP)
- Static URL: `192.168.0.103:8080` (Mac AND iPhone) — via `npm run build` + `npx serve out -l 8080`
- Planned hosting: TimeWeb shared (not purchased)

## Git
- Branch: `main`. No remote configured yet (will be created when deploying).
- Commit history is rich and informative — use `git log --oneline` to see milestones.