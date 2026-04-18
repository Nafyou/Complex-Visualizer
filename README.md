# The Atlas

A beautiful, pleasing graph-algorithm visualizer. Not a dashboard — a journal.
Built with Next.js 16, Tailwind v4, and Excalidraw.

**Start with the vision:** [Master.md](Master.md)

---

## What's here

- A hand-drawn, step-by-step visualizer for **BFS**, **DFS**, and **Dijkstra**.
- A lesson model — intuition · the run · in the world · checkpoint — applied
  consistently to every algorithm.
- A personal journey tracker (localStorage) that remembers what you've opened,
  what you've learned, and what you've written.
- A deliberate aesthetic: parchment, serifs, ink. Not a purple gradient in
  sight. See [docs/design-philosophy.md](docs/design-philosophy.md).

---

## Getting started

```bash
# install
npm install

# run the dev server (Turbopack, default in Next 16)
npm run dev

# open http://localhost:3000
```

Requirements: **Node 20.9+**.

---

## Scripts

| Command            | What it does                                    |
|--------------------|-------------------------------------------------|
| `npm run dev`      | Start dev server on :3000 (Turbopack).          |
| `npm run build`    | Production build.                               |
| `npm start`        | Start production server (after `build`).        |
| `npm run lint`     | ESLint.                                         |
| `npm run typecheck`| TypeScript type-check, no emit.                 |

---

## Project structure

Short version (full tree in [docs/architecture.md](docs/architecture.md)):

```
app/                    Next.js App Router — pages, layout, globals
  page.tsx              Landing
  learn/                Atlas index + /learn/[slug]
  journey/              The learner's journal
  playground/           (drafted — free-draw your own graph)

components/             React components — the shell, the canvas, the runner
lib/
  algorithms/           Pure algorithm implementations (BFS, DFS, Dijkstra)
  lessons/              Per-algorithm lesson content (prose, checkpoints)
  excalidraw/           Scene-building: (graph, step) → Excalidraw skeleton
  journey.ts            localStorage-backed journal

docs/                   Design philosophy + research docs (read these)
Master.md               The north star — read this first
```

---

## Reading order (for a new contributor)

1. [Master.md](Master.md) — the vision and pillars.
2. [docs/design-philosophy.md](docs/design-philosophy.md) — the aesthetic.
3. [docs/teaching-model.md](docs/teaching-model.md) — the 4-facet lesson.
4. [docs/architecture.md](docs/architecture.md) — how the code is laid out.
5. [docs/nextjs-guide.md](docs/nextjs-guide.md) — the Next.js 16 subset we use.
6. [docs/tailwind-guide.md](docs/tailwind-guide.md) — the Tailwind v4 setup.
7. [docs/excalidraw-guide.md](docs/excalidraw-guide.md) — how we drive the canvas.
8. [lib/algorithms/bfs.ts](lib/algorithms/bfs.ts) — the reference algorithm.
9. [components/AlgorithmShell.tsx](components/AlgorithmShell.tsx) — the page shape.

---

## Deploying to Vercel

1. Push this repo to GitHub / GitLab / Bitbucket.
2. In the Vercel dashboard: *Add New → Project → Import*.
3. Vercel auto-detects Next.js. No environment variables needed.
4. Click *Deploy*.

The initial build takes ~90 seconds on Vercel's default plan (Excalidraw is a
heavy dependency). Subsequent builds are faster thanks to caching.

### Or via the Vercel CLI

```bash
npm i -g vercel
vercel          # first time — walks you through linking the project
vercel --prod   # deploy to production
```

---

## Adding a new algorithm

Adding an algorithm is a three-file change:

1. **`lib/algorithms/<name>.ts`** — the pure implementation. Export a
   `run<Name>(graph, start, goal)` that returns a `Step[]` and a `<name>Source`
   string (the code to show in the panel). See [bfs.ts](lib/algorithms/bfs.ts)
   as the reference.
2. **`lib/lessons/<name>.ts`** — the lesson content (intuition prose, world
   examples, checkpoint spec). Shape: `Lesson`
   (see [types.ts](lib/algorithms/types.ts)).
3. **`lib/lessons/registry.ts`** — add one line importing the new lesson into
   the `LESSONS` array.

That's it. `/learn/<slug>` auto-generates. No routing config, no extra glue.

---

## License

See [LICENSE.txt](LICENSE.txt) if present — otherwise unlicensed and
private by default.
