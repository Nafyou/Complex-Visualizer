# Excalidraw — How we drive it programmatically

Excalidraw is not a decoration. It's the substrate of understanding. This
doc captures how we use its programmatic API to replay algorithm steps as
a hand-drawn picture.

---

## Why Excalidraw

Three reasons, in order:

1. **The wobble is pedagogy.** Hand-drawn strokes read as "being
   explored," not "the final answer." That invites thought.
2. **It's fully programmable.** `convertToExcalidrawElements` +
   `excalidrawAPI.updateScene` gives us complete control.
3. **It degrades gracefully.** Users can pan/zoom/edit the canvas if they
   want to play.

---

## Install

```bash
npm install @excalidraw/excalidraw
```

Excalidraw touches `window` at module load. We must dynamically import it
with `ssr: false` in the App Router:

```tsx
// components/GraphCanvas.tsx
"use client";
import dynamic from "next/dynamic";

export const GraphCanvas = dynamic(
  () => import("./GraphCanvas.client").then((m) => m.GraphCanvas),
  { ssr: false, loading: () => <CanvasSkeleton /> }
);
```

Then `GraphCanvas.client.tsx` — also `"use client"` — does the real work.

---

## The shape of an Excalidraw scene

A scene is a flat array of elements. Each element has a `type` (`ellipse`,
`rectangle`, `arrow`, `text`, …), position, size, and style. Elements
reference each other by `id` (used for arrow bindings).

We don't build raw elements by hand — Excalidraw ships a helper called
`convertToExcalidrawElements` that takes a *skeleton* (high-level shape
descriptions, optionally with labels and bindings) and expands it into
fully-formed elements.

Minimal example:

```ts
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

const elements = convertToExcalidrawElements([
  {
    type: "ellipse",
    id: "a",
    x: 100, y: 100, width: 80, height: 80,
    strokeColor: "#1F1B1A",
    backgroundColor: "#F4ECDC",
    label: { text: "A", fontSize: 20 },
  },
  {
    type: "ellipse",
    id: "b",
    x: 300, y: 100, width: 80, height: 80,
    strokeColor: "#1F1B1A",
    backgroundColor: "#F4ECDC",
    label: { text: "B", fontSize: 20 },
  },
  {
    type: "arrow",
    x: 180, y: 140,
    start: { id: "a" },
    end: { id: "b" },
    strokeColor: "#1F1B1A",
  },
]);
```

The arrow `start`/`end` properties reference nodes by id — Excalidraw
computes the actual endpoint intersection with the ellipse boundary. This
is exactly what we need for graph edges.

---

## Driving the scene from an algorithm

The core loop:

```
algorithm   →   Step[]   →   buildScene(step)   →   api.updateScene({ elements })
```

We hold a ref to the `excalidrawAPI` (passed via the `<Excalidraw>`
prop `excalidrawAPI={...}`), then call `updateScene` each time the
scrubber advances:

```tsx
"use client";
import { Excalidraw, convertToExcalidrawElements } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useEffect, useRef } from "react";

export function GraphCanvas({ step, graph }) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);

  useEffect(() => {
    if (!apiRef.current) return;
    const elements = convertToExcalidrawElements(
      buildSkeleton(graph, step)
    );
    apiRef.current.updateScene({ elements });
  }, [step, graph]);

  return (
    <div className="h-[520px]">
      <Excalidraw
        excalidrawAPI={(api) => (apiRef.current = api)}
        initialData={{
          appState: {
            viewBackgroundColor: "#F4ECDC",
            theme: "light",
          },
        }}
        viewModeEnabled
        zenModeEnabled
      />
    </div>
  );
}
```

`viewModeEnabled` hides the toolbar (the learner isn't drawing, they're
watching). `zenModeEnabled` hides the side panels. The canvas becomes a
clean display surface.

For the **playground** page, we turn both off so the user can draw.

---

## Scene-building: from Step to Excalidraw skeleton

This is the translation layer. It lives in `lib/excalidraw/scene.ts`.

```ts
import type { Graph, Step } from "@/lib/algorithms/types";

const PALETTE = {
  ink:        "#1F1B1A",
  parchment:  "#F4ECDC",
  ochre:      "#C67A36",
  vermilion:  "#C5462E",
  verdigris:  "#5E8A76",
} as const;

const NODE_R = 56;  // radius

export function buildSkeleton(graph: Graph, step: Step) {
  const nodeSkeletons = graph.nodes.map((n) => {
    const fill =
      step.current === n.id      ? PALETTE.vermilion
      : step.path?.includes(n.id)? PALETTE.verdigris
      : step.visited.has(n.id)   ? PALETTE.ochre
      :                            PALETTE.parchment;

    return {
      type: "ellipse" as const,
      id: n.id,
      x: n.x, y: n.y,
      width: NODE_R, height: NODE_R,
      strokeColor: PALETTE.ink,
      backgroundColor: fill,
      fillStyle: "solid",
      strokeWidth: 2,
      roughness: 1,
      label: { text: n.id, fontSize: 20, strokeColor: PALETTE.ink },
    };
  });

  const edgeSkeletons = graph.edges.map((e) => ({
    type: "arrow" as const,
    id: `${e.from}-${e.to}`,
    x: 0, y: 0,
    strokeColor:
      step.pathEdges?.has(`${e.from}-${e.to}`) ? PALETTE.verdigris :
      step.frontier?.has(`${e.from}-${e.to}`)  ? PALETTE.vermilion :
      step.traversed?.has(`${e.from}-${e.to}`) ? PALETTE.ochre    :
                                                 PALETTE.ink,
    strokeWidth: 2,
    roughness: 1,
    start: { id: e.from },
    end:   { id: e.to },
    endArrowhead: graph.directed ? "arrow" : null,
  }));

  return [...edgeSkeletons, ...nodeSkeletons]; // edges drawn behind nodes
}
```

Two worthwhile properties:

- **`roughness: 1`** keeps the hand-drawn wobble on at medium strength.
  `0` makes lines perfectly straight (we don't want that).
- **`fillStyle: "solid"`** — for node interiors when visited. The default
  hachure fill is beautiful but visually noisy when many nodes change
  state. Solid fills read faster.

---

## Important gotchas

- **`@excalidraw/excalidraw/index.css` must be imported** from the client
  component, once. If you forget, the canvas renders invisibly with broken
  layout.
- **Parent must have a fixed height.** Excalidraw uses 100% of its
  container. A container with `height: auto` collapses to zero.
- **`excalidrawAPI` is set asynchronously.** It's passed as a callback
  prop, not available on first render. Always guard `apiRef.current`.
- **Server imports blow up.** `import { convertToExcalidrawElements }
  from "@excalidraw/excalidraw"` in a server component throws at build.
  Keep it in `"use client"` files.
- **Scene diffs are not automatic.** `updateScene` replaces elements
  wholesale. That's fine for our sub-100-element graphs; for huge scenes
  you'd need to minimize the churn.

---

## What we do *not* do

- **We don't persist Excalidraw scenes.** The scene is always derived from
  `(graph, step)`. Step is the source of truth.
- **We don't use Excalidraw's collaboration features.** Single-user.
- **We don't let Excalidraw compute layout.** Node positions come from
  `graph.nodes[i].{x,y}` — we lay them out ourselves (hand-crafted for
  each lesson in v0, force-directed later).
