# Popcorn Advertising

Marketing site for Popcorn Advertising, a full-service creative and marketing agency in New Delhi.

The repository currently ships a **launch holding page**. The full four-route site is built behind an environment flag and released by flipping one variable, with no code change. See [Launch gate](#launch-gate).

**Status:** pre-launch. [What is built](#what-is-built) lists exactly what exists today, and [Before launch](#before-launch) lists what does not.

---

## Contents

- [Stack](#stack)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Environment variables](#environment-variables)
- [Launch gate](#launch-gate)
- [Project structure](#project-structure)
- [Conventions](#conventions)
- [Common tasks](#common-tasks)
- [What is built](#what-is-built)
- [Before launch](#before-launch)
- [Deployment](#deployment)

---

## Stack

| Concern             | Choice                             | Notes                                           |
| ------------------- | ---------------------------------- | ----------------------------------------------- |
| Framework           | Next.js 16.3 (App Router)          | Turbopack is the default bundler                |
| UI                  | React 19.2                         |                                                 |
| Language            | TypeScript 5, `strict` plus extras | Including `noUncheckedIndexedAccess`            |
| Styling             | Tailwind CSS v4                    | CSS-first. There is **no `tailwind.config.js`** |
| Validation          | Zod 4                              | Every type is inferred, never written twice     |
| Icons               | lucide-react 1.x                   | Brand marks are inline SVG, see below           |
| Transactional email | Resend                             | The only external service                       |
| Package manager     | pnpm 11                            | Pinned via `packageManager` in `package.json`   |
| Hosting             | Vercel                             | Every route is statically prerendered           |

Nine runtime dependencies. A tenth needs a written reason.

Two deliberate absences worth knowing about:

- **No component library.** The design is strong and specific; six primitives beat fighting a kit's defaults.
- **No client-side form library.** The notify form uses React 19's `useActionState` with the Server Action passed straight to `<form action>`, so it works before hydration and with JavaScript disabled. Adding `react-hook-form` plus Zod to the browser to validate one email field would roughly triple this page's application JavaScript.

---

## Quick start

Requires **Node 20.9+** (Next 16 minimum; developed on 24) and **pnpm 11**.

```bash
git clone <repo-url> popcorn
cd popcorn
pnpm install
cp .env.example .env.local   # then fill in the Resend values
pnpm dev
```

Open <http://localhost:3000>.

`pnpm dev` works with placeholder Resend credentials. The notify form will validate correctly and then fail at the send step with a visible fallback message, which is the intended behaviour without a real API key.

Five routes exist in development. Everything but `/` and `/dev` is behind the
launch gate, so in `coming-soon` they `307` to `/`.

| Route      | Purpose                                                             |
| ---------- | ------------------------------------------------------------------- |
| `/`        | The holding page, or the real home page when `SITE_MODE=live`       |
| `/about`   | The agency, its approach, and the four stages of a brief            |
| `/work`    | Six projects behind a chip filter derived from the project data     |
| `/contact` | The enquiry form. The only route that does anything                 |
| `/dev`     | Every UI primitive in every state. Blocked on the production deploy |

---

## Scripts

| Script              | Does                                                    |
| ------------------- | ------------------------------------------------------- |
| `pnpm dev`          | Development server                                      |
| `pnpm build`        | Production build                                        |
| `pnpm start`        | Serve the production build locally                      |
| `pnpm typecheck`    | `tsc --noEmit`                                          |
| `pnpm lint`         | ESLint. Note: `next lint` was removed in Next 16        |
| `pnpm format`       | Prettier, writing in place                              |
| `pnpm format:check` | Prettier, checking only                                 |
| `pnpm check:copy`   | Fails if a banned character reaches visitor-facing copy |
| **`pnpm verify`**   | **All of the above in CI order. This is the gate.**     |

Run `pnpm verify` before opening a pull request. CI runs the same command and additionally builds **both** `SITE_MODE` values, so the gated routing is exercised before launch day rather than on it.

### `check:copy`

House style forbids the em dash in anything a visitor can read. That rule is enforced rather than documented: `scripts/check-copy.mjs` strips comments, scans the remainder of every `.ts` and `.tsx` file, and fails the build with the offending file, line and suggestion. Code comments are exempt because they never render.

---

## Environment variables

Copy `.env.example` to `.env.local`. Every variable is required for a production build.

| Variable               | Example                          | Notes                                                           |
| ---------------------- | -------------------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://popcornadvertising.com` | No trailing slash. Used for canonicals, OG URLs and the sitemap |
| `SITE_MODE`            | `coming-soon` \| `live`          | The launch gate. Read at build time                             |
| `RESEND_API_KEY`       | `re_...`                         | Send-only key                                                   |
| `CONTACT_TO_EMAIL`     | `hello@popcornadvertising.com`   | Where enquiries and signups arrive                              |
| `CONTACT_FROM_EMAIL`   | `website@popcornadvertising.com` | **Must** be on the Resend-verified domain                       |

Two guardrails exist so misconfiguration fails loudly rather than silently:

- `src/lib/env.ts` validates the server-side values with Zod and throws at module load. It carries `import "server-only"`, so importing it from a Client Component fails the build instead of leaking the API key into the browser bundle.
- `next.config.ts` separately asserts `NEXT_PUBLIC_SITE_URL` at build time. This is not redundant. `env.ts` only runs when a module that imports it executes, which does not happen while prerendering a fully static page, so a deploy missing that variable previously succeeded and shipped `http://localhost:3000` as every canonical and `og:url`.

---

## Launch gate

`SITE_MODE` decides what the site serves. It is read at build time, which keeps every route statically prerenderable.

| Mode                    | `/`                | `/about`, `/work`, `/work/[slug]`, `/contact` |
| ----------------------- | ------------------ | --------------------------------------------- |
| `coming-soon` (default) | The holding page   | `307` redirect to `/`                         |
| `live`                  | The real home page | Served normally                               |

Anything unset or unrecognised fails closed to `coming-soon`, so a typo cannot launch the site early.

**Launching** is: set `SITE_MODE=live` in Vercel's Production environment, then redeploy. No code change, no merge. Rolling back is Vercel's Instant Rollback, which is atomic and faster than rebuilding with the flag flipped.

A redeploy is required because the value is read at build time. That is not a cost of this design: Vercel applies environment changes to new deployments only, so a request-time flag would need a redeploy to take effect either way.

Set `SITE_MODE=live` on **Preview** so every pull request deploy shows the real site while production stays gated.

Three files implement this, and nothing else needs to know about it:

- `src/lib/siteMode.ts` parses the variable. Deliberately dependency-free and **without** `server-only`, because `next.config.ts` imports it.
- `src/app/page.tsx` branches on it. Two files cannot both resolve to `/`.
- `next.config.ts` returns the redirects. They are `307`, never `308`: a permanent redirect is cached by browsers effectively forever, so anyone who visited pre-launch could never reach `/about` again, with no server-side fix available.

`robots.ts` and `sitemap.ts` are also mode-aware. While gated, the holding page is indexable (a new domain benefits from being crawled early) but the redirecting routes are disallowed and the sitemap lists only `/`, because listing a URL that redirects generates Search Console warnings.

---

## Project structure

```
src/
├─ app/                    Routing only. A page imports sections and exports metadata
│  ├─ page.tsx             The launch-gate branch
│  ├─ layout.tsx           Document shell, fonts, skip link, JSON-LD
│  ├─ error.tsx            Route error boundary
│  ├─ not-found.tsx        Branded 404, self-contained
│  ├─ robots.ts            Mode-aware
│  ├─ sitemap.ts           Mode-aware
│  ├─ manifest.ts
│  ├─ opengraph-image.tsx  Generated social card
│  └─ dev/                 Primitive gallery, blocked in production
├─ components/
│  ├─ ui/                  Generic, brand-aware, content-agnostic. Never imports from features/
│  └─ layout/              Appears on every page. Takes content as props
├─ features/
│  ├─ coming-soon/         The holding page. Deleted wholesale at launch
│  ├─ marketing/           Home and About content
│  ├─ work/                Case studies (not yet built)
│  └─ contact/             Contact form (not yet built)
├─ lib/                    Cross-cutting utilities, no JSX
└─ styles/globals.css      Design tokens, base layer, custom utilities
```

**The one hard rule: features never import from other features.** If two features need the same thing, it moves up to `components/ui/` or `lib/`. `app/` is the composition root and wires feature data into feature components, which is why `ComingSoon` receives `services` as a prop rather than importing from `features/marketing`.

---

## Conventions

Full detail lives in [`AGENTS.md`](./AGENTS.md), which `CLAUDE.md` imports. The essentials:

- **Server Components by default.** `"use client"` only for state, effects, browser APIs or event handlers, pushed as far down the tree as possible.
- **No hex codes outside `globals.css`.** Every colour is a token in the `@theme` block.
- **No barrel files.** They defeat tree-shaking and make import paths ambiguous.
- **Named exports for components**, default exports only where Next requires them.
- **Types inferred from Zod**, never written twice.
- Import order is enforced by ESLint. Run `pnpm exec eslint . --fix` rather than sorting by hand.

### One gotcha that will bite you

`src/lib/cn.ts` registers the project's custom `--spacing-*` and `--radius-*` token names with `tailwind-merge`. That library does not read the stylesheet, so without registration it cannot tell that `py-section` and `py-12` target the same property, both survive a merge, and stylesheet order silently decides the winner. **Add a spacing or radius token to `@theme` and you must add its name to `cn.ts` too.** Colour, font and text-size tokens need no entry.

---

## Common tasks

| To change                        | Edit                                           | Updates                                     |
| -------------------------------- | ---------------------------------------------- | ------------------------------------------- |
| A phone number, email, nav label | `src/lib/siteConfig.ts`                        | Everywhere it appears                       |
| The service list                 | `src/features/marketing/data/services.ts`      | Ticker and services grid together           |
| The client logo wall             | `src/features/marketing/data/clients.ts`       | Both logo strips                            |
| The hero / why-us media panels   | Pass `image` or `video` to `MediaFrame`        | Replaces the animated fallback in place     |
| A brand colour or spacing step   | `src/styles/globals.css` `@theme`              | The whole site (see the `cn.ts` note above) |
| Where the forms deliver          | `coming-soon/actions.ts`, `contact/actions.ts` | Nothing else                                |
| Launch state                     | `SITE_MODE` in Vercel                          | Routing, robots, sitemap                    |

### Adding a case study

Not yet applicable. The Work section is unbuilt. When it lands, the flow is: append an entry to `src/features/work/data.ts`, drop the image in `public/images/work/`, push. The listing, detail route and sitemap update from that one file, because everything reads through `features/work/repository.ts`.

The repository functions are `async` even though they currently read a local array. That is deliberate: making them async today costs nothing and turns the eventual move to a database or CMS into a change of three function bodies with zero call-site edits.

---

## What is built

- Toolchain: strict TypeScript, ESLint, Prettier with Tailwind class sorting, the `verify` gate, CI building both launch modes
- Design system: tokens, six UI primitives, the `/dev` gallery
- The launch gate, verified in both modes
- **The landing page**: sticky translucent header with a mobile menu, hero with the diagonal panel, the service ticker, the twelve-discipline grid, the tilted why-us band with the client wall, the popcorn-edged CTA, and the four-column footer
- **`/about`**: hero with the diagonal wedge, four counting stat cards, the sliced grape approach band, and the four numbered process steps
- **`/work`**: six project cards behind a chip filter. The filter is one `useState` in a client leaf; the cards stay Server Components and never ship to the browser
- **`/contact`**: a validated enquiry form on `useActionState`, so it works before hydration and with JavaScript off. Honeypot plus a timing check, and the timing check fails open so a no-JS submission is never rejected
- The holding page: headline, positioning copy, direct contact, service marquee, and a notify-me form that works with JavaScript disabled
- A CSS-only intro animation, self-dismissing, removed entirely under `prefers-reduced-motion`
- SEO: canonical, mode-aware robots and sitemap, generated OG image, Organization JSON-LD, manifest
- Security headers: CSP, HSTS, `frame-ancestors`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`

## Before launch

Ordered by lead time, longest first.

| Item                           | Notes                                                                                                                                                                                                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Resend domain verification** | SPF and DKIM records. Needs DNS access and propagation time. **Start this first.** Do not send from Resend's shared testing domain; it lands in spam                                                                                                            |
| **Brand typefaces**            | Type ships on **Figtree** via `next/font/google`. If the real Gilroy licence lands, drop the `.woff2` files in and swap the loader in `src/lib/fonts.ts` — nothing else changes                                                                                 |
| **Higher-resolution logos**    | Every supplied raster except `logo.png` is 1x at the size the design renders it, so the footer lockup and the eight client logos are soft on a 2x display. Ask the client for SVG or 2x PNG                                                                     |
| **Favicon**                    | No favicon ships yet. Add `app/icon.png` (or `icon.tsx`) once the brand mark is finalised                                                                                                                                                                       |
| **Rate limiting**              | Both Server Actions are public POST endpoints and Resend's free tier is 100 emails per day. The honeypot and timing check stop naive bots only; neither is rate limiting. Add a Vercel Firewall rule on `/` and `/contact`. Treat as a blocker, not a follow-up |
| `[CLIENT]` values              | Real phone number, confirmed brand hex values, social URLs, and sign-off on the copy. Grep for `[CLIENT]` and `[FIGMA]`                                                                                                                                         |
| Tests                          | There are none. The Server Action, the schema and the gate are the places to start                                                                                                                                                                              |
| Accessibility and Lighthouse   | Neither axe nor Lighthouse has been run against the finished page                                                                                                                                                                                               |
| Remaining routes               | Home, About, Work and Contact are unbuilt. See `IMPLEMENTATION.md` phases 2 to 6                                                                                                                                                                                |

---

## Deployment

Vercel, with the Next.js preset. `pnpm install --frozen-lockfile` and `pnpm build`, Node 22 or 24.

Set all five environment variables in **all three** environments. A common trap is configuring only Production, which leaves every preview deploy with a broken form that nobody notices until launch.

| Variable               | Production             | Preview             |
| ---------------------- | ---------------------- | ------------------- |
| `SITE_MODE`            | `coming-soon`          | `live`              |
| `NEXT_PUBLIC_SITE_URL` | The live domain        | The preview domain  |
| `RESEND_API_KEY`       | Production key         | A separate test key |
| `CONTACT_TO_EMAIL`     | The client inbox       | A test inbox        |
| `CONTACT_FROM_EMAIL`   | On the verified domain | Same                |

Also enable **Skew Protection**. A holding page is exactly the kind of tab people leave open for days, and a submission after a redeploy can otherwise fail with an opaque Server Action mismatch.

Every route must appear as `○` or `●` in the build output, never `ƒ`. A dynamic route means something started reading request-time data and the page is no longer served from the CDN.

---

## Further reading

- [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) is the full phased build guide for the complete site. It was written against Next 15; where it conflicts with `AGENTS.md`, `AGENTS.md` wins.
- [`AGENTS.md`](./AGENTS.md) holds the conventions, the Next 16 gotchas that apply to this repository, and the measured JavaScript budget.
