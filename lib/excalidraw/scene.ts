import { edgeKey, type Graph, type Step } from "@/lib/algorithms/types";

/**
 * (Graph, Step) → Excalidraw element skeleton.
 *
 * Four load-bearing details — change at your peril:
 *
 *  1. **Edges are `type: "arrow"`** (even for undirected graphs). Excalidraw's
 *     internal `bindLinearElement` early-returns unless the element is an
 *     arrow, so `type: "line"` silently fails to connect to endpoints.
 *
 *  2. **Explicit `x`, `y`, and `points` per arrow** — computed from node
 *     centers. `convertToExcalidrawElements` only sets binding metadata and
 *     leaves `points` at the default `[[0,0], [100,0]]`, so bound arrows
 *     without explicit points render as tiny invisible dashes.
 *
 *  3. **Stable per-id seed.** Excalidraw uses rough.js, which randomizes
 *     the wobble from the element's `seed`. Without a stable seed the
 *     graph shakes on every `updateScene`. FNV-1a hash the id → seed.
 *
 *  4. **Geometry + strokeWidth are constant across steps.** Only colors
 *     change between steps — never dimensions, never stroke thickness.
 *     rough.js uses strokeWidth to compute hachure/jitter parameters, so
 *     even a 0.4px change invalidates the cached shape and re-rolls the
 *     geometry. Keep `strokeWidth` per *element kind* (node vs edge),
 *     NOT per *state* (visited/current/path). State is communicated
 *     entirely through color, which can change freely without shaking.
 */

const PALETTE: Record<string, string> = {
  ink:           "#1F1B1A",
  parchment:     "#F4ECDC",
  parchmentSun:  "#FAF3E4",
  ochre:         "#C67A36",
  ochreSoft:     "#E3B37D",
  verdigris:     "#5E8A76",
  verdigrisSoft: "#A7C4B5",
  vermilion:     "#C5462E",
  vermilionSoft: "#E8A392",
  inkGhost:      "#B8AB9D",
};

const NODE_SIZE = 64;
const NODE_R = NODE_SIZE / 2;

// Fixed widths — these NEVER change between steps.
const NODE_STROKE_W = 2;
const EDGE_STROKE_W = 1.8;

export interface Skeleton {
  [key: string]: unknown;
}

/** 32-bit FNV-1a hash — cheap, stable, enough to keep rough.js happy. */
function seedFrom(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % 2_000_000_000;
}

export function buildSkeleton(graph: Graph, step: Step): Skeleton[] {
  const pathEdges = step.pathEdges ?? new Set<string>();
  const frontierEdges = step.frontier ?? new Set<string>();
  const traversedEdges = step.traversed ?? new Set<string>();
  const pathNodes = new Set(step.path ?? []);

  const centers = new Map<string, { x: number; y: number }>();
  for (const n of graph.nodes) {
    centers.set(n.id, { x: n.x + NODE_R, y: n.y + NODE_R });
  }

  const nodes: Skeleton[] = graph.nodes.map((n) => {
    const isCurrent = step.current === n.id;
    const isOnPath = pathNodes.has(n.id);
    const isVisited = step.visited.has(n.id);

    let bg = PALETTE.parchmentSun;
    let stroke = PALETTE.ink;
    if (isOnPath) {
      bg = PALETTE.verdigrisSoft;
      stroke = PALETTE.verdigris;
    } else if (isCurrent) {
      bg = PALETTE.vermilionSoft;
      stroke = PALETTE.vermilion;
    } else if (isVisited) {
      bg = PALETTE.ochreSoft;
      stroke = PALETTE.ochre;
    }

    return {
      type: "ellipse",
      id: n.id,
      x: n.x,
      y: n.y,
      width: NODE_SIZE,
      height: NODE_SIZE,
      seed: seedFrom(n.id),
      strokeColor: stroke,
      backgroundColor: bg,
      fillStyle: "solid",
      strokeWidth: NODE_STROKE_W,
      strokeStyle: "solid",
      roughness: 1,
      label: {
        text: n.label ?? n.id,
        fontSize: 22,
        strokeColor: PALETTE.ink,
        fontFamily: 3,
      },
    };
  });

  const edges: Skeleton[] = graph.edges.map((e) => {
    const from = centers.get(e.from);
    const to = centers.get(e.to);
    if (!from || !to) {
      throw new Error(
        `scene.buildSkeleton: edge references unknown node — ${e.from} → ${e.to}`,
      );
    }

    const k = edgeKey(e.from, e.to, graph.directed);
    let stroke = PALETTE.ink;
    if (pathEdges.has(k)) {
      stroke = PALETTE.verdigris;
    } else if (frontierEdges.has(k)) {
      stroke = PALETTE.vermilion;
    } else if (traversedEdges.has(k)) {
      stroke = PALETTE.ochre;
    }

    const dx = to.x - from.x;
    const dy = to.y - from.y;

    const skel: Skeleton = {
      type: "arrow",
      id: k,
      x: from.x,
      y: from.y,
      width: Math.abs(dx),
      height: Math.abs(dy),
      points: [
        [0, 0],
        [dx, dy],
      ],
      seed: seedFrom(k),
      strokeColor: stroke,
      strokeWidth: EDGE_STROKE_W,
      strokeStyle: "solid",
      roughness: 1,
      start: { id: e.from },
      end: { id: e.to },
    };

    if (graph.directed) {
      skel.endArrowhead = "arrow";
      skel.startArrowhead = null;
    } else {
      skel.endArrowhead = null;
      skel.startArrowhead = null;
    }

    if (e.weight !== undefined) {
      skel.label = {
        text: String(e.weight),
        fontSize: 16,
        strokeColor: PALETTE.ink,
        fontFamily: 3,
      };
    }

    return skel;
  });

  return [...edges, ...nodes];
}
