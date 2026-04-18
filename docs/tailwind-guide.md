# Tailwind CSS v4 — How we use it

Research notes + the subset we use. Tailwind v4 is a major shift from v3:
**no `tailwind.config.js`**. Configuration is now CSS-first via `@theme`.

---

## What v4 is (spring 2026)

- Configuration lives in CSS, not JS. The `@theme` directive defines
  design tokens that Tailwind converts into utilities.
- Installation is a one-line PostCSS plugin.
- The JIT engine is the default and only engine. Faster builds.
- Arbitrary values continue to work (`bg-[#C67A36]`).
- All our tokens become CSS variables on `:root`, usable from raw CSS.

The whole setup, for Next.js 16:

**`postcss.config.mjs`**
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**`app/globals.css`**
```css
@import "tailwindcss";

@theme {
  /* design tokens live here */
}
```

That's it. No `tailwind.config.*`. No `content` globs — v4 auto-detects.

---

## Our `@theme` tokens

Below is the *exact* theme we commit, mirroring
[docs/design-philosophy.md](design-philosophy.md).

```css
@theme {
  /* ── colors ─────────────────────────────────────────────── */
  --color-parchment: #F4ECDC;
  --color-parchment-deep: #E8DCC4;
  --color-parchment-edge: #D9C9A7;
  --color-ink: #1F1B1A;
  --color-ink-soft: #3D3733;
  --color-ink-quiet: #78706A;

  --color-ochre: #C67A36;         /* visited  */
  --color-verdigris: #5E8A76;     /* solved   */
  --color-vermilion: #C5462E;     /* current  */
  --color-saffron: #E6B340;       /* highlight */

  /* ── typography ─────────────────────────────────────────── */
  --font-display: var(--font-display), Georgia, serif;
  --font-sans: var(--font-body), Georgia, serif;
  --font-mono: var(--font-mono), ui-monospace, monospace;
  --font-hand: var(--font-hand), "Comic Sans MS", cursive;

  --text-xs:   0.8125rem;  /* 13px */
  --text-sm:   0.9375rem;  /* 15px */
  --text-base: 1.0625rem;  /* 17px */
  --text-lg:   1.1875rem;  /* 19px */
  --text-xl:   1.4375rem;  /* 23px */
  --text-2xl:  1.8125rem;  /* 29px */
  --text-3xl:  2.3125rem;  /* 37px */
  --text-4xl:  3rem;       /* 48px */
  --text-5xl:  4rem;       /* 64px */

  /* ── motion ─────────────────────────────────────────────── */
  --ease-paper: cubic-bezier(0.2, 0.7, 0.2, 1);

  --animate-ink-settle: ink-settle 600ms var(--ease-paper) both;
  --animate-page-reveal: page-reveal 800ms var(--ease-paper) both;
}

@keyframes ink-settle {
  0%   { opacity: 0; transform: translateY(4px); }
  60%  { opacity: 1; }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes page-reveal {
  0%   { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

What this buys us, automatically:

- `bg-parchment`, `text-ink`, `border-parchment-edge`, etc.
- `font-display`, `font-sans`, `font-mono`, `font-hand`.
- `text-base` = 17px, matching our design scale.
- `animate-ink-settle`, `animate-page-reveal`.

---

## Base styles

We set body background + text + the parchment noise texture in a `@layer
base` block right after `@theme`:

```css
@layer base {
  html, body { height: 100%; }

  body {
    background-color: var(--color-parchment);
    color: var(--color-ink);
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: 1.6;
    background-image: url("data:image/svg+xml;utf8,<svg …>"); /* noise */
    background-repeat: repeat;
  }

  ::selection {
    background: var(--color-saffron);
    color: var(--color-ink);
  }

  :focus-visible {
    outline: 3px solid var(--color-ochre);
    outline-offset: 2px;
  }
}
```

---

## Conventions we follow in markup

- **Always use tokens, never raw hex** in className. `bg-parchment-deep`,
  not `bg-[#E8DCC4]`. If we reach for arbitrary values it usually means
  the token set is wrong — fix the token.
- **Line-length cap for prose:** `max-w-[66ch]`.
- **Container default:** `mx-auto px-6 md:px-10`. No `container`
  component; Tailwind's `container` utility is not configured in v4 by
  default.
- **Stack with `space-y-*`** or `gap-*`. Rarely manual margins.
- **Headings get `font-display`**, body gets `font-sans` (which is a
  serif for us, despite the name — don't get confused).

---

## When to use raw CSS instead

Tailwind utilities handle ~95% of our needs. The exceptions:

- **Complex keyframes** — defined in `globals.css` next to `@theme`.
- **The parchment noise texture** — a data-URI SVG background, too
  unwieldy as a utility.
- **Excalidraw container overrides** — the library's own styles need
  specific selector targeting (`.excalidraw .App-menu { ... }`).

Anything else — reach for utilities first.

---

## What v4 is *not*

- Not a drop-in for a v3 config. If you see a `tailwind.config.ts` in a
  search result, it's v3 advice — don't port it over.
- Not JIT-configurable the same way. Plugins that relied on extending
  theme in JS must be re-expressed as CSS variables in `@theme`.
- Not bundled with PostCSS autoprefixer by default — the `@tailwindcss/
  postcss` plugin handles vendor prefixes internally.

---

## Quick sanity check

If a new contributor's styles aren't applying, the ladder:

1. Is `@import "tailwindcss";` at the top of `globals.css`?
2. Is `globals.css` imported from `app/layout.tsx`?
3. Is the token they're using actually defined in `@theme`?
4. Is `postcss.config.mjs` present and naming `@tailwindcss/postcss`?

That covers the 4 failure modes we've seen.
