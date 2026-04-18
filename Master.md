# Master.md — The Atlas

> A working document that captures the vision, philosophy, and shape of this
> project. If you only read one file in this repo, read this one.

---

## 1. The north star

**Build the most beautiful, pleasing graph-algorithm visualizer on the
internet — one that genuinely teaches.**

Not a toy. Not a spec sheet. Not a LeetCode rerun. An instrument that pulls a
curious person from *"I've heard of BFS"* through to *"I could implement
Dijkstra from scratch and explain why the priority queue matters."*

We are building **The Atlas** — a learning journal for graphs.

---

## 2. Why this exists

Graph algorithms are one of the most elegant ideas in computer science and
one of the most badly taught. The two dominant modes of teaching them both
fail:

| Mode | What it does | What it misses |
|------|--------------|----------------|
| Textbook | Proofs, pseudocode, complexity analysis | *Why* it's beautiful. *How* it feels to run. |
| Grinder | 300 LeetCode problems, pattern-match harder | The shape of the idea. The real-world analogue. |

We sit between them. We want the learner to:

1. **See** the algorithm unfold, step by step, on a drawing that feels
   handmade — because Excalidraw's wobble removes the "this is a machine"
   intimidation factor.
2. **Read** the code beside the picture, the same line highlighted that
   caused the last visual change.
3. **Feel** why this matters — which real problem it solves (routing,
   crawling, dependency resolution, social networks).
4. **Remember** what they learned, via a journal the app keeps for them.

The test for success: a user finishes a session and can, unprompted, explain
BFS to a friend without looking at notes.

---

## 3. Philosophical pillars

These are the non-negotiable commitments. Every feature decision routes
through them.

### 3.1 The app is a companion, not a textbook
The tone is curious, warm, slightly wry — a TA who actually likes the
material. Never scolding. Never empty praise. Celebrate genuine moments of
understanding. Examples:

- Bad: *"Correct! You have completed the quiz. Score: 80%."*
- Good: *"That was the tricky one. A lot of people — me included, first time
  — reach for a stack there. Queue was right. Here's why."*

### 3.2 The picture is primary
Excalidraw is not decoration. It is the substrate of understanding. Code and
prose orbit the drawing. If a concept can be shown, we show it; prose only
fills gaps the picture can't.

The hand-drawn wobble is load-bearing: it signals *this is not final, this is
being thought through*, and invites the learner to think alongside.

### 3.3 One algorithm, explored four ways
Every algorithm page has four facets, in order:

1. **The intuition** — a one-sentence "what it does" and a real-world
   analogy. Often a small drawing.
2. **The run** — the visual simulation. Stepped, scrubbable, replayable. Code
   and narration sync to it.
3. **The code** — the same algorithm, written cleanly in TypeScript, with
   the line that produced the current visual step highlighted.
4. **The world** — 2–3 real-world problems this algorithm solves, linked
   where possible to recognizable products (Google Maps, npm, Twitter).

No more, no less. Consistency is the scaffolding that makes the journey
feel like a journey.

### 3.4 The journey is remembered
The app keeps a journal for the user. Every algorithm visited, every
checkpoint passed, every note the user writes in the margin — persisted in
`localStorage` for v1. A /journey page shows the map.

This is how "playing with a visualizer" becomes "I am learning graphs."

### 3.5 Beauty is not optional
The aesthetic is deliberate and unlike any other algorithm-visualizer you've
seen. See [docs/design-philosophy.md](docs/design-philosophy.md) for the
full commitment. TL;DR: warm parchment, ink, serif display type, deliberate
restraint. We will not ship a purple-gradient dashboard.

---

## 4. What we're building (scope)

### 4.1 v0 — the spine (this scaffold)
- Landing page that states the invitation and sets tone.
- `/learn` index — the atlas of available algorithms.
- **BFS** fully implemented, end-to-end, as the reference pattern.
- Excalidraw canvas wrapper with programmatic scene control.
- Journey tracker (localStorage) and `/journey` page.
- Design system committed in CSS.

### 4.2 v1 — the full first chapter
- **DFS**, **Dijkstra** fully implemented.
- Playground page where user draws a graph and runs any algorithm on it.
- Margin notes (user's own annotations, saved per algorithm).
- Deployed to Vercel.

### 4.3 v2 — onward
- Topological sort, A*, union-find, MST (Kruskal/Prim).
- Proof sketches for key invariants, shown visually.
- Shareable permalinks to a specific step of a specific run.
- Optional "explain it back" — user types their explanation; the app
  highlights what they got and what's still fuzzy.

We do not build v2 until v1 is excellent.

---

## 5. Architectural shape

```
app/
  layout.tsx              Root layout — fonts, theme, journal provider
  page.tsx                Landing (the invitation)
  learn/
    page.tsx              Atlas index (all algorithms)
    [slug]/page.tsx       Single algorithm page (4 facets)
  journey/page.tsx        The learner's journal
  playground/page.tsx     Free-draw + run-algorithm sandbox

components/
  GraphCanvas.tsx         Excalidraw wrapper (client-only)
  AlgorithmPlayer.tsx     Step controller + scrubber
  CodePanel.tsx           Syntax-highlighted code with line-sync
  Narration.tsx           Prose that advances with steps
  JourneyRibbon.tsx       Persistent progress indicator
  Nav.tsx, Footer.tsx

lib/
  algorithms/
    types.ts              Graph, Step, AlgorithmModule types
    bfs.ts                BFS as a generator of steps
    dfs.ts, dijkstra.ts
  excalidraw/
    scene.ts              Build nodes/edges/labels as Excalidraw elements
    animate.ts            Scene diffs for visited/frontier/path states
  journey.ts              localStorage-backed journal

docs/
  design-philosophy.md    The aesthetic commitment
  nextjs-guide.md         How we use Next.js 16
  tailwind-guide.md       How we use Tailwind v4
  excalidraw-guide.md     How we drive Excalidraw programmatically
  architecture.md         Data flow + module boundaries
  teaching-model.md       The 4-facet lesson structure
```

### The core loop: algorithm → steps → scene

```
      ┌───────────────────────┐
      │  Graph (nodes, edges) │
      └───────────┬───────────┘
                  │
          bfs(graph, start)  ← pure generator, no UI
                  │
                  ▼
      ┌───────────────────────┐
      │  Step[] (snapshots)   │   visited, frontier, current, path
      └───────────┬───────────┘
                  │
    ┌─────────────┼──────────────┐
    ▼             ▼              ▼
 Scene         Code line      Narration
 (Excalidraw)  highlight      (prose)
```

The algorithm is a **pure generator of steps**. The UI replays steps; it
never re-runs the algorithm to derive UI state. This keeps pedagogy and
presentation cleanly separated — and lets us add reverse scrubbing, export,
and "ask me a question at step N" without touching the algorithm.

---

## 6. Tech choices (and why)

| Choice | Why |
|--------|-----|
| Next.js 16 (App Router) | Latest, Turbopack default, React 19 baked in. Vercel-ideal. |
| Tailwind v4 | CSS-first `@theme`, no config file, faster. Tokens live next to the design. |
| Excalidraw | Hand-drawn aesthetic is the *pedagogy*, not decoration. Fully programmable. |
| TypeScript | Algorithm modules need sharp types. Graph/Step shape is the core contract. |
| localStorage | v1 doesn't need accounts. Journey is personal and private by default. |
| Motion (later) | For React component animations when CSS runs out. |

What we are **not** using: Redux, tRPC, a database, a UI kit. The app is
small and opinionated. Every added dependency needs to justify itself
against the pillars in §3.

Details on each in [docs/](docs/).

---

## 7. The 4-facet lesson — the reference shape

Every algorithm page is the same shape. This is what makes the atlas feel
like an atlas and not a kitchen drawer.

```
┌─────────────────────────────────────────────────────────────┐
│  BREADTH-FIRST SEARCH                                       │
│  A wave spreading out from where you start.                 │
├─────────────────────────────────────────────────────────────┤
│  ▌ INTUITION                                                │
│    One sentence + a real-world analogy + a tiny drawing.    │
├─────────────────────────────────────────────────────────────┤
│  ▌ THE RUN            ┌────────────────────┐                │
│    [scrubber] ▷       │                    │ CODE (synced)  │
│    step 4 of 12       │   Excalidraw       │  01  function  │
│    narration…         │   canvas           │  02  ...       │
│                       └────────────────────┘  03 ← current  │
├─────────────────────────────────────────────────────────────┤
│  ▌ IN THE WORLD                                             │
│    Three compact cards: product / problem / one-line how.   │
├─────────────────────────────────────────────────────────────┤
│  ▌ CHECKPOINT                                               │
│    One question. One exercise. One note-to-self field.      │
└─────────────────────────────────────────────────────────────┘
```

Consistency is the curriculum.

---

## 8. What "done" means (and what it doesn't)

A feature is done when:
- The user can accomplish the intended learning outcome without help.
- The aesthetic commitments hold — type, spacing, color, motion.
- There is a checkpoint that proves understanding, not just completion.
- The journal reflects what happened.

A feature is **not** done when:
- It only works on the golden path.
- It ships with lorem ipsum or placeholder prose.
- It uses a generic font or a purple gradient.
- The code panel and canvas are out of sync for any step.

---

## 9. Open questions (kept honest)

- **Graph editing UX.** Excalidraw is great for *display*. For *authoring*
  a graph the user will run an algorithm on, do we let them draw directly,
  or do we surface a lightweight node-dragging mode on top? Leaning toward
  the latter, because free-draw graphs are often malformed.
- **Accessibility of the canvas.** Excalidraw is canvas-based and hostile
  to screen readers. We need a textual transcript of each step alongside
  the visual. Not optional. Tracked as v1.
- **Mobile.** The 4-facet layout assumes two columns. On mobile we stack
  and collapse. The scrubber is the hero on small screens.

---

## 10. Orientation for contributors (and future me)

If you're new here, read in this order:

1. This file (you're in it).
2. [docs/design-philosophy.md](docs/design-philosophy.md) — the look.
3. [docs/teaching-model.md](docs/teaching-model.md) — the 4-facet lesson.
4. [docs/architecture.md](docs/architecture.md) — the data flow.
5. [lib/algorithms/bfs.ts](lib/algorithms/bfs.ts) — the reference algorithm.
6. [app/learn/bfs/page.tsx](app/learn/bfs/page.tsx) — the reference page.

Everything else is a variation on those six.

---

*Last updated at scaffold. Kept current as the shape changes.*
