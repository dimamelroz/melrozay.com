# Project Context — Dima Melroz Portfolio

## What this project is
Personal portfolio website for film director Dima Melroz (commercials, music videos, AI films, documentary). Russian/Eastern European market. Audience: brands and agencies.

Owner has NO web-dev background. Delegates all technical decisions. Works on macOS with iPhone for mobile testing. Plans to host on TimeWeb shared hosting.

## Stack
- Next.js 16 (App Router) with TypeScript, static export (`output: "export"`, `images.unoptimized: true`, `trailingSlash: true`)
- Tailwind CSS v4
- Framer Motion (transitions, filter indicator, hero exit)
- react-icons (Fa* for Telegram/Instagram/Vimeo)
- Video: Kinescope (primary), YouTube (fallback) via iframe embeds

## Pages & structure
- `/` — Hero with autoplay video showreel (`/Hero.mp4`, MIND THE CAPITAL H — rename to lowercase before Linux deploy), radial vignette overlay, WORKS button (now a real `<Link>`), bottom-right social icons. On click/swipe/scroll WORKS, the hero `<main>` slides up before navigation (animated via framer-motion).
- `/works` — Header (Dima Melroz left, filter centered, ABOUT right), CSS Grid masonry of works, marquee footer. PageTransition was attempted multiple times, currently REMOVED (caused mobile bugs). Only the hero slide-up exists as a transition.
- `/about` overlay — Two-column layout (name + vertical photo left, bio right, contacts bottom). Semi-transparent black `/30` + blur backdrop. Mobile: stacked, heading aligned to close button via `.about-heading { margin-top: -10px }` in a media query.

## Key components
- `src/components/works/WorksGrid.tsx` — JS-measured grid: detects columns from `window.innerWidth` (1/2/3 at 768/1024px), row height in px, masonry packing via `computeLayout`. CSS animation `work-fade-in` with row-by-row + column stagger (`item.gridRow * 0.12 + item.gridColumn * 0.06`). Mobile branch (`columns === 1`) is a separate flex column. Item keys include `gridKey` (works ids joined) so animation REPLAYS on filter change.
- `src/components/layout/Header.tsx` — Brand left ("Dima Melroz", letterSpacing -0.04em, font-bold, NOT uppercase). Filter centered absolutely (`left:50%; transform: translate(-50%,-50%)`, no framer wrapper because it broke centering). LayoutGroup with white indicator (`layoutId="filter-indicator"`, `layout="position"`, `initial={false}`). Filter click does `window.scrollTo({top:0, behavior:"instant"})` then `requestAnimationFrame(() => setActiveFilter(id))` — separates scroll reset from filter change so the indicator slides sideways even when page is scrolled.
- `src/components/works/MarqueeFooter.tsx` — Custom requestAnimationFrame-driven marquee (CSS keyframes flickered in Safari). Measures one group's `offsetWidth`, translates by exact pixels, wraps via `offset -= groupWidth`. Two identical groups so wrap is pixel-invisible. SVG oval DM monogram divider, height `0.75em`, stroke `#8a8a8a` width 8, letters stretched via `scale(1, 1.35)`.
- `src/components/works/WorkCard.tsx` — Renders preview video if `work.previewVideo` is set (autoplay muted loop playsInline), otherwise the image cover. Overlays (title bottom-left, role top-right, projectType bottom-right) all have `pointer-events: none` — CRITICAL for mobile taps.
- `src/components/hero/HeroVideo.tsx` — Full-screen video with radial vignette overlay (`radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.8) 100%)`). Wrapper z-index 0 (NOT `-z-10` — that hides it behind body bg).
- `src/components/hero/ScrollIndicator.tsx` — `<Link href="/works">` with onClick that `e.preventDefault()`s and calls passed `onClick` (so the hero slide-up plays before navigation).
- `src/components/about/AboutOverlay.tsx` — Invisible heading spacer for desktop right-column top-alignment with photo, hidden on mobile via `.about-spacer { display: none }` media query.
- `src/components/layout/MobileMenu.tsx` — Fullscreen overlay with filter buttons stacked. Active filter has WHITE rectangle behind text (wrapped in inner `<span>` so rectangle hugs text, NOT the 48px tap target).

## Data
`src/data/works.ts` — Array of `Work` objects. 18 total currently:
- 3 real: dobry-cola, urban-vibes, wls-zhit-hochu
- 15 placeholders to be replaced

Type at `src/types/work.ts`. Each work has: id, title, role, projectType, filterGroup ("commercial" | "music-video"), orientation ("horizontal" | "vertical"), cover (svg placeholder), previewVideo (mp4 path, optional), fullVideo ({ provider: "youtube" | "vimeo" | "kinescope", id }).

`КАК-ДОБАВИТЬ-РАБОТУ.md` (project root) — Russian instructions for the owner on adding works.

## What's done
- Hero with autoplay video + radial vignette
- Masonry grid (gap-free for any work mix), responsive 1/2/3 columns
- Filter with sliding white indicator (Framer LayoutGroup, layoutId)
- About overlay (two-column desktop, stacked mobile, transparent)
- Marquee footer (rAF-driven, no flicker)
- Hero slide-up exit on navigation to /works
- Row-by-row work card fade-in stagger (replays on filter change)
- Mobile menu (`+` button) with white-rectangle active filter
- Mobile WORKS button works (it's a real Link)
- Mobile viewport meta added
- 3 real works in (Dobry, Urban Vibes, WLS)
- All previous mobile bugs (blank works page, untappable buttons) fixed

## Open tasks
- WLS work needs `artist: "WLS"` field separated from title (title becomes just "Я жить хочу!"). WorkCard should render artist bold + title normal on the bottom-left overlay. Requires:
  1. Add `artist?: string` to Work interface in `src/types/work.ts`
  2. In WorkCard's title `<span>`, render `{work.artist && <span style={{ fontWeight: 700 }}>{work.artist} </span>}<span style={{ fontWeight: 400 }}>{work.title}</span>`
  3. Update wls-zhit-hochu entry: title → "Я жить хочу!", add artist: "WLS"
- Add remaining real works (preview files already in `public/works/`: dobry2, ffmfreestyle, ffmkitchen, ffmquiz, lamoda1, urbanvibes-24). Each needs Kinescope/YouTube ID + metadata. Owner adds via `КАК-ДОБАВИТЬ-РАБОТУ.md` template.
- BEFORE DEPLOY: rename `public/Hero.mp4` → `public/hero.mp4` (Mac is case-insensitive, Linux hosting is not). Code references lowercase already.
- Deploy to TimeWeb (not yet purchased). Plan: static export → upload `out/` via FTP, or set up GitHub Actions FTP deploy.
- Consider re-attempting a page transition for /works → / (back direction) — currently abrupt. Risky: previous attempts broke clicks.
- Consider mix-blend-mode on header (color inversion over content) — was a design goal, deferred due to pointer-events conflicts.

## Critical conventions / gotchas
- **Mobile testing**: ALWAYS use `npm run build` + `npx serve out -l 8080` then access via `http://192.168.0.103:8080` on iPhone. `npm run dev` accessed by IP does NOT properly hydrate on mobile — all interactivity dies. This was a major source of bug-chasing.
- **`filterGroup` values must be exactly `"commercial"` or `"music-video"`** (lowercase, hyphen). No variations.
- **Preview file naming convention**: `public/works/{id}-preview.mp4`. Path in code must match the filename character-for-character (case, dashes, everything). Mismatch = black screen, no error.
- **Kinescope videos**: `provider: "kinescope"`, `id: "{id-from-embed-url}"` (the part after `/embed/`).
- **After ANY change in `public/`**: rebuild (`npm run build`) before testing on 8080, or serve will give stale assets.
- **Stray files**: occasional `.!####!`, `Hover:`, `vs` files appear in commits — these are accidental terminal pastes. Clean up with `git rm` + commit.
- **Don't rename owner's files** — use exact filenames in code paths.

## Working style with the owner (Dima)
- He's NOT a developer — skips explanations entirely. Give direct commands only. He gets frustrated by "I found the issue" / cause-and-effect narration.
- Bias for action over analysis. If a fix doesn't work, don't repeat hypotheses — try something different or look at actual code/output.
- Does NOT commit until something visibly works. Commit AFTER each successful step.
- Wants to be told about upcoming strategic steps (GitHub, payments, deletions) one iteration in advance.
- "Found the problem" language was overused early — don't say it until the fix is confirmed working.
- Don't loop on server restarts when that's not the issue.
- He gives short, direct messages. Don't pad responses with options nobody asked for.

## Tools & environment
- macOS, iPhone for mobile QA
- Node 26.x, npm
- VS Code editor
- Claude Code (paid subscription) — this session's tool, ending soon. Migration to Codex planned.
- Dev: `localhost:3000` (Mac only), Static: `192.168.0.103:8080` (Mac + iPhone)
- Planned hosting: TimeWeb shared (not purchased yet)

## Git
- Last commit: `4a4bae9` "real works: Dobry/Urban Vibes/WLS; preview files for upcoming works; docs"
- Branch: `main`. No remote configured yet (will be created when deploying).