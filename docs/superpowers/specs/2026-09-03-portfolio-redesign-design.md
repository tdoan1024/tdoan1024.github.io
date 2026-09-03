# Portfolio Redesign — Design Spec

Date: 2026-09-03

## Goal

Modernize `tdoan.space` (currently a 2019-era Bootstrap 4 + jQuery template) into
a clean, fast, professional portfolio with subtle, tasteful motion. Lead with
professional credibility (current engineering role, real impact) while keeping
a personal/interests section for personality.

## Phasing

This redesign is split into two passes:

1. **Structure/visual redesign (this implementation pass):** rebuild the site
   with the new architecture, layout, design system, and animations described
   below. Content is carried over largely as-is from the current site
   (placeholder-quality) into the new structure/sections — the goal is to get
   the shape, look, and motion right first.
2. **Content update (follow-up pass, not part of this plan):** once the
   structure is approved, revisit and finalize the actual copy — experience
   entries, project descriptions, resume file, interests — informed by the
   updated resume. Tracked separately; do not block structural work on
   content decisions.

## Content updates (reference for the follow-up pass)

Current site content is stale (still reads "recent grad", features the
Bellmont Cabinets internship as the primary experience). Updated content comes
from `C:\Users\Tai Doan\Documents\resume\Resume_TDOAN.md`:

- **Experience** (reverse chronological):
  - Nordstrom — Software Engineer 2, March 2024–Current
  - Nordstrom — Software Engineer, January 2022–February 2024
  - FreeLock Computing — Software Development Engineer, January 2021–December 2021
  - Bellmont Cabinets Co. — Software Engineering Intern, June 2019–March 2020
- **Education:** B.S. Computer Engineering, Seattle Pacific University
- **Skills:** Node.js, React, Python, Java, JavaScript, TypeScript; AWS, GCP,
  Kubernetes, Kafka, Redis, New Relic, Splunk, Optimizely, Git, SQL; AI
  tooling (Claude Code, GitHub Copilot); System Design, CI/CD, Agentic AI,
  Multi-agent orchestration, MCP
- **Projects:** keep Grobot (senior capstone) and BikeGuard from the old site;
  add this portfolio rebuild as a third project card. Projects section is
  built as an extensible grid — user plans to add new projects later and
  wants it easy to slot in more cards.
- **Interests/Extracurriculars:** trimmed, kept as a dedicated but lighter
  section — soccer, hiking, snowboarding, IEEE officer, math tutor — visual
  rather than resume-bullet style.
- **Resume asset:** replace `Resume_TDOAN.pdf` in the repo with the updated
  PDF from `C:\Users\Tai Doan\Documents\resume\Resume_TDOAN.pdf`, renamed to
  `resume.pdf`. User will keep replacing this file directly in the repo and
  pushing when it changes (no external cloud link).

## Cleanup

Remove from the repo (unrelated leftover pages):
- `breakthrough.html`
- `elections.html`
- `memes.html`
- `tutorial.html`

Remove now-unused vendor/legacy assets once the new site no longer references
them: `vendor/` (Bootstrap, jQuery, Popper, Font Awesome), `js/particles.min.js`,
`js/typed.js`, `js/typeme.js`, `css/animate.css`.

## Architecture

Single-page site, plain HTML/CSS/JS, no build step, no framework:

- `index.html` — semantic markup, single page with anchor-linked sections
- `css/styles.css` — modern CSS: custom properties for theme tokens (light +
  dark), Grid/Flexbox layout, no Bootstrap
- `js/main.js` — vanilla JS for:
  - Scroll-reveal animations via `IntersectionObserver` (respects
    `prefers-reduced-motion`)
  - Smooth anchor-link scrolling + active-section nav highlighting
  - Mobile nav toggle
  - Light/dark theme toggle, persisted in `localStorage`
  - Small rotating/typed role text in the hero (rebuilt in vanilla JS,
    replacing the old `typed.js`/`typeme.js` plugin pair)
- Icons: keep Font Awesome (existing dependency, simpler than switching to
  inline SVG).

Rationale: matches GitHub Pages (static hosting via `CNAME`), keeps the site
trivially editable by hand later, and fits the "minimal + subtle motion"
visual direction without extra tooling overhead.

## Visual design system

- **Palette:** neutral base (off-white / near-black) plus one confident
  accent color (blue/teal family — to be finalized during implementation),
  with a full dark mode via the theme toggle.
- **Type:** one modern variable sans-serif from Google Fonts (e.g. Inter or
  Manrope) — large confident headings, generous body line-height.
- **Layout:** centered max-width content column (~1100–1200px), generous
  vertical rhythm between sections, CSS Grid/Flexbox directly (no Bootstrap
  container/row/col).
- **Components:** nav bar that condenses/blurs on scroll; card components for
  experience/projects with subtle border and hover lift; timeline-style
  layout for the Experience section.

## Page structure (in order)

Content below is placeholder-quality for this pass — carried over from the
current site's copy, restructured into the new sections/design. Final copy
is a follow-up pass (see Phasing).

1. **Hero** — name, title/tagline, short one-liner, rotating role text,
   social links, resume button (links to `resume.pdf`), scroll cue
2. **About** — condensed version of current About copy
3. **Experience** — timeline: Nordstrom SE2 → SE1 → FreeLock → Bellmont intern
4. **Projects** — Grobot, BikeGuard, this portfolio rebuild; extensible grid
5. **Interests** — soccer, hiking, snowboarding, IEEE, math tutor — lighter
   visual block
6. **Contact** — LinkedIn/GitHub/email, simple footer

## Animation (subtle motion, not the main event)

- Scroll-reveal: sections/cards fade+slide in once on entering viewport
- Nav: smooth anchor scrolling, active-section highlight
- Hero: rotating role text
- Cards: hover lift + shadow, subtle scale
- Theme toggle: smooth color-scheme transition
- All motion respects `prefers-reduced-motion: reduce`

## Out of scope

- No CMS, no build tooling/framework, no 3D/WebGL effects
- No new projects beyond Grobot/BikeGuard/this rebuild for now (user is
  planning future projects to add later)
- No blog or additional pages beyond the single-page portfolio
- Final content/copy update (resume swap, rewritten experience/project copy)
  — deferred to the follow-up pass described in Phasing
