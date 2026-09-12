# Addley

Personal habit-tracking / wellness PWA. Veronika's own product, pre-launch.

## Architecture — read this first

There is **no build step and no framework.** Vanilla JS, hand-written HTML,
plain `<script>` tags. Do not introduce a bundler, npm, TypeScript, React, or
a package.json without being asked — the no-build setup is deliberate and is
what makes the deploy pipeline as simple as it is.

| File | What it is |
| --- | --- |
| `index.html` | Shell, all CSS (inline `<style>`), theme variables |
| `app.js` | The entire application (~19.6k lines) |
| `sw.js` | Service worker — **push notifications only**, no offline caching |
| `manifest.json` | PWA manifest |
| `supabase.min.js`, `xlsx.mini.min.js` | Vendored libraries, committed as-is |
| `supabase/functions/send-notifications/index.ts` | Deno edge function, runs every 30 min via pg_cron |

`app.js` is one large file organized by banner comments:

```
// ------------------------------------------------------------------
// Section name — what it does and why
// ------------------------------------------------------------------
```

Find your way around with `grep -n "^// ---" -A1 app.js`. Keep new code inside
the section it belongs to rather than appending to the end of the file, and add
a banner if you genuinely open a new area.

## Deploys go live immediately

`main` auto-deploys to Render on every commit (~10 seconds, no build). There is
no staging environment. A commit to `main` is a production release.

- App: `addley.onrender.com` (Render static site, auto-deploy from `main`)
- Landing page: `addley.app` (Netlify, **separate**, deployed by manual drop — not this repo)
- Backend: Supabase project `kzdtxlwzlihorrlqmpzb`

Work on a branch and merge deliberately. Because there's no test suite, "verify
before pushing" means reading the diff carefully and checking the syntax parses
(`node --check app.js`).

## State and persistence

`state` is one big mutable object (`let state = null`, initialized at boot).
It persists to **Supabase** as the source of truth, with localStorage as a local
cache. Users are real accounts; there is live user data in production, so treat
any change to the shape of `state` as a migration problem.

### Migrations — the important convention

Changes to existing users' data are applied as **one-time guarded blocks** with
a boolean flag stored on `state` itself:

```js
if (!state.someChangeV1Applied) {
  // ...mutate existing state...
  state.someChangeV1Applied = true;
}
```

Rules that hold throughout:

- **Never remove or repurpose an existing flag.** A new decision gets a new
  flag (see `sheetLabelShortenV1Applied` … `V4Applied` — four separate flags
  for four separate later decisions, not one edited in place).
- Migrations only touch data still carrying an old default. Anything the user
  has since customized is left alone.
- Nothing silently deletes a user's content.

## Product model

The app is built on **Practices** — each built-in or gallery sheet is one
Practice with its own detail page, streak, and logging. `state.sheets` holds
order and visibility; `state.customSheets` holds gallery-added ones.

Two things that trip people up:

- There was a **six-pillar Wellness model** that is now retired. Nothing writes
  to `state.wellness` for new days. Some code still reads it for historical
  Trends. Don't build new features on it.
- **Budget, Investments, and Wardrobe are out of scope** (Veronika's call,
  2026-09) and removed from existing accounts by migration. The code is still
  present. Don't extend it.

Tiers are Free / Paid / Founder, read as
`state.account?.plan === "paid" || state.account?.isFounder`.

## Style

The existing comments are unusually good — they explain *why* a decision was
made and often who made it and when. Match that. A comment saying what a
migration flag guards, or why a label was shortened, is the reason this codebase
is still navigable at 19k lines.

Design tokens live as CSS custom properties on `:root` in `index.html`, with
themes overriding only the variables (`html[data-app-theme="sage"]`, etc.).
Type never changes between themes. Don't hardcode colors — use the tokens.

## Working process — mockups before code

Veronika is the product manager, not a coder. Engineering decisions (how to
structure a fix, whether to use a table or a column, which convention to
follow) are the dev's to make — don't hand them back to her.

But **anything new and user-facing gets mockups first, reviewed, then built.**
Where it lives, what it looks like, what the copy says. Her explicit process
(2026-09-12), stated after a feedback feature started getting built straight
from a board card. Bug fixes to existing UI don't need this; new surfaces do.

Mockups belong in an artifact rendered in the app's real skin — Addley's own
tokens and faces (Work Sans / Source Serif 4), the real topbar and bottom nav —
so what she reviews is what she'll get, not an approximation.
