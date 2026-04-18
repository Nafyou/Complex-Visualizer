# Next.js 16 — How we use it

Research notes + a narrow, opinionated subset we actually rely on.

---

## What Next.js 16 is (April 2026)

Next.js 16 is the current major (16.2.4 as of writing). It ships:

- **App Router** as the only recommended router. (Pages Router still
  exists; we don't use it.)
- **React 19** built in for App Router.
- **Turbopack** as the default dev and production bundler. Webpack is
  opt-in via `--webpack`.
- **Server Components** by default. Any file in `app/` is a Server
  Component unless you write `"use client"` at the top.
- **Built-in file-system routing**, layouts, loading states, error
  boundaries, and metadata.
- Minimum Node.js **20.9**.

`create-next-app@latest` now ships sensible defaults that match almost
exactly what we want: TypeScript, Tailwind, ESLint, App Router, `@/*`
import alias.

---

## Our project layout

```
app/
  layout.tsx        Root layout — fonts, body, <JourneyProvider>
  page.tsx          / (landing)
  learn/
    page.tsx        /learn (atlas index)
    [slug]/page.tsx /learn/bfs, /learn/dfs, ...
  journey/
    page.tsx        /journey
  playground/
    page.tsx        /playground
  globals.css       Tailwind import + @theme + base styles
```

This is the entire surface area of routing for v0/v1.

---

## Server vs. client components — the rule we follow

The visual parts of this app are heavily interactive: Excalidraw,
scrubbing, keyboard shortcuts, localStorage. These must be client
components.

The structural parts — the landing page, the atlas index, the outer shell
of an algorithm page — are better as server components. They render once,
ship less JS, and let the client components be smaller islands.

Our rule:

- **Pages (`page.tsx`) stay server components** by default. They arrange
  the layout and delegate interactivity to client children.
- **Canvas, player, and anything touching `window`/`localStorage`** lives
  in a `"use client"` file, named with a `Client` suffix or placed under
  `components/`.
- We never put `"use client"` at the top of a page that could be a
  server component. Keeping the island small is the whole point.

Example:

```tsx
// app/learn/bfs/page.tsx  — server component
import { AlgorithmShell } from "@/components/AlgorithmShell";
import { BFSRunner } from "@/components/algorithms/BFSRunner";
import { bfsLesson } from "@/lib/lessons/bfs";

export default function Page() {
  return (
    <AlgorithmShell lesson={bfsLesson}>
      <BFSRunner />  {/* this is "use client" */}
    </AlgorithmShell>
  );
}
```

---

## Dynamic import for SSR-hostile components

Excalidraw reaches for `window` at module load time. It cannot render on
the server. We use `next/dynamic` with `ssr: false`:

```tsx
"use client";
import dynamic from "next/dynamic";

export const GraphCanvas = dynamic(
  () => import("./GraphCanvas.client").then((m) => m.GraphCanvas),
  { ssr: false, loading: () => <CanvasSkeleton /> }
);
```

`next/dynamic` with `ssr: false` *must* be called from a client component
in App Router. That's why we keep a thin `"use client"` wrapper that does
the dynamic import, not a server component.

---

## Fonts

Next 16's `next/font/google` is our friend. Self-hosts the fonts, zero
layout shift, no request to Google at runtime. We set them up once in
`app/layout.tsx` and expose them as CSS variables so Tailwind (v4) can
pick them up via `@theme`.

```tsx
// app/layout.tsx
import { Fraunces, Source_Serif_4, JetBrains_Mono, Caveat } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSerif.variable} ${jetBrainsMono.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

Then in `globals.css` under `@theme`:

```css
@theme {
  --font-display: var(--font-display);
  --font-sans: var(--font-body);
  --font-mono: var(--font-mono);
  --font-hand: var(--font-hand);
}
```

Now `font-display`, `font-sans`, `font-mono`, `font-hand` work as Tailwind
utilities.

---

## Metadata

Per-page metadata is declared via the exported `metadata` object. We use
it on the landing page and every algorithm page.

```tsx
export const metadata = {
  title: "The Atlas — Breadth-first search",
  description: "A wave spreading out from where you start.",
};
```

For shareable OG images we'll use `opengraph-image.tsx` later (v1). Not a
v0 concern.

---

## Turbopack

Turbopack is default. There's nothing we need to configure. `next dev`
runs it, `next build` runs it. If we ever hit a Turbopack incompatibility
we'll drop back to `next dev --webpack` — but Excalidraw and Tailwind v4
both work fine on Turbopack as of 16.2.

---

## Deployment

Vercel is the target. No custom deploy scripts.

```
git push origin main
```

Vercel auto-detects Next.js and deploys. We do not commit `.vercel/`.
Environment variables (none for v0) go through the Vercel dashboard.

One deployment note: Excalidraw's first load is heavy. We load it via
`next/dynamic` (see above) and show a `CanvasSkeleton` that matches the
parchment aesthetic, so the user never sees a blank space. The skeleton is
not a spinner — it's a stippled parchment rectangle with a caveat-font
"drawing…" in the corner.

---

## What we do *not* use

To keep the surface small and the mental model clear:

- **No Pages Router.** App Router only.
- **No `getServerSideProps` / `getStaticProps`.** Those are Pages Router.
  We use server components + `fetch` with appropriate caching hints
  instead (and mostly we have no data-fetching in v0).
- **No middleware.** No auth, no edge logic in v0.
- **No API routes.** Algorithms run entirely in the browser. The user's
  journey is stored in `localStorage`.
- **No `app/api/`.** Same reason.

v0 is a static-feeling, client-heavy, zero-backend experience. That's
intentional.
