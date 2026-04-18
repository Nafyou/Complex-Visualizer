import { edgeKey, type Graph, type NodeId, type Step } from "./types";

export const dijkstraSource = `function dijkstra(graph, start, goal) {
  const dist = new Map();
  const parent = new Map();
  for (const node of graph.nodes) dist.set(node.id, Infinity);
  dist.set(start, 0);
  const pq = new MinHeap();
  pq.push({ id: start, cost: 0 });

  while (!pq.empty()) {
    const { id: current, cost } = pq.pop();
    if (cost > dist.get(current)) continue;
    if (current === goal) break;

    for (const edge of graph.edgesFrom(current)) {
      const next = cost + edge.weight;
      if (next < dist.get(edge.to)) {
        dist.set(edge.to, next);
        parent.set(edge.to, current);
        pq.push({ id: edge.to, cost: next });
      }
    }
  }

  return reconstructPath(parent, start, goal);
}`;

const LINE = {
  SIGNATURE: 1,
  INIT_DIST: 2,
  INIT_PARENT: 3,
  FILL_INF: 4,
  SET_START: 5,
  INIT_PQ: 6,
  PUSH_START: 7,
  LOOP: 9,
  POP: 10,
  STALE: 11,
  GOAL_CHECK: 12,
  FOR_EDGE: 14,
  COMPUTE: 15,
  IF_BETTER: 16,
  SET_DIST: 17,
  SET_PARENT: 18,
  PQ_PUSH: 19,
  RECONSTRUCT: 24,
} as const;

interface HeapItem { id: NodeId; cost: number }

// Tiny lo-fi min-heap via sorted-array. Graphs here are small; don't optimize.
function heapItems(arr: HeapItem[]): HeapItem[] {
  return [...arr].sort((a, b) => a.cost - b.cost);
}

function edgesFrom(graph: Graph, id: NodeId) {
  const out = graph.edges.filter((e) => e.from === id);
  if (!graph.directed) {
    const inn = graph.edges
      .filter((e) => e.to === id && e.from !== id)
      .map((e) => ({ from: e.to, to: e.from, weight: e.weight }));
    return [...out, ...inn].sort((a, b) => a.to.localeCompare(b.to));
  }
  return out.sort((a, b) => a.to.localeCompare(b.to));
}

export function runDijkstra(
  graph: Graph,
  start: NodeId,
  goal?: NodeId,
): Step[] {
  const steps: Step[] = [];
  const dist = new Map<NodeId, number>();
  for (const n of graph.nodes) dist.set(n.id, Infinity);
  dist.set(start, 0);
  const parent = new Map<NodeId, NodeId>();
  const pq: HeapItem[] = [{ id: start, cost: 0 }];
  const visited = new Set<NodeId>();
  const traversed = new Set<string>();
  const frontierSet = new Set<string>();

  const snapshot = (
    partial: Partial<Step> & Pick<Step, "caption" | "codeLine">,
  ): Step => {
    const sorted = heapItems(pq);
    return {
      visited: new Set(visited),
      traversed: new Set(traversed),
      frontier: new Set(frontierSet),
      dataStructure: {
        kind: "heap",
        items: sorted.map((it) => `${it.id}:${it.cost}`),
      },
      ...partial,
    };
  };

  steps.push(
    snapshot({
      caption: `Starting at ${start}. Every other node is at distance ∞ — we don't know yet.`,
      codeLine: LINE.SET_START,
      current: start,
    }),
  );

  while (pq.length > 0) {
    // pop the min
    pq.sort((a, b) => a.cost - b.cost);
    const { id: current, cost } = pq.shift()!;

    steps.push(
      snapshot({
        caption: `Take ${current} — the cheapest unfinished node, at distance ${cost}.`,
        codeLine: LINE.POP,
        current,
      }),
    );

    if (cost > (dist.get(current) ?? Infinity)) {
      steps.push(
        snapshot({
          caption: `We've already found a cheaper way to ${current}. Skip this stale entry.`,
          codeLine: LINE.STALE,
          current,
        }),
      );
      continue;
    }

    visited.add(current);

    if (goal && current === goal) {
      steps.push(
        snapshot({
          caption: `${current} is the goal. Its distance (${cost}) is the shortest possible.`,
          codeLine: LINE.GOAL_CHECK,
          current,
        }),
      );
      break;
    }

    const edges = edgesFrom(graph, current);
    for (const edge of edges) {
      const k = edgeKey(edge.from, edge.to, graph.directed);
      frontierSet.add(k);
      const next = cost + (edge.weight ?? 1);
      const existing = dist.get(edge.to) ?? Infinity;

      if (next < existing) {
        dist.set(edge.to, next);
        parent.set(edge.to, current);
        pq.push({ id: edge.to, cost: next });
        traversed.add(k);
        frontierSet.delete(k);
        steps.push(
          snapshot({
            caption: `Through ${current}, we can reach ${edge.to} at distance ${next} — better than ${existing === Infinity ? "∞" : existing}. Update.`,
            codeLine: LINE.PQ_PUSH,
            current,
          }),
        );
      } else {
        frontierSet.delete(k);
        traversed.add(k);
        steps.push(
          snapshot({
            caption: `Through ${current}, ${edge.to} would be ${next}. We already have ${existing}. Keep the better one.`,
            codeLine: LINE.IF_BETTER,
            current,
          }),
        );
      }
    }
  }

  let path: NodeId[] | undefined;
  let pathEdges: Set<string> | undefined;
  if (goal && visited.has(goal)) {
    path = [];
    let cur: NodeId | undefined = goal;
    while (cur !== undefined) {
      path.unshift(cur);
      cur = parent.get(cur);
    }
    pathEdges = new Set<string>();
    for (let i = 0; i < path.length - 1; i++) {
      pathEdges.add(edgeKey(path[i], path[i + 1], graph.directed));
    }
  }

  const totalCost = goal && dist.get(goal) !== Infinity ? dist.get(goal) : null;
  steps.push(
    snapshot({
      caption:
        goal && path
          ? `Shortest path: ${path.join(" → ")}${totalCost !== null ? `, total cost ${totalCost}` : ""}.`
          : `Priority queue is empty. We've computed the shortest distance to every reachable node.`,
      codeLine: LINE.RECONSTRUCT,
      current: goal,
      path,
      pathEdges,
    }),
  );

  return steps;
}
