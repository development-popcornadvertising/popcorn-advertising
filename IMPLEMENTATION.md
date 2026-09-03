# Popcorn Advertising — Implementation Plan

A step-by-step build guide for the Popcorn Advertising marketing site.
Follow the phases in order. Do not skip ahead: every phase depends on the one before it.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · pnpm · Vercel
**Scope:** 4 public routes, no database, one Server Action for the contact form.
**Source of truth:** the Figma file. The designer's HTML prototype is reference only.

---

## Table of contents

| Phase | Title | Est. |
|---|---|---|
| 0 | Project foundation | 3–4 h |
| 1 | Design system | 5–6 h |
| 2 | Layout shell | 4–5 h |
| 3 | Home page | 6–7 h |
| 4 | About page | 3–4 h |
| 5 | Work section | 4–5 h |
| 6 | Contact form | 3–4 h |
| 7 | SEO and metadata | 2–3 h |
| 8 | Accessibility and performance | 3–4 h |
| 9 | Deployment | 2 h |
| 10 | Handoff and future-proofing | 1–2 h |

---

## How to use this document

Each sub-phase has the same shape:

- **Goal** — one sentence describing what exists after this step.
- **Files** — exact paths created or modified.
- **Implementation** — the code, or precise instructions.
- **Acceptance** — a checklist. Do not move on until every box is ticked.
- **Commit** — the conventional-commit message to use.

Anything marked `[FIGMA]` needs a value read from the design file rather than guessed.
Anything marked `[CLIENT]` needs input from the client before launch.

---

## Non-negotiable conventions

These apply to every file in the project. They are what separate "it works" from "a skilled engineer built this."

### Naming

| Kind | Convention | Example |
|---|---|---|
| Component files | `PascalCase.tsx` | `ServicesGrid.tsx` |
| Non-component files | `camelCase.ts` | `siteConfig.ts` |
| Route folders | `kebab-case` | `app/case-studies/` |
| CSS custom properties | `--kebab-case` | `--color-pop` |
| Boolean props | `is` / `has` prefix | `isActive`, `hasIcon` |
| Event handler props | `on` prefix | `onSelect` |
| Handler implementations | `handle` prefix | `handleSubmit` |

### Code rules

1. **One component per file.** The file is named after the component it exports.
2. **Named exports for components, default export only for route files.** Next.js requires a default export from `page.tsx` / `layout.tsx`. Nothing else uses one.
3. **No barrel files (`index.ts`).** They defeat tree-shaking and make import paths ambiguous.
4. **Server Components by default.** Add `"use client"` only when the component uses state, effects, browser APIs, or event handlers. Push the directive as far down the tree as possible.
5. **No data fetching inside presentational components.** They receive data as props or call a repository function.
6. **No hex codes outside `globals.css`.** Every colour is a token.
7. **No magic numbers in class strings.** Prefer scale values (`p-6`) over arbitrary ones (`p-[23px]`). Arbitrary values are allowed only for values that genuinely come from Figma and have no scale equivalent — comment why.
8. **Props interfaces are declared above the component**, named `<ComponentName>Props`.
9. **Types are inferred from zod, never hand-written twice.** `type Contact = z.infer<typeof contactSchema>`.
10. **Every exported function gets a one-line JSDoc** if its purpose isn't obvious from the name.

### Import order

Enforced by ESLint. Groups separated by a blank line:

```ts
// 1. React / Next
import { Suspense } from "react";
import Link from "next/link";

// 2. Third-party
import { z } from "zod";

// 3. Internal absolute (@/)
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

// 4. Relative
import { ServiceCard } from "./ServiceCard";

// 5. Types (type-only imports last)
import type { Service } from "@/features/marketing/data/services";
```

### Accessibility floor

Non-optional, checked in Phase 8:

- Every interactive element reachable and operable by keyboard.
- Visible focus ring on every focusable element (never `outline: none` without a replacement).
- All animation wrapped in `@media (prefers-reduced-motion: no-preference)`.
- Text contrast ≥ 4.5:1, large text ≥ 3:1.
- One `<h1>` per route, no skipped heading levels.
- Decorative images and icons get `aria-hidden="true"`.

---
---

# Phase 0 — Project foundation

**Goal of the phase:** a repository that builds, lints, formats and deploys, with an empty but complete folder structure. No visual work yet.

---

## 0.1 Prerequisites

**Goal:** the machine can build the project.

| Tool | Version | Check |
|---|---|---|
| Node.js | 20.9+ (22 LTS recommended) | `node -v` |
| pnpm | 10.x | `pnpm -v` |
| Git | any recent | `git --version` |

Install pnpm if missing:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

**Acceptance**
- [ ] `node -v` prints 20.9 or higher
- [ ] `pnpm -v` prints 10.x

---

## 0.2 Scaffold the project

**Goal:** a running Next.js app.

```bash
pnpm create next-app@latest popcorn-website \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --eslint \
  --import-alias "@/*" \
  --use-pnpm

cd popcorn-website
pnpm dev
```

Answer `No` to Turbopack only if you hit issues; the default is fine.

Then remove the scaffolding noise:

```bash
rm -rf src/app/favicon.ico public/*.svg
```

Empty out `src/app/page.tsx` to a placeholder and strip `src/app/globals.css` down to a single line — you'll rebuild it in Phase 1.

**Acceptance**
- [ ] `pnpm dev` serves `http://localhost:3000` with no errors
- [ ] `pnpm build` completes
- [ ] No leftover Next.js demo markup or assets

**Commit:** `chore: scaffold next.js app`

---

## 0.3 TypeScript configuration

**Goal:** strict type-checking that catches real bugs.

**File:** `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,

    /* Strictness — all on, deliberately */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noEmit": true,

    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`noUncheckedIndexedAccess` is the important one — it forces you to handle the case where `services[0]` is undefined, which is exactly the class of bug that ships to production.

Add a type-check script to `package.json`:

```jsonc
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "verify": "pnpm typecheck && pnpm lint && pnpm format:check && pnpm build"
}
```

**Acceptance**
- [ ] `pnpm typecheck` passes
- [ ] `pnpm verify` passes

**Commit:** `chore: enable strict typescript`

---

## 0.4 Linting and formatting

**Goal:** consistent code style enforced automatically, class strings sorted.

```bash
pnpm add -D prettier prettier-plugin-tailwindcss eslint-plugin-import
```

**File:** `prettier.config.mjs`

```js
/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/styles/globals.css",
  tailwindFunctions: ["cn", "cva"],
};

export default config;
```

`tailwindStylesheet` is required in Tailwind v4 — the plugin needs to read your `@theme` block to know your custom class names.

**File:** `eslint.config.mjs`

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          pathGroups: [
            { pattern: "react", group: "builtin", position: "before" },
            { pattern: "next/**", group: "builtin", position: "before" },
            { pattern: "@/**", group: "internal" },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];

export default config;
```

**File:** `.prettierignore`

```
.next
node_modules
pnpm-lock.yaml
public/fonts
```

**Acceptance**
- [ ] `pnpm lint` passes
- [ ] `pnpm format` rewrites files and `pnpm format:check` then passes
- [ ] Saving a file in your editor sorts Tailwind classes

**Commit:** `chore: configure eslint and prettier`

---

## 0.5 Folder scaffold

**Goal:** every folder exists with a `.gitkeep` or a real file, so nobody has to guess where things go.

```bash
mkdir -p src/{components/{ui,layout},features/{marketing/{components,data},work/components,contact/components},lib,styles}
mkdir -p public/{fonts,images}
```

Target structure:

```
popcorn-website/
├─ public/
│  ├─ fonts/
│  ├─ images/
│  └─ logo.svg
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ not-found.tsx
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  ├─ about/page.tsx
│  │  ├─ contact/page.tsx
│  │  └─ work/
│  │     ├─ page.tsx
│  │     └─ [slug]/page.tsx
│  ├─ components/
│  │  ├─ ui/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Container.tsx
│  │  │  ├─ Eyebrow.tsx
│  │  │  ├─ Section.tsx
│  │  │  ├─ SectionHeading.tsx
│  │  │  └─ StatList.tsx
│  │  └─ layout/
│  │     ├─ Header.tsx
│  │     ├─ NavLink.tsx
│  │     ├─ MobileMenu.tsx
│  │     ├─ Marquee.tsx
│  │     └─ Footer.tsx
│  ├─ features/
│  │  ├─ marketing/
│  │  │  ├─ components/
│  │  │  └─ data/
│  │  ├─ work/
│  │  │  ├─ components/
│  │  │  ├─ schema.ts
│  │  │  ├─ data.ts
│  │  │  └─ repository.ts
│  │  └─ contact/
│  │     ├─ components/
│  │     ├─ schema.ts
│  │     └─ actions.ts
│  ├─ lib/
│  │  ├─ cn.ts
│  │  ├─ env.ts
│  │  ├─ fonts.ts
│  │  ├─ seo.ts
│  │  └─ siteConfig.ts
│  └─ styles/
│     └─ globals.css
└─ [config files]
```

### Why this shape

| Folder | Rule |
|---|---|
| `app/` | Routing only. A page file imports sections and exports `metadata`. Nothing else. |
| `components/ui/` | Generic, brand-aware, content-agnostic. A `Button` knows nothing about advertising. |
| `components/layout/` | Appears on every page. Header, footer, nav. |
| `features/*/` | Content-aware. A feature owns its components, its data shape, and its data access. |
| `lib/` | Cross-cutting utilities with no JSX. |

**The one hard rule:** features never import from other features. If `work` and `contact` both need something, it moves to `components/ui` or `lib`. This is what will let you lift a feature into a separate package later without unpicking a web of imports.

**Acceptance**
- [ ] Folder tree matches the diagram
- [ ] `pnpm build` still passes

**Commit:** `chore: scaffold folder structure`

---

## 0.6 Git and CI

**Goal:** broken code cannot reach `main`.

**Branching**

| Branch | Purpose |
|---|---|
| `main` | Deployable at all times. Protected. |
| `feat/*` | One feature, one PR |
| `fix/*` | Bug fixes |

**Commit format** — Conventional Commits:

```
feat(hero): add floating stat cards
fix(header): close mobile menu on route change
chore: bump next to 16.3.3
docs: update readme
refactor(services): extract ServiceCard
```

**File:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm format:check
      - run: pnpm build
        env:
          RESEND_API_KEY: dummy_key_for_build
          CONTACT_TO_EMAIL: build@example.com
          CONTACT_FROM_EMAIL: build@example.com
          NEXT_PUBLIC_SITE_URL: https://example.com
```

**File:** `.env.example`

```bash
# Public site URL, used for metadata and sitemap. No trailing slash.
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Resend — contact form delivery
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=hello@popcornadvertising.com
CONTACT_FROM_EMAIL=website@popcornadvertising.com
```

Copy it to `.env.local` and confirm `.env.local` is in `.gitignore`.

**Acceptance**
- [ ] `main` is protected: PR required, CI must pass
- [ ] A deliberately broken PR fails CI
- [ ] `.env.example` is committed, `.env.local` is not

**Commit:** `ci: add verification workflow`

### Phase 0 exit criteria

- [ ] `pnpm verify` passes locally and in CI
- [ ] Folder structure complete
- [ ] Conventions documented in the repo README
- [ ] Vercel project connected, preview deploys on PR

---
---

# Phase 1 — Design system

**Goal of the phase:** every colour, font, spacing value and reusable primitive exists. After this phase you can build any section without inventing a single new value.

---

## 1.1 Design tokens

**Goal:** the brand exists as CSS custom properties, and Tailwind generates utilities from them.

**File:** `src/styles/globals.css`

Tailwind v4 is configured in CSS, not JavaScript. There is no `tailwind.config.js`.

```css
@import "tailwindcss";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/*  Every value here comes from Figma. Do not add a colour to a        */
/*  component — add it here and use the generated utility.             */
/* ------------------------------------------------------------------ */

@theme {
  /* --- Brand palette [FIGMA: confirm every hex] ------------------- */
  --color-cream: #faf0dc;          /* page background */
  --color-cream-deep: #f2e4c6;     /* subtle panel on cream */
  --color-paper: #fffdf7;          /* card surface */

  --color-ink: #2e2233;            /* primary text, footer background */
  --color-ink-soft: #5a4f60;       /* body copy on cream */

  --color-pop: #c9184a;            /* primary action, accents */
  --color-pop-deep: #a41139;       /* hover state */

  --color-grape: #453079;          /* dark brand panel */
  --color-grape-soft: #6b53a8;     /* secondary headline accent */
  --color-grape-tint: #e5e0f5;     /* icon chip background */

  --color-butter: #efce79;         /* CTA band */

  /* --- Typography ------------------------------------------------- */
  --font-display: var(--font-display-face), ui-rounded, system-ui, sans-serif;
  --font-body: var(--font-body-face), ui-sans-serif, system-ui, sans-serif;

  /* Type scale — 1.25 (major third) from a 16px base */
  --text-xs: 0.75rem;      /* 12px  — eyebrow, legal */
  --text-sm: 0.875rem;     /* 14px  — footer links, labels */
  --text-base: 1rem;       /* 16px  — body */
  --text-lg: 1.125rem;     /* 18px  — lead paragraph */
  --text-xl: 1.5rem;       /* 24px  — card title */
  --text-2xl: 2rem;        /* 32px  — small section heading */
  --text-3xl: 2.75rem;     /* 44px  — section heading */
  --text-4xl: 3.5rem;      /* 56px  — hero, desktop */

  /* --- Layout ----------------------------------------------------- */
  --spacing-section: 6rem;         /* vertical rhythm between sections */
  --spacing-section-lg: 8rem;
  --radius-card: 1rem;
  --radius-pill: 999px;

  /* --- Motion ----------------------------------------------------- */
  --animate-marquee: marquee 38s linear infinite;

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Base layer                                                         */
/* ------------------------------------------------------------------ */

@layer base {
  html {
    scroll-behavior: smooth;
    /* Clears the sticky header when jumping to an anchor */
    scroll-padding-top: 6rem;
    -webkit-text-size-adjust: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }

  body {
    background-color: var(--color-cream);
    color: var(--color-ink-soft);
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }

  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-display);
    color: var(--color-ink);
    line-height: 1.1;
    letter-spacing: -0.01em;
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }

  /* One focus style for the whole site. Never remove it per-component. */
  :focus-visible {
    outline: 2px solid var(--color-pop);
    outline-offset: 3px;
    border-radius: 2px;
  }

  ::selection {
    background-color: var(--color-pop);
    color: var(--color-cream);
  }
}

/* ------------------------------------------------------------------ */
/*  Custom utilities                                                   */
/* ------------------------------------------------------------------ */

/* The diagonal cream/purple edges from the design.
   clip-path stays crisp at any viewport width and costs no extra DOM. */
@utility slice-b {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 3.5rem), 0 100%);
}

@utility slice-t {
  clip-path: polygon(0 3.5rem, 100% 0, 100% 100%, 0 100%);
}

@utility slice-tb {
  clip-path: polygon(0 3.5rem, 100% 0, 100% calc(100% - 3.5rem), 0 100%);
}

/* Pauses any animation for users who ask for reduced motion. */
@utility motion-safe-only {
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
}
```

### Token discipline

| Do | Don't |
|---|---|
| `bg-cream`, `text-ink`, `bg-pop` | `bg-[#faf0dc]` |
| `py-section` | `py-24` scattered inconsistently |
| Add a token when a value appears twice | Copy an arbitrary value into a third component |

**Acceptance**
- [ ] `bg-pop`, `text-grape`, `font-display` all resolve in the browser
- [ ] Tab-focusing any link shows the pink outline
- [ ] Every value in the file traces back to Figma

**Commit:** `feat(design): add brand tokens and base layer`

---

## 1.2 Fonts

**Goal:** the brand typefaces are self-hosted with zero layout shift.

Get the `.woff2` files from the designer. Do not substitute a lookalike from Google Fonts — the rounded display face is carrying most of the brand personality.

Place them at:

```
public/fonts/
├─ display-700.woff2
├─ display-800.woff2
├─ body-400.woff2
└─ body-500.woff2
```

**File:** `src/lib/fonts.ts`

```ts
import localFont from "next/font/local";

/** Rounded display face — headings and the logo wordmark only. */
export const displayFont = localFont({
  src: [
    { path: "../../public/fonts/display-700.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/display-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display-face",
  display: "swap",
  preload: true,
  fallback: ["ui-rounded", "system-ui", "sans-serif"],
});

/** Body face — paragraphs, labels, navigation, form fields. */
export const bodyFont = localFont({
  src: [
    { path: "../../public/fonts/body-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/body-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-body-face",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
```

Note the indirection: next/font writes `--font-display-face`, and `@theme` maps `--font-display` to it. Naming them the same would collide with the utility Tailwind generates.

**Acceptance**
- [ ] Fonts load from your own domain, not a third party (check the Network tab)
- [ ] No flash of fallback text on reload
- [ ] Lighthouse reports zero CLS from font loading

**Commit:** `feat(design): self-host brand typefaces`

---

## 1.3 The `cn` helper

**Goal:** conditional class names that merge correctly instead of fighting each other.

```bash
pnpm add clsx tailwind-merge
```

**File:** `src/lib/cn.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Joins class names conditionally and resolves Tailwind conflicts,
 * so a `className` prop can always override a component's defaults.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

Without `twMerge`, passing `className="px-8"` to a component whose base is `px-4` produces `px-4 px-8` and the winner depends on stylesheet order. With it, the last one wins predictably. Every primitive in this project accepts and merges `className`.

**Acceptance**
- [ ] `cn("px-4", "px-8")` returns `"px-8"`

**Commit:** `feat(lib): add cn class merge helper`

---

## 1.4 Site configuration

**Goal:** every piece of repeated site-wide content lives in one typed object.

**File:** `src/lib/siteConfig.ts`

```ts
export const siteConfig = {
  name: "Popcorn Advertising",
  tagline: "Ideas that pop. Results that stay.",
  description:
    "A full-service creative and marketing agency. From brand identity to celebrity engagements, we plan, produce and place work that gets noticed.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  contact: {
    email: "hello@popcornadvertising.com",
    phone: "+91 00000 00000", // [CLIENT] replace before launch
    phoneHref: "+910000000000",
    location: "New Delhi, India",
  },

  social: [
    { label: "Instagram", href: "https://instagram.com/", icon: "instagram" },
    { label: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" },
    { label: "YouTube", href: "https://youtube.com/", icon: "youtube" },
  ],

  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
    { label: "Contact", href: "/contact" },
  ],

  footerNav: {
    services: [
      { label: "Branding & UI/UX", href: "/#services" },
      { label: "Digital Ad Films", href: "/#services" },
      { label: "Influencer Marketing", href: "/#services" },
      { label: "Events Management", href: "/#services" },
    ],
    studio: [
      { label: "About us", href: "/about" },
      { label: "Our work", href: "/work" },
      { label: "Careers", href: "/careers" }, // [CLIENT] confirm this page exists
    ],
  },
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
```

`as const` means the nav labels become literal types, so a typo in a component is a compile error rather than a runtime surprise.

**Acceptance**
- [ ] No phone number, email or nav label is hardcoded anywhere else in the codebase

**Commit:** `feat(lib): add site configuration`

---

## 1.5 UI primitives

**Goal:** six components that every section is built from.

Build them in this order — each depends on the previous.

### 1.5.1 Container

**File:** `src/components/ui/Container.tsx`

```tsx
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/** Centres content and applies the responsive gutter. Used by every section. */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn("mx-auto w-full max-w-6xl px-6 md:px-10", className)}>{children}</div>;
}
```

One container, one max width, one gutter. If a section needs to break out, it does so deliberately with its own wrapper — it does not redefine the gutter.

### 1.5.2 Section

**File:** `src/components/ui/Section.tsx`

```tsx
import { cn } from "@/lib/cn";

import { Container } from "./Container";

type SectionTone = "cream" | "grape" | "ink";

interface SectionProps {
  children: React.ReactNode;
  /** Anchor target, e.g. "services" for /#services. */
  id?: string;
  /** id of the heading that names this section, for aria-labelledby. */
  labelledBy?: string;
  tone?: SectionTone;
  /** Diagonal edge treatment from the design. */
  slice?: "none" | "top" | "bottom" | "both";
  className?: string;
  /** Set true when the section manages its own Container. */
  bare?: boolean;
}

const toneStyles: Record<SectionTone, string> = {
  cream: "bg-cream text-ink-soft",
  grape: "bg-grape text-cream/85",
  ink: "bg-ink text-cream/70",
};

const sliceStyles = {
  none: "",
  top: "slice-t",
  bottom: "slice-b",
  both: "slice-tb",
} as const;

/**
 * A page section with tone, vertical rhythm, anchor id and the diagonal
 * clip treatment. Wraps children in a Container unless `bare` is set.
 */
export function Section({
  children,
  id,
  labelledBy,
  tone = "cream",
  slice = "none",
  className,
  bare = false,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "py-section md:py-section-lg relative",
        // Clears the sticky header when this section is an anchor target
        id && "scroll-mt-24",
        toneStyles[tone],
        sliceStyles[slice],
        className,
      )}
    >
      {bare ? children : <Container>{children}</Container>}
    </section>
  );
}
```

### 1.5.3 Eyebrow

**File:** `src/components/ui/Eyebrow.tsx`

```tsx
import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}

/**
 * The small pill label above a heading.
 *
 * Renders a <p>, never a heading. It labels the section visually but is not
 * part of the document outline — making it an h2/h3 would break the heading
 * hierarchy for screen readers.
 */
export function Eyebrow({ children, tone = "light", className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-pill px-4 py-1.5",
        "text-xs font-medium uppercase tracking-[0.12em]",
        "before:block before:size-1.5 before:rounded-pill before:bg-current",
        tone === "light" ? "bg-grape-tint text-grape" : "bg-white/10 text-butter",
        className,
      )}
    >
      {children}
    </p>
  );
}
```

### 1.5.4 Button

**File:** `src/components/ui/Button.tsx`

```tsx
import Link from "next/link";

import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

interface BaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type ButtonProps = BaseProps &
  (
    | ({ href: string } & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "className">)
    | ({ href?: never } & Omit<React.ComponentPropsWithoutRef<"button">, "className">)
  );

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium " +
  "transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  solid: "bg-pop text-white hover:bg-pop-deep",
  outline: "border border-grape text-grape hover:bg-grape hover:text-cream",
  ghost: "text-grape hover:text-pop",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

/**
 * Renders an anchor when `href` is given and a button otherwise.
 *
 * This distinction matters: navigation must be an <a> so it supports
 * middle-click, right-click and copy-link. Only real in-page actions
 * (submitting, toggling) are <button>.
 */
export function Button({
  children,
  variant = "solid",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as React.ComponentPropsWithoutRef<"button">;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
```

### 1.5.5 SectionHeading

**File:** `src/components/ui/SectionHeading.tsx`

```tsx
import { cn } from "@/lib/cn";

import { Eyebrow } from "./Eyebrow";

interface SectionHeadingProps {
  /** Must match the Section's labelledBy prop. */
  id: string;
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  as?: "h1" | "h2";
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Eyebrow + heading + lead paragraph, in the correct semantic order.
 * `as` defaults to h2; pass "h1" only for the single page headline.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  as: Heading = "h2",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}

      <Heading
        id={id}
        className={cn(
          "mt-5 text-3xl md:text-4xl",
          tone === "dark" ? "text-cream" : "text-ink",
        )}
      >
        {title}
      </Heading>

      {lead ? (
        <p className={cn("mt-5 text-lg", tone === "dark" ? "text-cream/80" : "text-ink-soft")}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
```

### 1.5.6 StatList

**File:** `src/components/ui/StatList.tsx`

```tsx
import { cn } from "@/lib/cn";

export interface Stat {
  value: string;
  label: string;
}

interface StatListProps {
  stats: readonly Stat[];
  variant?: "inline" | "cards";
  className?: string;
}

/**
 * Renders stats as a description list: the label is the term, the number
 * is the description. A number is data, not a heading — using <h3> here
 * would pollute the document outline.
 */
export function StatList({ stats, variant = "inline", className }: StatListProps) {
  return (
    <dl
      className={cn(
        variant === "cards"
          ? "grid grid-cols-2 gap-4 md:grid-cols-4"
          : "flex flex-wrap gap-x-12 gap-y-6",
        className,
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "flex flex-col-reverse gap-1",
            variant === "cards" && "rounded-card bg-paper px-6 py-7 text-center",
          )}
        >
          <dt className="text-xs uppercase tracking-[0.12em] text-ink-soft">{stat.label}</dt>
          <dd
            className={cn(
              "font-display text-2xl text-ink",
              variant === "cards" && "text-3xl text-pop",
            )}
          >
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
```

`flex-col-reverse` puts the number visually above the label while keeping `<dt>` before `<dd>` in the DOM, which is what the spec requires.

**Acceptance for 1.5**
- [ ] Every primitive accepts and merges `className`
- [ ] `Button` with `href` renders `<a>`; without it renders `<button type="button">`
- [ ] `Eyebrow` renders a `<p>`
- [ ] `StatList` renders `<dl>/<dt>/<dd>`
- [ ] Nothing in this folder imports from `features/`

**Commit:** `feat(ui): add layout and content primitives`

---

## 1.6 Primitive preview route (dev only)

**Goal:** see every primitive in every state on one screen, so bugs surface before they're buried in a section.

**File:** `src/app/dev/page.tsx`

```tsx
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatList } from "@/components/ui/StatList";

export default function DevPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Container className="space-y-12 py-20">
      <div className="flex flex-wrap gap-4">
        <Button variant="solid">Solid</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="solid" size="lg" href="/about">
          Link button
        </Button>
        <Button variant="solid" disabled>
          Disabled
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Eyebrow>What we do best</Eyebrow>
        <div className="bg-grape p-4">
          <Eyebrow tone="dark">Why brands pick popcorn</Eyebrow>
        </div>
      </div>

      <StatList
        stats={[
          { value: "12+", label: "Services in-house" },
          { value: "150+", label: "Campaigns launched" },
        ]}
      />
    </Container>
  );
}
```

Delete this route before launch, or leave it — the `notFound()` guard makes it a 404 in production.

**Acceptance**
- [ ] `/dev` renders every primitive
- [ ] Every variant is keyboard-focusable with a visible ring
- [ ] `/dev` returns 404 in a production build

**Commit:** `chore(dev): add primitive preview route`

### Phase 1 exit criteria

- [ ] No component contains a raw hex value
- [ ] Fonts self-hosted, no CLS
- [ ] All six primitives built and previewed
- [ ] `pnpm verify` passes

---
---

# Phase 2 — Layout shell

**Goal of the phase:** header, footer and marquee appear on every page, the mobile menu works, and the root layout is complete. No page content yet.

---

## 2.1 Root layout

**Goal:** the document shell with fonts, landmarks and base metadata.

**File:** `src/app/layout.tsx`

```tsx
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { bodyFont, displayFont } from "@/lib/fonts";
import { siteConfig } from "@/lib/siteConfig";
import "@/styles/globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-pop focus:px-5 focus:py-2.5 focus:text-white"
        >
          Skip to content
        </a>

        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

The skip link is the first focusable element on the page. It is invisible until focused, and it is the single cheapest accessibility win available — without it, a keyboard user tabs through the entire nav on every page.

**Acceptance**
- [ ] Fonts apply site-wide
- [ ] Pressing Tab on page load reveals "Skip to content"
- [ ] Activating it moves focus to `<main>`
- [ ] Page title in the browser tab is correct

**Commit:** `feat(layout): add root layout with fonts and skip link`

---

## 2.2 Header

### 2.2.1 NavLink

**Goal:** a nav item that knows whether it is the current page.

**File:** `src/components/layout/NavLink.tsx`

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onNavigate?: () => void;
  className?: string;
}

/**
 * Marks itself active when the current route matches.
 *
 * Hash links like "/#services" are never treated as the active page —
 * they scroll within a page rather than navigating to one.
 */
export function NavLink({ href, children, onNavigate, className }: NavLinkProps) {
  const pathname = usePathname();

  const isHashLink = href.includes("#");
  const isActive = !isHashLink && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative py-1 text-sm transition-colors",
        isActive
          ? "text-pop after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-pop"
          : "text-ink hover:text-pop",
        className,
      )}
    >
      {children}
    </Link>
  );
}
```

This is the only reason any part of the header needs to be a Client Component: `usePathname` is a hook. The header itself stays a Server Component.

### 2.2.2 MobileMenu

**Goal:** an accessible drawer for small screens.

**File:** `src/components/layout/MobileMenu.tsx`

```tsx
"use client";

import { useEffect, useId, useState } from "react";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";

import { NavLink } from "./NavLink";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const pathname = usePathname();

  // Close on navigation — otherwise the drawer stays open over the new page.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll and close on Escape while open.
  useEffect(() => {
    if (!isOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="grid size-10 place-items-center rounded-pill text-ink"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {isOpen ? (
        <div
          id={panelId}
          className="fixed inset-x-0 top-[var(--header-height,4.5rem)] bottom-0 z-40 bg-cream px-6 py-8"
        >
          <nav aria-label="Mobile">
            <ul className="flex flex-col gap-6">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className="text-xl">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <Button href="/contact" size="lg" className="mt-10 w-full">
            Start a project
          </Button>
        </div>
      ) : null}
    </div>
  );
}
```

Three things this gets right that most implementations miss: it closes on route change, it restores the original `body` overflow rather than blindly setting `auto`, and the toggle button is labelled by state.

### 2.2.3 Header

**File:** `src/components/layout/Header.tsx`

```tsx
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/siteConfig";

import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/85 backdrop-blur-md">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.name} home`}>
          <Image src="/logo.svg" alt="" width={32} height={32} priority />
          <span className="font-display text-lg leading-none text-ink">
            Popcorn
            <span className="block text-sm text-grape">Advertising</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/contact" size="lg" className="hidden md:inline-flex">
            Start a project
          </Button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
```

Note the logo: it is a link containing an image with `alt=""` plus visible text. The `alt` is empty because the adjacent text already says the name — giving both would make a screen reader announce "Popcorn Advertising Popcorn Advertising". The `aria-label` on the link tells the user where it goes.

It is **not** an `<h1>`. The page headline owns that.

**Acceptance**
- [ ] Header sticks on scroll with a blur backdrop
- [ ] Active route is underlined and has `aria-current="page"`
- [ ] `/#services` is never marked active
- [ ] Mobile menu opens, closes on Escape, closes on navigation, locks scroll
- [ ] Tab order is logical: skip link, logo, nav items, CTA

**Commit:** `feat(layout): add header and mobile navigation`

---

## 2.3 Marquee

**Goal:** the pink scrolling service strip, with no accessibility cost.

**File:** `src/components/layout/Marquee.tsx`

```tsx
import { services } from "@/features/marketing/data/services";

/**
 * Decorative scrolling strip of service names.
 *
 * The whole element is aria-hidden: the same list appears as real content in
 * the services grid below, and a screen reader announcing an endless loop of
 * duplicated words would be actively hostile. Motion pauses for users who
 * prefer reduced motion.
 */
export function Marquee() {
  const items = services.map((service) => service.title);

  return (
    <div aria-hidden="true" className="overflow-hidden bg-pop py-4 text-white">
      <div className="motion-safe-only flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {/* Rendered twice so the -50% translate loops seamlessly */}
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center gap-10">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-10 whitespace-nowrap font-display">
                {item}
                <span className="text-butter">✳</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
```

The duplicate-and-translate-50% technique is the only one that loops without a visible seam. Everything else needs JavaScript.

**Acceptance**
- [ ] Loop is seamless at 1280px, 768px and 375px
- [ ] Animation stops with reduced motion enabled
- [ ] Screen reader skips the entire strip
- [ ] Hovering pauses it

**Commit:** `feat(layout): add service marquee`

---

## 2.4 Footer

**File:** `src/components/layout/Footer.tsx`

```tsx
import { Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/siteConfig";

const socialIcons = {
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream/70">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.name} home`}>
              <Image src="/logo.svg" alt="" width={28} height={28} />
              <span className="font-display text-base leading-none text-cream">
                Popcorn
                <span className="block text-sm text-butter">Advertising</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm">{siteConfig.description}</p>

            <ul className="mt-6 flex gap-3">
              {siteConfig.social.map((item) => {
                const Icon = socialIcons[item.icon];
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${siteConfig.name} on ${item.label}`}
                      className="grid size-10 place-items-center rounded-pill border border-cream/15 transition-colors hover:border-cream/40 hover:text-cream"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Link columns */}
          <FooterColumn title="Services" links={siteConfig.footerNav.services} />
          <FooterColumn title="Studio" links={siteConfig.footerNav.studio} />

          {/* Contact column */}
          <div>
            <h2 className="text-sm font-medium text-cream">Contact</h2>
            <address className="mt-5 space-y-3 text-sm not-italic">
              <p>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-cream">
                  {siteConfig.contact.email}
                </a>
              </p>
              <p>
                <a href={`tel:${siteConfig.contact.phoneHref}`} className="hover:text-cream">
                  {siteConfig.contact.phone}
                </a>
              </p>
              <p>{siteConfig.contact.location}</p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/10 pt-8 text-sm md:flex-row md:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  links: readonly { label: string; href: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-sm font-medium text-cream">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className="transition-colors hover:text-cream">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Two decisions worth defending in review:

- Column titles are `<h2>`, not `<p>` or `<div>`. They are genuine headings — the fact that they render at 14px is a styling choice, not a semantic one. With CSS disabled the footer still reads as a structured document.
- Contact details sit in `<address>`, which is exactly what that element is for. `not-italic` cancels the browser default.

**Acceptance**
- [ ] Footer renders 4 columns on desktop, stacked on mobile
- [ ] Email and phone are tappable links on a real phone
- [ ] Social icons have accessible names, icons themselves are `aria-hidden`
- [ ] External links carry `rel="noreferrer noopener"`
- [ ] Year is computed, not hardcoded

**Commit:** `feat(layout): add site footer`

### Phase 2 exit criteria

- [ ] Header and footer render on every route
- [ ] Full keyboard pass across the shell with no traps
- [ ] Mobile menu behaves correctly on a real device
- [ ] `pnpm verify` passes

---
---

# Phase 3 — Home page

**Goal of the phase:** the complete home page, matching Figma at every breakpoint.

---

## 3.1 Content data

**Goal:** all repeated content is typed data, not JSX.

### 3.1.1 Services

**File:** `src/features/marketing/data/services.ts`

```ts
import {
  Camera,
  CalendarDays,
  Clapperboard,
  Grid2x2,
  Mic,
  Music,
  PlayCircle,
  Smile,
  Star,
  UserCheck,
  Video,
  Volume2,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  /** Stable id, also used as the React key. */
  id: string;
  title: string;
  icon: LucideIcon;
}

export const services = [
  { id: "branding", title: "Branding / Visuals / UI-UX", icon: Grid2x2 },
  { id: "motion", title: "Motion Design & Explainers", icon: PlayCircle },
  { id: "music", title: "Music Production & Licensing", icon: Music },
  { id: "podcast", title: "Podcast Production", icon: Mic },
  { id: "influencer", title: "Influencer Marketing", icon: UserCheck },
  { id: "ad-films", title: "Digital Ad Films", icon: Clapperboard },
  { id: "video", title: "Video Production", icon: Video },
  { id: "celebrity", title: "Celebrity Engagements", icon: Star },
  { id: "ooh", title: "OOH / Offline Activations", icon: Volume2 },
  { id: "meme", title: "Meme Marketing", icon: Smile },
  { id: "events-mgmt", title: "Events Management", icon: CalendarDays },
  { id: "events-cover", title: "Events Coverage", icon: Camera },
] as const satisfies readonly Service[];
```

`as const satisfies readonly Service[]` is the pattern to use everywhere in this project: `satisfies` type-checks the array against the interface, while `as const` preserves the literal types so consumers get exact values rather than widened `string`.

### 3.1.2 Stats and process

**File:** `src/features/marketing/data/stats.ts`

```ts
import type { Stat } from "@/components/ui/StatList";

/** Home hero — [CLIENT] confirm these figures before launch. */
export const heroStats = [
  { value: "12+", label: "Services in-house" },
  { value: "150+", label: "Campaigns launched" },
  { value: "40+", label: "Brands popped" },
] as const satisfies readonly Stat[];

/** About page. */
export const agencyStats = [
  { value: "9 yrs", label: "In business" },
  { value: "40+", label: "Brands served" },
  { value: "150+", label: "Campaigns delivered" },
  { value: "12", label: "Services, one team" },
] as const satisfies readonly Stat[];
```

**File:** `src/features/marketing/data/process.ts`

```ts
export interface ProcessStep {
  id: string;
  title: string;
  description: string;
}

export const processSteps = [
  {
    id: "listen",
    title: "Listen & scope",
    description:
      "We dig into the brand, the audience and the actual problem before touching a single deck.",
  },
  {
    id: "plan",
    title: "Plan the pop",
    description: "Strategy and creative concepting, matched to the right mix of our 12 services.",
  },
  {
    id: "produce",
    title: "Produce",
    description: "In-house shoots, edits, design and production — no third-party hand-offs.",
  },
  {
    id: "launch",
    title: "Launch & track",
    description: "We place the work, watch the numbers, and keep tuning while it's live.",
  },
] as const satisfies readonly ProcessStep[];
```

**Acceptance**
- [ ] No service, stat or step string appears in a component file
- [ ] `pnpm typecheck` passes

**Commit:** `feat(marketing): add content data`

---

## 3.2 Hero

**Goal:** the split hero with the diagonal purple panel and floating stat cards.

**File:** `src/features/marketing/components/Hero.tsx`

```tsx
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatList } from "@/components/ui/StatList";
import { heroStats } from "@/features/marketing/data/stats";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* Diagonal purple panel — decorative, sits behind the content on
          mobile and beside it on desktop. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-1/2 bg-grape lg:block [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
      />

      <Container className="relative grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <Eyebrow>Full-service creative &amp; marketing agency</Eyebrow>

          <h1 id="hero-heading" className="mt-6 text-4xl md:text-[3.75rem]">
            Ideas that <span className="text-pop">POP.</span>
            <br />
            Results that <span className="text-grape-soft">stay.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg">
            From brand identity to celebrity engagements, we plan, produce and place work that gets
            noticed — and keeps performing after the noise dies down.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/work" size="lg">
              See our work
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Say hello
            </Button>
          </div>

          <StatList stats={heroStats} className="mt-14" />
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}

/** The popcorn mark with two floating metric cards. */
function HeroVisual() {
  return (
    <div className="relative hidden min-h-[26rem] lg:block">
      <MetricCard
        label="Digital ad film"
        value="2.4M"
        caption="views in week one"
        className="absolute left-0 top-8 -rotate-3"
      />
      <MetricCard
        label="Influencer push"
        value="89"
        caption="creators activated"
        className="absolute bottom-10 right-0 rotate-2"
      />
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  caption: string;
  className?: string;
}

function MetricCard({ label, value, caption, className }: MetricCardProps) {
  return (
    <div className={`w-56 rounded-card bg-paper p-5 shadow-lg shadow-ink/10 ${className ?? ""}`}>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-grape">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
      <p className="mt-1 text-sm">{caption}</p>
    </div>
  );
}
```

### Notes on the hero

| Decision | Reason |
|---|---|
| Diagonal panel is a sibling `div`, not a background image | Scales to any viewport, no asset to load, no LCP cost |
| Panel is `aria-hidden` | Purely decorative |
| Metric cards hidden below `lg` | They overlap the headline at small widths; Figma drops them too |
| Coloured words are `<span>` inside the `h1` | Splitting the headline into multiple headings would break the outline |
| No entrance animation | The design doesn't call for one, and a fade-and-slide on every section is the tell of a templated build |

**Acceptance**
- [ ] Matches Figma at 1440, 1024, 768, 375
- [ ] Diagonal edge stays clean at every width
- [ ] Exactly one `<h1>` on the page
- [ ] Hero text is the LCP element and paints under 2s on throttled 4G

**Commit:** `feat(home): add hero section`

---

## 3.3 Services grid

**File:** `src/features/marketing/components/ServicesGrid.tsx`

```tsx
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/features/marketing/data/services";

export function ServicesGrid() {
  return (
    <Section id="services" labelledBy="services-heading">
      <SectionHeading
        id="services-heading"
        eyebrow="What we do best"
        title="One team, twelve disciplines."
        lead="Everything a brand needs to launch, land and linger — handled under one roof, so nothing gets lost between the strategy deck and the final cut."
      />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <li
              key={service.id}
              className="rounded-card bg-paper p-6 transition-shadow hover:shadow-md hover:shadow-ink/5"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-grape-tint text-grape">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-8 text-base">{service.title}</h3>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
```

Twelve cards, one `map`. If you find yourself writing the twelfth card by hand, stop and move it to data.

The `id="services"` plus `scroll-mt-24` from `Section` is what makes the header's Services link land correctly instead of hiding the heading behind the sticky bar.

**Acceptance**
- [ ] 4 columns desktop, 2 tablet, 1 mobile
- [ ] Clicking Services in the header scrolls here with the heading fully visible
- [ ] Clicking Services from `/about` navigates home and then scrolls
- [ ] Icons are `aria-hidden`; a screen reader reads twelve list items
- [ ] Cards are not links (they don't navigate anywhere yet) — so they are not focusable

**Commit:** `feat(home): add services grid`

---

## 3.4 Why us band

**File:** `src/features/marketing/components/WhyUs.tsx`

```tsx
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function WhyUs() {
  return (
    <Section tone="grape" slice="both" labelledBy="why-heading">
      <SectionHeading
        id="why-heading"
        tone="dark"
        eyebrow="Why brands pick Popcorn"
        title="Built for brands that want it all handled — and handled well."
        lead="No shuffling between five vendors for one campaign. Strategy, production and distribution live in the same room, so ideas move from brief to broadcast without losing their pop."
      />

      <Button href="/about" size="lg" className="mt-9">
        More about us
      </Button>
    </Section>
  );
}
```

The `slice="both"` prop produces both diagonal edges. Because it is a utility on the section rather than a pseudo-element, there is nothing to keep in sync when padding changes.

**Acceptance**
- [ ] Diagonal top and bottom edges match Figma
- [ ] White-on-purple text passes 4.5:1 contrast
- [ ] The clip doesn't cut off text at any width

**Commit:** `feat(home): add why-us band`

---

## 3.5 CTA band

**Goal:** a reusable yellow call-to-action used on more than one page.

**File:** `src/features/marketing/components/CtaBand.tsx`

```tsx
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

interface CtaBandProps {
  /** Unique per page — two identical ids on one page is invalid HTML. */
  headingId?: string;
  title?: string;
  ctaLabel?: string;
}

export function CtaBand({
  headingId = "cta-heading",
  title = "Got a brand that needs to pop?",
  ctaLabel = "Let's talk",
}: CtaBandProps) {
  return (
    <Section labelledBy={headingId}>
      <div className="flex flex-col items-start gap-8 rounded-card bg-butter px-8 py-12 md:flex-row md:items-center md:justify-between md:px-14">
        <h2 id={headingId} className="max-w-md text-3xl text-ink">
          {title}
        </h2>
        <Button href="/contact" size="lg" className="shrink-0">
          {ctaLabel}
        </Button>
      </div>
    </Section>
  );
}
```

Props with defaults rather than a duplicated component. The About page reuses it with different copy.

**Acceptance**
- [ ] Stacks vertically on mobile, side by side on desktop
- [ ] Ink-on-butter contrast passes
- [ ] `headingId` differs on each page that uses it

**Commit:** `feat(home): add cta band`

---

## 3.6 Compose the page

**File:** `src/app/page.tsx`

```tsx
import { Marquee } from "@/components/layout/Marquee";
import { CtaBand } from "@/features/marketing/components/CtaBand";
import { Hero } from "@/features/marketing/components/Hero";
import { ServicesGrid } from "@/features/marketing/components/ServicesGrid";
import { WhyUs } from "@/features/marketing/components/WhyUs";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <ServicesGrid />
      <WhyUs />
      <CtaBand />
    </>
  );
}
```

That is the whole page file. If a route file ever grows past about twenty lines, something belongs in a section component instead.

**Acceptance**
- [ ] Home matches Figma top to bottom
- [ ] Heading outline is exactly: h1, then h2 per section, then h3 per card
- [ ] Zero console warnings
- [ ] `pnpm build` output shows the route as static

**Commit:** `feat(home): compose home page`

### Phase 3 exit criteria

- [ ] Visual diff against Figma at 4 breakpoints
- [ ] Keyboard pass end to end
- [ ] Lighthouse ≥ 95 on all four categories
- [ ] `pnpm verify` passes

---
---

# Phase 4 — About page

**Goal of the phase:** the About route, reusing everything built so far.

---

## 4.1 About hero

**File:** `src/features/marketing/components/AboutHero.tsx`

```tsx
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatList } from "@/components/ui/StatList";
import { agencyStats } from "@/features/marketing/data/stats";

export function AboutHero() {
  return (
    <section aria-labelledby="about-heading" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-1/2 bg-grape lg:block [clip-path:polygon(18%_0,100%_0,100%_78%,0_78%)]"
      />

      <Container className="relative py-20 lg:py-28">
        <div className="max-w-xl">
          <Eyebrow>About us</Eyebrow>

          <h1 id="about-heading" className="mt-6 text-4xl md:text-[3.25rem]">
            A full-service agency that likes to move fast and pop loud.
          </h1>

          <p className="mt-6 text-lg">
            Founded on one idea: brands shouldn&apos;t have to juggle five vendors for one campaign.
            We build the strategy, shoot the film, book the influencers and run the event —
            ourselves.
          </p>
        </div>

        <StatList stats={agencyStats} variant="cards" className="mt-16" />
      </Container>
    </section>
  );
}
```

Same structure as the home hero, different content and a different stat treatment. The `StatList` variant prop is why there is no second stats component.

## 4.2 Approach band

**File:** `src/features/marketing/components/ApproachBand.tsx`

```tsx
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ApproachBand() {
  return (
    <Section tone="grape" slice="both" labelledBy="approach-heading">
      <SectionHeading
        id="approach-heading"
        tone="dark"
        eyebrow="Our approach"
        title="Strategy, production and placement — never handed off between agencies."
        lead="Every brief moves through the same team from first sketch to final metric, so ideas keep their shape from deck to delivery."
      />
    </Section>
  );
}
```

## 4.3 Process steps

**File:** `src/features/marketing/components/ProcessSteps.tsx`

```tsx
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/features/marketing/data/process";

export function ProcessSteps() {
  return (
    <Section labelledBy="process-heading">
      <SectionHeading id="process-heading" eyebrow="How we work" title="From brief to buzz." />

      {/* An ordered list, because these steps genuinely are a sequence.
          The visible number badge is decorative — <ol> already conveys order
          to assistive technology, so announcing "1" twice would be noise. */}
      <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <li
            key={step.id}
            className="rounded-card border border-dashed border-ink/15 bg-paper/60 p-6"
          >
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-pill bg-pop text-sm font-medium text-white"
            >
              {index + 1}
            </span>
            <h3 className="mt-6 text-base">{step.title}</h3>
            <p className="mt-3 text-sm">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

This is the one place in the design where numbered markers are correct: the content really is a sequence. Do not copy this pattern onto the services grid, which is a set, not a sequence.

## 4.4 Compose the page

**File:** `src/app/about/page.tsx`

```tsx
import { AboutHero } from "@/features/marketing/components/AboutHero";
import { ApproachBand } from "@/features/marketing/components/ApproachBand";
import { CtaBand } from "@/features/marketing/components/CtaBand";
import { ProcessSteps } from "@/features/marketing/components/ProcessSteps";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "A full-service creative and marketing agency in New Delhi. Strategy, production and placement handled by one team.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <ApproachBand />
      <ProcessSteps />
      <CtaBand headingId="about-cta-heading" title="Like how we work? Let's start yours." />
    </>
  );
}
```

**Acceptance**
- [ ] Matches Figma at all breakpoints
- [ ] Exactly one `<h1>`, no skipped levels
- [ ] Process renders as `<ol>` with four `<li>`
- [ ] CTA heading id differs from the home page's
- [ ] Browser tab reads "About — Popcorn Advertising"

**Commit:** `feat(about): add about page`

---
---

# Phase 5 — Work section

**Goal of the phase:** a listing page and detail pages, built so that swapping the hardcoded array for a CMS later touches exactly one file.

---

## 5.1 The schema

**Goal:** one definition of what a case study is.

**File:** `src/features/work/schema.ts`

```ts
import { z } from "zod";

export const caseStudySchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, alphanumeric and hyphenated"),
  title: z.string().min(1),
  client: z.string().min(1),
  /** One-line summary used on cards and in metadata. */
  summary: z.string().min(1).max(180),
  services: z.array(z.string()).min(1),
  year: z.number().int().min(2015),
  cover: z.object({
    src: z.string().startsWith("/"),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  /** Long-form body, rendered on the detail page. */
  body: z.array(z.string()).min(1),
  results: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;
```

The type is inferred, never written by hand. When the schema changes, every consumer breaks at compile time — which is what you want.

Note `cover.alt` is required and `.min(1)`. Making alt text non-optional at the type level means nobody can ship an inaccessible image by forgetting a prop.

---

## 5.2 The data

**File:** `src/features/work/data.ts`

```ts
import type { CaseStudy } from "./schema";

/**
 * Hardcoded case studies.
 *
 * This is the ONLY file that changes when a CMS is introduced —
 * everything else goes through the repository.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "example-launch-film",
    title: "A launch film that outlived the launch",
    client: "[CLIENT] Brand name",
    summary: "A 60-second brand film plus a creator push that carried the campaign past week one.",
    services: ["Digital Ad Films", "Influencer Marketing"],
    year: 2025,
    cover: {
      src: "/images/work/example-cover.jpg",
      alt: "Still frame from the launch film showing the product on a market stall",
      width: 1200,
      height: 800,
    },
    body: [
      "[CLIENT] Replace with the real brief.",
      "[CLIENT] Replace with what the team did.",
      "[CLIENT] Replace with the outcome.",
    ],
    results: [
      { value: "2.4M", label: "Views in week one" },
      { value: "89", label: "Creators activated" },
    ],
  },
];
```

---

## 5.3 The repository

**Goal:** the single door through which components get case-study data.

**File:** `src/features/work/repository.ts`

```ts
import { caseStudies } from "./data";
import { caseStudySchema, type CaseStudy } from "./schema";

/**
 * Data access for case studies.
 *
 * Today these read from a local array. When a database or CMS arrives,
 * only the bodies of these functions change — every caller keeps working,
 * because they already treat the calls as async.
 */

/** All case studies, newest first. */
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return [...caseStudies].sort((a, b) => b.year - a.year);
}

/** A single case study, or null if the slug doesn't exist. */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const match = caseStudies.find((study) => study.slug === slug);
  return match ?? null;
}

/** Slugs for generateStaticParams. */
export async function getAllCaseStudySlugs(): Promise<string[]> {
  return caseStudies.map((study) => study.slug);
}

/**
 * Validates every entry against the schema. Run in a test or at build time
 * so malformed content fails the build rather than the page.
 */
export function assertCaseStudiesAreValid(): void {
  for (const study of caseStudies) {
    caseStudySchema.parse(study);
  }
}
```

**The functions are `async` even though nothing awaits.** This is deliberate. If they were synchronous now, every call site would need rewriting the day the data moves behind a network call. Making them async today costs nothing and makes that migration a no-op.

**Acceptance**
- [ ] No component imports `data.ts` directly
- [ ] `assertCaseStudiesAreValid()` runs clean

**Commit:** `feat(work): add case study schema, data and repository`

---

## 5.4 Case study card

**File:** `src/features/work/components/CaseStudyCard.tsx`

```tsx
import Image from "next/image";
import Link from "next/link";

import type { CaseStudy } from "../schema";

interface CaseStudyCardProps {
  study: CaseStudy;
}

export function CaseStudyCard({ study }: CaseStudyCardProps) {
  return (
    <article className="group overflow-hidden rounded-card bg-paper">
      <div className="aspect-[3/2] overflow-hidden bg-grape-tint">
        <Image
          src={study.cover.src}
          alt={study.cover.alt}
          width={study.cover.width}
          height={study.cover.height}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-grape">
          {study.client} · {study.year}
        </p>

        <h3 className="mt-3 text-xl">
          {/* The link covers the whole card via the ::after overlay, so the
              accessible name stays the title rather than "read more". */}
          <Link href={`/work/${study.slug}`} className="after:absolute after:inset-0">
            {study.title}
          </Link>
        </h3>

        <p className="mt-3 text-sm">{study.summary}</p>
      </div>
    </article>
  );
}
```

The card must have `relative` applied by its parent grid item for the `::after` overlay to work. Add `className="relative"` on the `<li>` in the grid.

This "card link" pattern is the accessible one: exactly one link per card, its accessible name is the case study title, and the whole card is clickable. The common alternative — wrapping the entire card in an `<a>` — makes the accessible name the concatenation of every string in the card.

---

## 5.5 Work listing and detail routes

**File:** `src/app/work/page.tsx`

```tsx
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CaseStudyCard } from "@/features/work/components/CaseStudyCard";
import { getAllCaseStudies } from "@/features/work/repository";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Campaigns, films and activations from the Popcorn Advertising team.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const studies = await getAllCaseStudies();

  return (
    <Section labelledBy="work-heading">
      <SectionHeading
        id="work-heading"
        as="h1"
        eyebrow="Selected work"
        title="Campaigns that earned their attention."
      />

      {studies.length === 0 ? (
        <p className="mt-14 text-lg">New work is going up shortly. Check back soon.</p>
      ) : (
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <li key={study.slug} className="relative">
              <CaseStudyCard study={study} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
```

The empty state is not optional. A grid that renders nothing looks broken; a sentence looks intentional.

**File:** `src/app/work/[slug]/page.tsx`

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { StatList } from "@/components/ui/StatList";
import { CtaBand } from "@/features/marketing/components/CtaBand";
import { getAllCaseStudySlugs, getCaseStudyBySlug } from "@/features/work/repository";

import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-renders every case study at build time. */
export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) return { title: "Not found" };

  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      title: study.title,
      description: study.summary,
      images: [{ url: study.cover.src, width: study.cover.width, height: study.cover.height }],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) notFound();

  return (
    <>
      <article>
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.12em] text-grape">
            {study.client} · {study.year}
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl">{study.title}</h1>

          <p className="mt-6 max-w-2xl text-lg">{study.summary}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {study.services.map((service) => (
              <li
                key={service}
                className="rounded-pill bg-grape-tint px-3 py-1 text-xs text-grape"
              >
                {service}
              </li>
            ))}
          </ul>

          <Image
            src={study.cover.src}
            alt={study.cover.alt}
            width={study.cover.width}
            height={study.cover.height}
            priority
            className="mt-12 w-full rounded-card object-cover"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />

          <div className="mt-12 max-w-2xl space-y-5 text-lg">
            {study.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          {study.results ? (
            <>
              <h2 className="mt-16 text-2xl">Results</h2>
              <StatList stats={study.results} variant="cards" className="mt-6" />
            </>
          ) : null}
        </Container>
      </article>

      <CtaBand headingId="work-cta-heading" title="Want something like this?" />
    </>
  );
}
```

In Next.js 16, `params` is a Promise and must be awaited. Note also `priority` on the cover image — it is the LCP element on this route.

**Acceptance**
- [ ] `/work` lists all case studies, empty state works when the array is emptied
- [ ] `/work/[slug]` renders for every slug
- [ ] An unknown slug returns the 404 page, not a crash
- [ ] `pnpm build` shows every case study route as statically generated
- [ ] Each detail page has its own title, description and OG image
- [ ] Card links have the case study title as their accessible name

**Commit:** `feat(work): add listing and detail routes`

---
---

# Phase 6 — Contact form

**Goal of the phase:** a working, validated, spam-resistant contact form that emails the client. No database.

---

## 6.1 Environment validation

**Goal:** a missing key fails at boot with a clear message, not silently at 2am when someone submits the form.

```bash
pnpm add resend
```

**File:** `src/lib/env.ts`

```ts
import "server-only";

import { z } from "zod";

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  CONTACT_TO_EMAIL: z.string().email(),
  CONTACT_FROM_EMAIL: z.string().email(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid environment variables:\n${issues.join("\n")}`);
}

export const env = parsed.data;
```

`import "server-only"` makes the build fail loudly if this file is ever imported into a Client Component, which would leak the API key into the browser bundle.

---

## 6.2 The contact schema

**File:** `src/features/contact/schema.ts`

```ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  company: z.string().trim().min(1, "Enter your brand or company").max(120),
  message: z.string().trim().min(10, "Tell us a little more").max(2000),
  /** Honeypot. Real users never see it, so it must stay empty. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<keyof ContactInput, string>> };
```

One schema, used three times: by the client for instant feedback, by the Server Action for real validation, and as the source of the TypeScript type. Client validation is a convenience; server validation is the one that counts, because a request can arrive without ever touching the form.

---

## 6.3 The Server Action

**File:** `src/features/contact/actions.ts`

```ts
"use server";

import { Resend } from "resend";

import { env } from "@/lib/env";
import { siteConfig } from "@/lib/siteConfig";

import { contactSchema, type ContactInput, type ContactResult } from "./schema";

const resend = new Resend(env.RESEND_API_KEY);

/**
 * Validates and emails a contact enquiry.
 *
 * Nothing is persisted. When storage is needed later, add the write here —
 * no caller changes.
 */
export async function submitContact(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ContactInput | undefined;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { status: "error", message: "Check the highlighted fields.", fieldErrors };
  }

  const { name, email, company, message, website } = parsed.data;

  // Honeypot: a bot filled the hidden field. Return success so it learns nothing.
  if (website) return { status: "success" };

  try {
    const { error } = await resend.emails.send({
      from: `${siteConfig.name} <${env.CONTACT_FROM_EMAIL}>`,
      to: env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New enquiry from ${company}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company}`,
        "",
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        status: "error",
        message: `Something went wrong sending your message. Email us at ${siteConfig.contact.email} instead.`,
      };
    }

    return { status: "success" };
  } catch (cause) {
    console.error("Contact action failed:", cause);
    return {
      status: "error",
      message: `Something went wrong sending your message. Email us at ${siteConfig.contact.email} instead.`,
    };
  }
}
```

Three things to notice:

- `replyTo` is the sender's address, so the client can hit Reply and reach them directly.
- The honeypot returns `success`, not an error. Telling a bot it was detected just teaches its operator to fix it.
- The error message tells the user what to do next. An error that says "Something went wrong" and stops is a dead end.

---

## 6.4 The form component

```bash
pnpm add react-hook-form @hookform/resolvers
```

**File:** `src/features/contact/components/ContactForm.tsx`

```tsx
"use client";

import { useId, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";

import { submitContact } from "../actions";
import { contactSchema, type ContactInput } from "../schema";

export function ContactForm() {
  const formId = useId();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerMessage(null);
    const result = await submitContact(values);

    if (result.status === "success") {
      setIsDone(true);
      reset();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof ContactInput, { message });
      }
    }
    setServerMessage(result.message);
  });

  if (isDone) {
    return (
      <div className="rounded-card bg-paper p-8" role="status">
        <h2 className="text-2xl">Message sent.</h2>
        <p className="mt-3">We&apos;ll get back to you within a day.</p>
        <Button className="mt-6" onClick={() => setIsDone(false)}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-card bg-paper p-8">
      <Field
        id={`${formId}-name`}
        label="Name"
        placeholder="Your name"
        error={errors.name?.message}
        {...register("name")}
      />
      <Field
        id={`${formId}-email`}
        label="Email"
        type="email"
        placeholder="you@company.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Field
        id={`${formId}-company`}
        label="Brand / company"
        placeholder="Company name"
        error={errors.company?.message}
        {...register("company")}
      />
      <Field
        id={`${formId}-message`}
        label="What do you need?"
        placeholder="Tell us a bit about the project"
        multiline
        error={errors.message?.message}
        {...register("message")}
      />

      {/* Honeypot — hidden from people, visible to bots. Not display:none,
          which some bots detect and skip. */}
      <div aria-hidden="true" className="absolute left-[-9999px] size-px overflow-hidden">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input id={`${formId}-website`} tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-8 w-full">
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>

      {serverMessage ? (
        <p role="alert" className="mt-4 text-sm text-pop">
          {serverMessage}
        </p>
      ) : null}
    </form>
  );
}

interface FieldProps extends React.ComponentPropsWithoutRef<"input"> {
  id: string;
  label: string;
  error?: string;
  multiline?: boolean;
}

/** A labelled input with inline error messaging wired for screen readers. */
function Field({ id, label, error, multiline, className: _className, ...props }: FieldProps) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className:
      "mt-2 w-full rounded-xl border border-transparent bg-cream-deep px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-grape",
  };

  return (
    <div className="mt-6 first:mt-0">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-[0.12em] text-ink">
        {label}
      </label>

      {multiline ? (
        <textarea
          rows={5}
          {...shared}
          {...(props as unknown as React.ComponentPropsWithoutRef<"textarea">)}
        />
      ) : (
        <input {...shared} {...props} />
      )}

      {error ? (
        <p id={errorId} className="mt-2 text-sm text-pop">
          {error}
        </p>
      ) : null}
    </div>
  );
}
```

Accessibility details that matter here:

| Detail | Why |
|---|---|
| Real `<label htmlFor>` | Placeholders vanish on focus and are not announced reliably |
| `aria-invalid` + `aria-describedby` | Links the error text to the field for screen readers |
| `role="alert"` on the server error | Announced immediately without moving focus |
| `role="status"` on success | Announced politely after the form is replaced |
| `noValidate` | Suppresses browser bubbles so your styled messages are the only ones |
| Honeypot off-screen, not `display:none` | Sophisticated bots skip `display:none` fields |

---

## 6.5 Contact page

**File:** `src/features/contact/components/ContactInfo.tsx`

```tsx
import { Mail, MapPin, Phone } from "lucide-react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/lib/siteConfig";

export function ContactInfo() {
  return (
    <div>
      <Eyebrow>Get in touch</Eyebrow>

      <h1 id="contact-heading" className="mt-6 text-4xl">
        Got a brand that needs to pop?
      </h1>

      <p className="mt-6 max-w-md text-lg">
        Tell us what you&apos;re building — a launch film, an influencer push, a full campaign — and
        we&apos;ll get back to you within a day.
      </p>

      <address className="mt-10 space-y-5 not-italic">
        <ContactRow icon={<Mail className="size-4" aria-hidden="true" />}>
          <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-pop">
            {siteConfig.contact.email}
          </a>
        </ContactRow>
        <ContactRow icon={<Phone className="size-4" aria-hidden="true" />}>
          <a href={`tel:${siteConfig.contact.phoneHref}`} className="hover:text-pop">
            {siteConfig.contact.phone}
          </a>
        </ContactRow>
        <ContactRow icon={<MapPin className="size-4" aria-hidden="true" />}>
          {siteConfig.contact.location}
        </ContactRow>
      </address>
    </div>
  );
}

function ContactRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-pill bg-grape-tint text-grape">
        {icon}
      </span>
      {children}
    </p>
  );
}
```

**File:** `src/app/contact/page.tsx`

```tsx
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/features/contact/components/ContactForm";
import { ContactInfo } from "@/features/contact/components/ContactInfo";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Popcorn Advertising. Tell us about your brand and we'll reply within a day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section aria-labelledby="contact-heading" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-2/5 bg-grape lg:block [clip-path:polygon(20%_0,100%_0,100%_100%,0_100%)]"
      />
      <Container className="relative grid items-start gap-14 py-20 lg:grid-cols-2 lg:py-28">
        <ContactInfo />
        <ContactForm />
      </Container>
    </section>
  );
}
```

The page itself is a Server Component. Only `ContactForm` ships JavaScript — which is the entire point of pushing `"use client"` as far down the tree as possible.

**Acceptance**
- [ ] Submitting empty shows inline errors, focus stays in the form
- [ ] An invalid email is caught before submission
- [ ] A valid submission arrives in the inbox with a working Reply-To
- [ ] Success state replaces the form and is announced
- [ ] Filling the honeypot returns success and sends nothing
- [ ] Submit is disabled while sending and the label changes
- [ ] Killing the network shows the fallback message with the email address
- [ ] `RESEND_API_KEY` never appears in the client bundle (`pnpm build` then grep `.next/static`)

**Commit:** `feat(contact): add validated contact form`

---
---

# Phase 7 — SEO and metadata

**Goal of the phase:** every route is discoverable, shareable and correctly described.

---

## 7.1 Per-route metadata

Every `page.tsx` exports `metadata` (or `generateMetadata` for dynamic routes). The root layout supplies the template, so page titles are short.

| Route | Title | Canonical |
|---|---|---|
| `/` | Falls back to the default | `/` |
| `/about` | About | `/about` |
| `/work` | Work | `/work` |
| `/work/[slug]` | Case study title | `/work/[slug]` |
| `/contact` | Contact | `/contact` |

**File:** `src/app/page.tsx` — add above the component:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};
```

The home page inherits its title and description from the layout, so it only needs the canonical.

---

## 7.2 Sitemap and robots

**File:** `src/app/sitemap.ts`

```ts
import { getAllCaseStudySlugs } from "@/features/work/repository";
import { siteConfig } from "@/lib/siteConfig";

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/work", "/contact"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const slugs = await getAllCaseStudySlugs();
  const workRoutes = slugs.map((slug) => ({
    url: `${siteConfig.url}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...workRoutes];
}
```

**File:** `src/app/robots.ts`

```ts
import { siteConfig } from "@/lib/siteConfig";

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/dev"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
```

---

## 7.3 Open Graph image

**File:** `src/app/opengraph-image.tsx`

```tsx
import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/siteConfig";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#faf0dc",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 28, color: "#453079", letterSpacing: 2 }}>
          FULL-SERVICE CREATIVE &amp; MARKETING AGENCY
        </div>
        <div style={{ fontSize: 84, color: "#2e2233", marginTop: 24, lineHeight: 1.1 }}>
          Ideas that pop.
        </div>
        <div style={{ fontSize: 84, color: "#c9184a", lineHeight: 1.1 }}>Results that stay.</div>
      </div>
    ),
    size,
  );
}
```

---

## 7.4 Structured data

**Goal:** the agency appears correctly in search results and knowledge panels.

Add to `src/app/layout.tsx`, inside `<body>`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "New Delhi",
        addressCountry: "IN",
      },
      sameAs: siteConfig.social.map((item) => item.href),
    }),
  }}
/>
```

This is the one acceptable use of `dangerouslySetInnerHTML` in the project: the content is generated from your own typed config, not from user input.

---

## 7.5 404 page

**File:** `src/app/not-found.tsx`

```tsx
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-6xl text-pop">404</p>
      <h1 className="mt-6 text-3xl">This one didn&apos;t pop.</h1>
      <p className="mt-4 max-w-sm">
        The page you&apos;re after has moved or never existed. Try the work, or tell us what you
        were looking for.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">Back home</Button>
        <Button href="/contact" variant="outline">
          Contact us
        </Button>
      </div>
    </Container>
  );
}
```

An empty screen is an invitation to act, not a dead end. Two exits, in the brand's voice.

**Acceptance**
- [ ] `/sitemap.xml` lists every route including case studies
- [ ] `/robots.txt` points at the sitemap and blocks `/dev`
- [ ] `/opengraph-image` renders
- [ ] Pasting the URL into Slack or WhatsApp shows a correct card
- [ ] JSON-LD validates in Google's Rich Results Test
- [ ] A bad URL shows the branded 404 with a 404 status code

**Commit:** `feat(seo): add metadata, sitemap, og image and 404`

---
---

# Phase 8 — Accessibility and performance

**Goal of the phase:** the quality floor is verified, not assumed.

---

## 8.1 Automated checks

```bash
pnpm add -D @axe-core/cli
pnpm build && pnpm start
npx @axe-core/cli http://localhost:3000 http://localhost:3000/about http://localhost:3000/work http://localhost:3000/contact
```

Fix every violation. There should be none if the previous phases were followed.

Then Lighthouse, in an incognito window, mobile preset, on the production build:

| Metric | Target |
|---|---|
| Performance | ≥ 95 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| LCP | < 2.0s |
| CLS | < 0.05 |
| Total JS | < 120 kB gzipped |

If JS is over budget, the usual culprit is a `"use client"` sitting too high in the tree. Check with:

```bash
pnpm build
# Look at the "First Load JS" column per route
```

---

## 8.2 Manual accessibility pass

Work through this on every route. Automated tools catch roughly a third of real issues.

### 8.2.1 Keyboard

- [ ] Tab from the top: skip link fires first
- [ ] Every link, button and field is reachable
- [ ] Focus ring is visible on every one of them, including on coloured backgrounds
- [ ] Focus order matches visual order
- [ ] Mobile menu: opens with Enter, closes with Escape, focus doesn't escape behind it
- [ ] No element is reachable that shouldn't be (the honeypot has `tabIndex={-1}`)

### 8.2.2 Screen reader

Test with VoiceOver (Cmd+F5 on macOS) or NVDA on Windows.

- [ ] Heading list (VO: Cmd+U) shows one h1 and a sensible outline per page
- [ ] Landmark list shows banner, main, contentinfo
- [ ] The marquee is not announced at all
- [ ] Nav announces the current page
- [ ] Form errors are announced when they appear
- [ ] Case study card links announce the title, not a wall of text
- [ ] Social icons announce as "Popcorn Advertising on Instagram", not "link"

### 8.2.3 Visual

- [ ] Zoom to 200%: no horizontal scroll, no clipped text
- [ ] Reduced motion enabled: marquee is static, smooth scroll is instant
- [ ] Contrast check every pair: pink on cream, cream on purple, ink on butter, cream/70 on ink
- [ ] Test at 320px width — the narrowest device still in use

---

## 8.3 Performance work

| Item | Action |
|---|---|
| Images | Every `next/image` has explicit `width`/`height` and a `sizes` prop. Above-the-fold images get `priority` |
| Fonts | `preload: true`, subset to Latin if the files are large |
| Icons | `lucide-react` tree-shakes on named imports — never `import * as Icons` |
| Client bundle | Audit each `"use client"` file and push the directive lower where possible |
| Static generation | `pnpm build` should mark every route as static (`○`) or SSG (`●`), never dynamic (`ƒ`) |

**Commit:** `perf: image sizing and bundle audit`

---

## 8.4 Cross-browser and device

| Browser | Priority |
|---|---|
| Chrome desktop + Android | Must pass |
| Safari desktop + iOS | Must pass — check `clip-path` and `backdrop-blur` |
| Firefox | Must pass |
| Edge | Spot-check |

The diagonal `clip-path` sections and the sticky blurred header are the two things most likely to differ. Test them on a real iPhone, not the simulator.

### Phase 8 exit criteria

- [ ] Zero axe violations across all routes
- [ ] Lighthouse targets met on mobile
- [ ] Full manual checklist ticked
- [ ] Verified on real iOS and Android devices

---
---

# Phase 9 — Deployment

---

## 9.1 Resend setup

1. Create a Resend account.
2. Add and verify the client's sending domain (DNS records: SPF, DKIM). [CLIENT] needs DNS access.
3. Generate an API key with send-only permission.
4. `CONTACT_FROM_EMAIL` must be on the verified domain. `CONTACT_TO_EMAIL` can be anything.

Do not skip domain verification and send from a shared testing domain — those messages land in spam.

---

## 9.2 Vercel

| Setting | Value |
|---|---|
| Framework preset | Next.js |
| Build command | `pnpm build` |
| Install command | `pnpm install --frozen-lockfile` |
| Node version | 22.x |

Environment variables — set for **all three** environments (Production, Preview, Development):

| Key | Notes |
|---|---|
| `RESEND_API_KEY` | Secret |
| `CONTACT_TO_EMAIL` | Consider a test inbox for Preview |
| `CONTACT_FROM_EMAIL` | Must be on the verified domain |
| `NEXT_PUBLIC_SITE_URL` | Production domain, no trailing slash |

A common trap: forgetting to set these for Preview means every PR deploy has a broken contact form and nobody notices until launch.

---

## 9.3 Domain and DNS

- [ ] Add the custom domain in Vercel
- [ ] Point DNS at Vercel
- [ ] `www` redirects to apex (or the reverse — pick one and be consistent)
- [ ] HTTPS certificate issued
- [ ] `NEXT_PUBLIC_SITE_URL` updated to the live domain and redeployed

---

## 9.4 Launch checklist

Run through this on the production URL, not a preview.

**Content**
- [ ] Real phone number replaces `+91 00000 00000`
- [ ] Every `[CLIENT]` marker resolved
- [ ] Every `[FIGMA]` value confirmed
- [ ] No lorem ipsum, no placeholder images
- [ ] Careers link points somewhere real or is removed

**Function**
- [ ] Every nav link works from every page
- [ ] Services link scrolls correctly from home and from other pages
- [ ] Contact form delivers to the client's real inbox
- [ ] All social links open the correct profiles in a new tab

**Technical**
- [ ] `/dev` returns 404
- [ ] `/sitemap.xml` and `/robots.txt` resolve
- [ ] OG preview correct in Slack, WhatsApp and LinkedIn
- [ ] Favicon and app icons present
- [ ] Analytics recording page views
- [ ] Lighthouse re-run on the live domain

**Handover**
- [ ] Client has Vercel access
- [ ] Client has Resend access
- [ ] Repo access transferred or the client is added
- [ ] README explains how to add a case study

**Commit:** `chore: production launch`

---
---

# Phase 10 — Handoff and future-proofing

**Goal of the phase:** the next developer — possibly you in eight months — can extend this without archaeology.

---

## 10.1 README

**File:** `README.md`

Cover, in this order:

1. What the project is, one paragraph.
2. Stack list with versions.
3. Local setup: clone, `pnpm install`, copy `.env.example`, `pnpm dev`.
4. Scripts table.
5. Folder structure with a one-line purpose for each top-level folder.
6. The conventions section from this document.
7. **How to add a case study** — a numbered walkthrough of editing `features/work/data.ts`, adding an image to `public/images/work/`, and pushing.
8. **How to change site-wide content** — point at `lib/siteConfig.ts`.
9. Deployment notes and required environment variables.

---

## 10.2 The extension points

Document these explicitly so nobody rebuilds them by accident.

| Want to… | Change this file | Nothing else changes |
|---|---|---|
| Add a service | `features/marketing/data/services.ts` | Grid and marquee update together |
| Change a phone number or nav label | `lib/siteConfig.ts` | Header, footer, contact page |
| Add a case study | `features/work/data.ts` | Listing, detail route, sitemap |
| Change a brand colour | `styles/globals.css` `@theme` | Whole site |
| Send the form somewhere else | `features/contact/actions.ts` | Form component untouched |

---

## 10.3 Path to a backend

The current architecture is a modular monolith with no persistence. When a backend becomes necessary, this is the order of operations — and the point of the discipline in earlier phases.

### Step 1 — Add a database, stay in the same app

```bash
pnpm add prisma @prisma/client
pnpm dlx prisma init
```

- Model `CaseStudy` in `prisma/schema.prisma`, mirroring `features/work/schema.ts`.
- Add `src/server/db.ts` with the Prisma client singleton.
- Rewrite the **bodies** of the three functions in `features/work/repository.ts` to query Prisma.
- **Zero component changes.** They already call async repository functions.

### Step 2 — Add authentication and an admin area

- `app/(marketing)/` and `app/(admin)/` route groups, each with its own layout.
- Auth.js in `src/server/auth.ts`.
- Server Actions for admin mutations; `app/api/` only for external webhooks.

### Step 3 — Only if a second consumer appears

A mobile app, a partner integration, or a non-JavaScript team. Not "the backend got complicated" — that is what modules are for.

```
popcorn/
├─ apps/web/          # this app, largely unchanged
├─ apps/api/          # extracted service
└─ packages/
   ├─ contracts/      # the zod schemas, moved verbatim
   ├─ db/
   └─ config/
```

Because every schema already lives in a `schema.ts` beside its feature, `packages/contracts` is a move, not a rewrite. That is the entire payoff.

---

## 10.4 What "done" looks like

The project is finished when all of the following are true:

- [ ] `pnpm verify` passes from a clean clone
- [ ] Zero TypeScript errors, zero ESLint warnings
- [ ] Zero `any`, zero `@ts-ignore`
- [ ] Zero hex codes outside `globals.css`
- [ ] Zero hardcoded content strings outside `data/` and `siteConfig.ts`
- [ ] Every route static in the build output
- [ ] Lighthouse ≥ 95 mobile across the board
- [ ] Zero axe violations
- [ ] Full keyboard and screen reader pass
- [ ] README lets a new developer ship a change in under thirty minutes

---

## Appendix A — Command reference

```bash
pnpm dev              # development server
pnpm build            # production build
pnpm start            # serve the production build locally
pnpm typecheck        # tsc --noEmit
pnpm lint             # eslint
pnpm format           # prettier --write
pnpm verify           # everything above, in CI order
```

## Appendix B — Dependencies

| Package | Why it's here |
|---|---|
| `next`, `react`, `react-dom` | Framework |
| `tailwindcss`, `@tailwindcss/postcss` | Styling |
| `lucide-react` | Icons |
| `clsx`, `tailwind-merge` | The `cn` helper |
| `zod` | Validation and type inference |
| `react-hook-form`, `@hookform/resolvers` | Contact form state |
| `resend` | Contact form delivery |
| `server-only` | Guards server modules against client import |

Nine runtime dependencies. Four exist solely for the contact form. If a tenth is proposed, it needs a written reason.

## Appendix C — Deliberate omissions

| Not used | Reason |
|---|---|
| Component library (shadcn, MUI) | Strong custom design; six primitives beat fighting a kit's defaults |
| Animation library | The design calls for no scroll choreography. Revisit only if the client asks |
| State manager | No shared client state exists |
| Data fetching library | No client-side fetching exists |
| CMS | No editor workflow requested. `data.ts` plus the repository makes it a one-file change later |
| Database | Nothing is persisted |
| Monorepo tooling | One deployable unit |

Each of these is a decision, not an oversight. Revisit them when the trigger in the right-hand column actually occurs.
