# Architecture

The shape of the code, the data, and the contracts between them.

---

## The one commitment

**The algorithm is a pure generator of steps. The UI replays steps.** No
UI-derived state ever feeds back into the algorithm.

```
 ┌────────────────┐
 │ Graph          │   (plain JSON, hand-laid-out)
 └──────┬─────────┘
        │
        ▼
 ┌────────────────┐
 │ bfs(graph)     │   pure function → Step[]
 └──────┬─────────┘
        │
        ▼
 ┌────────────────┐
 │ Step[]         │   snapshots of "what's visited now"
 └──┬──────┬──────┘
    │      │
    ▼      ▼
 Scene   Code-line
 Excali- highlight    Narration
 draw    + keystroke  per-step
 update  sync         prose
```

This separation means we can add features — reverse play, export to GIF,
"ask me a question at step N" — without touching the algorithm.

---

## Types (the core contract)

`lib/algorithms/types.ts`:

```ts
export type NodeId = string;

export interface Node {
  id: NodeId;
  x: number;        // canvas coord
  y: number;
  label?: string;   // defaults to id
}

export interface Edge {
  from: NodeId;
  to: NodeId;
  weight?: number;  // for weighted algorithms
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
  directed?: boolean;
}

export interface Step {
  /** human-readable one-liner describing this step */
  caption: string;

  /** nodes fully explored */
  visited: Set<NodeId>;

  /** the node the algorithm is examining *right now* (vermilion) */
  current?: NodeId;

  /** edges in the algorithm's work set (frontier queue/stack/heap) */
  frontier?: Set<string>;   // `${from}-${to}`

  /** edges already traversed */
  traversed?: Set<string>;

  /** final reconstructed path, set on last step */
  path?: NodeId[];
  pathEdges?: Set<string>;

  /** optional: the data structure's contents, for side-panel display */
  dataStructure?: { kind: "queue" | "stack" | "heap"; items: string[] };

  /** which line of code produced this step */
  codeLine: number;
}

export interface AlgorithmModule {
  slug: string;              // "bfs"
  title: string;             // "Breadth-first search"
  tagline: string;           // one sentence
  complexity: { time: string; space: string };
  run(graph: Graph, start: NodeId, goal?: NodeId): Step[];
  code: string;              // the source shown in the code panel
}
```

Adding a new algorithm means writing a new `AlgorithmModule`. That's it.

---

## File layout (as built)

```
app/
  layout.tsx
  page.tsx                     landing
  globals.css
  learn/
    page.tsx                   atlas index (lists all AlgorithmModules)
    [slug]/page.tsx            algorithm page (server shell + client runner)
  journey/page.tsx
  playground/page.tsx

components/
  Nav.tsx
  Footer.tsx
  AlgorithmShell.tsx           the 4-facet layout (server)
  AlgorithmRunner.tsx          client: player + canvas + code (client)
  GraphCanvas.tsx              dynamic-imported Excalidraw wrapper
  GraphCanvas.client.tsx       real Excalidraw consumer
  CodePanel.tsx                syntax-highlighted code + line sync
  StepScrubber.tsx             play/pause/step controls
  Narration.tsx                caption/prose for current step
  JourneyRibbon.tsx            footer progress ribbon
  WorldExamples.tsx            the "in the world" section
  Checkpoint.tsx               the "prove you got it" block
  MarginNote.tsx               handwritten aside
  CanvasSkeleton.tsx           loading placeholder for the canvas

lib/
  algorithms/
    types.ts
    bfs.ts
    dfs.ts
    dijkstra.ts
    registry.ts                { [slug]: AlgorithmModule }
  excalidraw/
    scene.ts                   (graph, step) → Excalidraw skeleton
  lessons/
    bfs.ts                     prose, intuition, world examples, checkpoint
    dfs.ts
    dijkstra.ts
  journey.ts                   localStorage journal API
  sample-graphs.ts             pre-made graphs for lessons

docs/                          (this folder)
```

---

## How a page renders (end-to-end)

Taking `/learn/bfs` as the reference:

1. **Server render.** `app/learn/[slug]/page.tsx` looks up the slug in
   `lib/algorithms/registry.ts` and in `lib/lessons/*.ts`. It renders
   `<AlgorithmShell>` with the lesson content (intuition prose, world
   examples, checkpoint). This HTML is complete and crawlable.

2. **Client hydration.** Inside `<AlgorithmShell>` the server places
   `<AlgorithmRunner slug="bfs" />`, a client component. It imports the
   algorithm module and a sample graph, runs `bfs(graph, start)` once on
   mount, and stashes the `Step[]` in state.

3. **First paint.** The runner places `<GraphCanvas step={steps[0]} …
   />`, `<CodePanel code={module.code} activeLine={steps[0].codeLine}
   />`, and `<Narration text={steps[0].caption} />`.

4. **Interaction.** `<StepScrubber>` drives `currentStep` up/down. Each
   change triggers:
   - Canvas: rebuilds skeleton, calls `api.updateScene`.
   - Code: scrolls/highlights the new line.
   - Narration: swaps caption with an `animate-ink-settle` transition.
   - Journey: records the interaction for `/journey`.

5. **Checkpoint.** After the user scrubs through at least once, the
   `<Checkpoint>` unlocks. Answering it writes a badge to the journal.

---

## The journey (localStorage shape)

```ts
// lib/journey.ts
interface JourneyState {
  version: 1;
  visits: Record<string, { firstAt: number; lastAt: number; steps: number }>;
  checkpoints: Record<string, { passedAt: number; note?: string }>;
  notes: Record<string, string>;   // per-algorithm free-text
}
```

Persisted to `localStorage["atlas-journey"]`. Read once on load into a
React context, written through a tiny setter that debounces to 250ms.

`/journey` is just a visualization of this state.

---

## Performance notes

- **Algorithms run in the main thread.** For v0/v1 graphs are tiny (≤50
  nodes). We will move heavier algorithms to a worker in v2 if needed.
- **Excalidraw re-renders.** `updateScene` replaces the element array. At
  ~50 nodes + edges this is instant. At 500+, we'd batch or diff.
- **Fonts.** `next/font/google` self-hosts — no external requests at
  runtime.
- **JS budget.** Landing page must be under 150KB gzipped at first load
  (Excalidraw doesn't load until /learn/[slug]).
