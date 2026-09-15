# Site Architecture & Visual Redesign

## Context

The portfolio (`filippolibardi.co.uk`) is currently a single-page static site
(plain HTML/CSS/JS, no build step, deployed to GitHub Pages via the
`gh-pages` branch + `CNAME`). This is the first of four sub-projects in a
larger portfolio overhaul:

1. **Site architecture & visual redesign** (this spec)
2. Content refresh (research GitHub, pick standout projects, remove ClusTEQ
   from Employment, add ClusTEQ mention to the new About page)
3. GitHub activity visualization (fix the GitHub link, build a real
   commit/PR contribution graph, possibly 3D)
4. Articles section content/authoring flow

This spec covers only #1: the multi-page structure, navigation system, and
visual language everything else will be built on top of. It does not change
any homepage section's content — only its structure/styling and the pages
that wrap it.

## Goals

- Move from single-page-with-anchors to a small multi-page site (Home,
  About, Articles) without introducing a client-side framework or a
  heavyweight build pipeline.
- Replace the current nav with a command-palette-driven navigation system.
- Replace the current multi-color, card-heavy visual language with a
  near-monochrome, monospace-accented, "typewriter" look.
- Keep the four existing "advanced" features (dark/light toggle, particle
  background, typing-animation hero, skills carousel), restyled to fit.

## Non-goals

- Rewriting Employment/Projects/Publications *content* (sub-project #2).
- Building the GitHub contribution graph widget itself (sub-project #3) —
  this spec only reserves a slot for it on the Home page.
- Writing actual article content (sub-project #4) — this spec only builds
  the empty listing + post template.

## Architecture

**Tooling**: introduce [Eleventy (11ty)](https://www.11ty.dev/) as a minimal
static site generator.

- Zero client-side runtime cost — 11ty compiles templates to plain static
  HTML at build time, same as what's deployed today.
- Shared nav/header/footer live once, in `_includes/layouts/base.njk`,
  instead of being duplicated across pages.
- Output still deploys to GitHub Pages the same way (build step produces
  `_site/`, which is what gets pushed to `gh-pages`; `CNAME` is copied
  through as a passthrough file).
- Existing `assets/css`, `assets/js`, `images/`, `Curriculum/`, `Projects/`
  are passthrough-copied as-is; no changes to their internal structure in
  this spec.

**Pages**:

| Route | Purpose |
|---|---|
| `/` | Home — Hero, short About teaser (links to `/about/`), Employment, Projects, Publications, Skills, a reserved slot for the GitHub activity widget (built in sub-project #3), Contact. Same section anchors as today (`#hero`, `#employment`, `#projects`, `#publications`, `#skills`, `#contact`). |
| `/about/` | Full bio. Includes the ClusTEQ mention as a past role (content itself written in sub-project #2). Links to `/articles/`. |
| `/articles/` | Listing page (empty state for now) + an `articles/*.md` collection template for individual posts (authored in sub-project #4). |

## Navigation

Two layers, both driven by the same section/page manifest so they can't
drift out of sync:

1. **Top bar** (always visible, all pages): logo/initials (left), current
   page/section indicator (center), theme toggle + a `⌘K` pill button
   (right). The pill is the click target for touch/non-keyboard users.
2. **Command palette** (`Cmd/Ctrl+K`, or tap the pill): full-screen overlay,
   type-to-fuzzy-filter list of destinations — every Home section, the
   About and Articles pages, and an "Open GitHub profile" external link.
   Arrow keys + Enter to jump, `Esc` to close.

On the Home page, scroll position drives a lightweight scroll-spy that
updates the top-bar indicator — so the current section is always visible
without needing to open the palette.

## Visual design system

- **Color**: near-monochrome. Dark mode: off-black background, off-white
  text. Light mode: off-white background, near-black text. Exactly one
  accent color (reused from the current `--accent-primary`) for links, the
  typing-hero cursor, active nav state, and hover underlines. No gradients,
  no multi-color icon sets.
- **Type**: a monospace face (JetBrains Mono or IBM Plex Mono) for
  headings, nav labels, section eyebrows (styled like `// 02 Projects`),
  and the typing-animation hero text. Body copy (paragraphs, future article
  text) uses a readable sans-serif — monospace is reserved for UI chrome,
  not long-form reading.
- **Components**: generous whitespace, 1px hairline dividers instead of
  shadowed cards, restrained hover states (underline slide-in, slight
  opacity shift) instead of scale/shadow pops.

## Existing feature treatment

| Feature | Treatment |
|---|---|
| Dark/light toggle | Kept, re-themed to the palettes above. |
| Particle background canvas | Kept, restyled to monochrome/low-opacity dots at lower density — texture, not decoration. |
| Typing-animation hero | Kept, restyled with the monospace face + accent-colored blinking cursor. |
| Skills carousel | Kept, logos rendered grayscale/duotone, accent color only on hover. |

## File organization (indicative)

```
Portfolio/
├── .eleventy.js
├── _includes/
│   └── layouts/
│       ├── base.njk          # shared <head>, top bar, command palette, footer
│       └── page.njk
├── src/
│   ├── index.njk              # Home (current index.html content, ported)
│   ├── about.njk
│   ├── articles/
│   │   ├── index.njk           # listing
│   │   └── articles.11tydata.js
│   └── assets/                 # css/js/fonts, passthrough-copied
├── images/                     # unchanged, passthrough
├── Curriculum/                  # unchanged, passthrough
├── Projects/                    # unchanged, passthrough
└── CNAME
```

Exact paths may shift slightly during implementation to match 11ty
conventions, but the shared-layout / passthrough-copy split above is fixed.

## Testing / verification

- `npx eleventy --serve` locally; visually check Home/About/Articles in both
  themes, both palette-open states, and at mobile/tablet/desktop widths.
- Verify existing anchors (`#employment`, `#projects`, etc.) still work from
  external links (e.g. anything bookmarked to `filippolibardi.co.uk#projects`).
- Verify the built `_site/` output still deploys correctly to GitHub Pages
  (CNAME present, no broken asset paths).
