import { edgeKey, type Graph, type NodeId, type Step } from "./types";

export const bfsSource = `function bfs(graph, start, goal) {
  const visited = new Set([start]);
  const parent = new Map();
  const queue = [start];

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === goal) break;

    for (const neighbor of graph.neighbors(current)) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      parent.set(neighbor, current);
      queue.push(neighbor);
    }
  }

  return reconstructPath(parent, start, goal);
}`;

// Line numbers inside bfsSource, 1-indexed, that we highlight during runs.
const LINE = {
  SIGNATURE: 1,
  INIT_VISITED: 2,
  INIT_PARENT: 3,
  INIT_QUEUE: 4,
  LOOP: 6,
  DEQUEUE: 7,
  GOAL_CHECK: 8,
  FOR_NEIGHBOR: 10,
  IF_VISITED: 11,
  MARK_VISITED: 12,
  SET_PARENT: 13,
  ENQUEUE: 14,
  RECONSTRUCT: 18,
} as const;

function adjacency(graph: Graph) {
  const adj = new Map<NodeId, NodeId[]>();
  for (const n of graph.nodes) adj.set(n.id, []);
  for (const e of graph.edges) {
    adj.get(e.from)!.push(e.to);
    if (!graph.directed) adj.get(e.to)!.push(e.from);
  }
  for (const [k, v] of adj) adj.set(k, [...v].sort());
  return adj;
}

export function runBFS(graph: Graph, start: NodeId, goal?: NodeId): Step[] {
  const steps: Step[] = [];
  const adj = adjacency(graph);

  const visited = new Set<NodeId>([start]);
  const parent = new Map<NodeId, NodeId>();
  const queue: NodeId[] = [start];
  const traversed = new Set<string>();
  const frontierSet = new Set<string>();

  const snapshot = (partial: Partial<Step> & Pick<Step, "caption" | "codeLine">): Step => ({
    visited: new Set(visited),
    traversed: new Set(traversed),
    frontier: new Set(frontierSet),
    dataStructure: { kind: "queue", items: [...queue] },
    ...partial,
  });

  steps.push(
    snapshot({
      caption: `We begin at ${start}. The queue holds one thing: where we are.`,
      codeLine: LINE.INIT_QUEUE,
      current: start,
    }),
  );

  while (queue.length > 0) {
    const current = queue.shift()!;
    steps.push(
      snapshot({
        caption:
          current === start
            ? `We take ${current} out of the queue. It's our starting point.`
            : `We pop ${current} from the front of the queue and look at it.`,
        codeLine: LINE.DEQUEUE,
        current,
      }),
    );

    if (goal && current === goal) {
      steps.push(
        snapshot({
          caption: `${current} is the goal. We can stop searching.`,
          codeLine: LINE.GOAL_CHECK,
          current,
        }),
      );
      break;
    }

    const neighbors = adj.get(current) ?? [];
    for (const neighbor of neighbors) {
      const k = edgeKey(current, neighbor, graph.directed);
      frontierSet.add(k);
      if (visited.has(neighbor)) {
        steps.push(
          snapshot({
            caption: `${neighbor} is already visited — we leave it alone.`,
            codeLine: LINE.IF_VISITED,
            current,
          }),
        );
        frontierSet.delete(k);
        traversed.add(k);
        continue;
      }
      visited.add(neighbor);
      parent.set(neighbor, current);
      queue.push(neighbor);
      traversed.add(k);
      frontierSet.delete(k);
      steps.push(
        snapshot({
          caption: `${neighbor} is new. Mark it visited, remember ${current} brought us here, and put it at the back of the queue.`,
          codeLine: LINE.ENQUEUE,
          current,
        }),
      );
    }
  }

  // Reconstruct path to goal (if any)
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

  steps.push(
    snapshot({
      caption:
        goal && path
          ? `We rebuild the path by following the "who brought me here" trail: ${path.join(" → ")}.`
          : `Queue is empty — every reachable node has been visited.`,
      codeLine: LINE.RECONSTRUCT,
      current: goal,
      path,
      pathEdges,
    }),
  );

  return steps;
}
