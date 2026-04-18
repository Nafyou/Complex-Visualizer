import { edgeKey, type Graph, type Step } from "@/lib/algorithms/types";

/**
 * (Graph, Step) → Excalidraw element skeleton.
 *
 * Three load-bearing details — change at your peril:
 *
 *  1. **Edges are `type: "arrow"`** (even for undirected graphs). Excalidraw's
 *     internal `bindLinearElement` early-returns unless the element is an
 *     arrow, so `type: "line"` silently fails to connect to endpoints.
 *
 *  2. **Explicit `x`, `y`, and `points` per arrow** — computed from node
 *     centers. We do NOT rely on `convertToExcalidrawElements` to compute
 *     arrow geometry from the start/end bindings: it only sets binding
 *     metadata (`startBinding` / `endBinding`) and leaves `points` at the
 *     default `[[0,0], [100, 0]]`. An arrow with default points renders as
 *     a tiny horizontal dash floating in empty space, which is exactly the
 *     bug "the edges aren't showing." We compute real points here so the
 *     arrow renders correctly whether or not the binder runs.
 *
 *  3. **Stable per-id seed.** Excalidraw uses rough.js, which randomizes
 *     its wobble from the element's `seed`. Without a stable seed the
 *     whole graph re-wobbles on every `updateScene`, producing a shake.
 *     We hash each element id into a deterministic seed.
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

  // Lookup: node id → center point. Node x/y is top-left in Excalidraw world.
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
    let strokeWidth = 2;
    if (isOnPath) {
      bg = PALETTE.verdigrisSoft;
      stroke = PALETTE.verdigris;
      strokeWidth = 3;
    } else if (isCurrent) {
      bg = PALETTE.vermilionSoft;
      stroke = PALETTE.vermilion;
      strokeWidth = 3;
    } else if (isVisited) {
      bg = PALETTE.ochreSoft;
      stroke = PALETTE.ochre;
      strokeWidth = 2.5;
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
      strokeWidth,
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
    let width = 1.6;
    if (pathEdges.has(k)) {
      stroke = PALETTE.verdigris;
      width = 3.5;
    } else if (frontierEdges.has(k)) {
      stroke = PALETTE.vermilion;
      width = 2.8;
    } else if (traversedEdges.has(k)) {
      stroke = PALETTE.ochre;
      width = 2.4;
    }

    const dx = to.x - from.x;
    const dy = to.y - from.y;

    const skel: Skeleton = {
      type: "arrow",
      id: k,
      // Anchor at the 'from' node's center; the points array expresses the
      // offset to the 'to' center. This way the arrow actually spans the
      // two nodes in absolute coordinates.
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
      strokeWidth: width,
      strokeStyle: "solid",
      roughness: 1,
      // Bindings keep the arrow semantically linked to its nodes for any
      // future interactive features. The geometry above is what renders.
      start: { id: e.from },
      end: { id: e.to },
    };

    // Directed → triangle at the end only.
    // Undirected → no tips; it's a plain line visually.
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

  // Edges first → rendered underneath the nodes.
  return [...edges, ...nodes];
}
