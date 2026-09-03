<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Popcorn Advertising — project conventions

Full build guide: `IMPLEMENTATION.md`. That document was written against
Next 15; where it conflicts with this file, **this file wins**.

## Stack

Next.js 16 (App Router, Turbopack) · React 19.2 · TypeScript strict ·
Tailwind CSS v4 (CSS-first, **no `tailwind.config.js`**) · pnpm 11 · Vercel.
Nine runtime dependencies. A tenth needs a written reason.

## Naming

| Kind                    | Convention          | Example             |
| ----------------------- | ------------------- | ------------------- |
| Component files         | `PascalCase.tsx`    | `ServicesGrid.tsx`  |
| Non-component files     | `camelCase.ts`      | `siteConfig.ts`     |
| Route folders           | `kebab-case`        | `app/case-studies/` |
| CSS custom properties   | `--kebab-case`      | `--color-pop`       |
| Boolean props           | `is` / `has` prefix | `isActive`          |
| Event handler props     | `on` prefix         | `onSelect`          |
| Handler implementations | `handle` prefix     | `handleSubmit`      |

## Code rules

1. **One component per file**, named after the component it exports.
2. **Named exports for components.** Default exports only in route files,
   because Next requires them there.
3. **No barrel files (`index.ts`).** They defeat tree-shaking and make
   import paths ambiguous.
4. **Server Components by default.** Add `"use client"` only for state,
   effects, browser APIs or event handlers, and push it as far down the
   tree as possible.
5. **No data fetching in presentational components.** They take props or
   call a repository function.
6. **No hex codes outside `src/styles/globals.css`.** Every colour is a token.
7. **No magic numbers in class strings.** Prefer scale values (`p-6`) over
   arbitrary ones (`p-[23px]`). An arbitrary value is allowed only when it
   genuinely comes from Figma and has no scale equivalent — comment why.
8. **Props interfaces are declared above the component**, named
   `<ComponentName>Props`.
9. **Types are inferred from zod, never hand-written twice:**
   `type Contact = z.infer<typeof contactSchema>`.
10. **Every exported function gets a one-line JSDoc** unless the name is
    already unambiguous.

## Folder contract

| Folder               | Rule                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `app/`               | Routing only. A page imports sections and exports `metadata`. Nothing else.                                         |
| `components/ui/`     | Generic, brand-aware, content-agnostic. A `Button` knows nothing about advertising. Never imports from `features/`. |
| `components/layout/` | Appears on every page. Takes content as props rather than importing feature data.                                   |
| `features/*/`        | Content-aware. Owns its components, its data shape and its data access.                                             |
| `lib/`               | Cross-cutting utilities, no JSX.                                                                                    |

**The one hard rule: features never import from other features.** If two
features need the same thing, it moves up to `components/ui/` or `lib/`.
This is what allows a feature to be lifted into a package later without
unpicking a web of imports.

## Import order

Enforced by ESLint (`import/order`), groups separated by a blank line:
React/Next → third-party → internal `@/` → relative → type-only imports.
Run `pnpm exec eslint . --fix` rather than sorting by hand.

## Accessibility floor

Non-optional:

- Every interactive element reachable and operable by keyboard.
- Visible focus ring on everything focusable. `globals.css` defines one
  `:focus-visible` style for the whole site — never remove it per-component.
- All animation behind `@media (prefers-reduced-motion: no-preference)`, or
  neutralised with the `motion-safe-only` utility.
- Text contrast ≥ 4.5:1, large text ≥ 3:1.
- One `<h1>` per route, no skipped heading levels.
- Decorative images and icons get `aria-hidden="true"`.

## Next 16 gotchas that bite in this repo

- `next lint` **does not exist**. Use `pnpm lint` (`eslint .`), and note that
  `next build` no longer lints for you.
- `middleware.ts` is deprecated in favour of `proxy.ts` (default export,
  Node runtime only). This project deliberately uses neither — the launch
  gate is build-time config in `next.config.ts`.
- `params` and `searchParams` are Promises. So are `cookies()`, `headers()`
  and `draftMode()`. Always `await` them.
- Automatic smooth scrolling was removed. `<html>` carries
  `data-scroll-behavior="smooth"` so the `scroll-behavior` rule in
  `globals.css` applies to router navigation. Do not delete it.
- Reading `searchParams` in a page opts it into dynamic rendering (`ƒ` in the
  build output). Every route in this project must stay `○` or `●`.
- Zod v4: use `z.email()` / `z.url()`, not the deprecated
  `z.string().email()` / `.url()`.
- `lucide-react` v1 **removed every brand icon** (Instagram, LinkedIn,
  YouTube and the rest). Social marks come from
  `src/components/ui/SocialIcon.tsx`, drawn inline in lucide's idiom. Do not
  downgrade lucide to get them back.
- React 19 serialises `autoComplete` / `inputMode` in camelCase in the HTML.
  That is correct — HTML attribute names are case-insensitive — so do not
  "fix" it.

## Realistic JS budget

`IMPLEMENTATION.md` Phase 8 asks for "Total JS < 120 kB gzipped". **That is
not achievable on Next 16** and the target should be read as obsolete.
Measured on this project:

| Page                                    | Client JS (gzipped) |
| --------------------------------------- | ------------------- |
| A route with **zero** client components | ~173 kB             |
| The holding page (one client component) | ~183 kB             |

So the App Router baseline alone is ~173 kB, and `--webpack` only saves
~3 kB, meaning it is inherent to Next 16 + React 19.2 rather than a
Turbopack artifact. Budget **our own** contribution instead: the holding
page's entire notify form costs 10.6 kB, and that is the number worth
defending. Adding react-hook-form + zod to the client would roughly triple
it, which is why the notify form uses `useActionState`.

## Tailwind v4 and `cn()`

Tokens live in the `@theme` block of `src/styles/globals.css`. Adding a
colour, spacing step or radius there generates the utility automatically.

**`src/lib/cn.ts` needs updating in one specific case.** tailwind-merge does
not read the stylesheet, so it cannot tell that `py-section` and `py-12`
target the same property. Custom `--spacing-*` and `--radius-*` token names
are registered explicitly in `cn.ts` via `extendTailwindMerge`. Add such a
token to `@theme` and you must add its name there too, or `className`
overrides will silently stop working for it. Colour, font and text-size
tokens need no entry.

## Verification

`pnpm verify` = typecheck → lint → format:check → build. It must pass before
anything is considered done. `prettier` ignores `IMPLEMENTATION.md` — that
document is authored by hand and should not be reformatted by tooling.
