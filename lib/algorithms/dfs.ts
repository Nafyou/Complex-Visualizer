import { edgeKey, type Graph, type NodeId, type Step } from "./types";

export const dfsSource = `function dfs(graph, start, goal) {
  const visited = new Set();
  const parent = new Map();
  const stack = [start];

  while (stack.length > 0) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    if (current === goal) break;

    for (const neighbor of graph.neighbors(current)) {
      if (visited.has(neighbor)) continue;
      parent.set(neighbor, current);
      stack.push(neighbor);
    }
  }

  return reconstructPath(parent, start, goal);
}`;

/** Line-matched Python twin of dfsSource — same LINE indices highlight. */
export const dfsSourcePython = `def dfs(graph, start, goal):
    visited = set()
    parent = {}
    stack = [start]

    while stack:
        current = stack.pop()
        if current in visited: continue
        visited.add(current)
        if current == goal: break

        for neighbor in graph[current]:
            if neighbor in visited: continue
            parent.setdefault(neighbor, current)
            stack.append(neighbor)



    return reconstruct_path(parent, start, goal)`;

const LINE = {
  SIGNATURE: 1,
  INIT_VISITED: 2,
  INIT_PARENT: 3,
  INIT_STACK: 4,
  LOOP: 6,
  POP: 7,
  SKIP_VISITED: 8,
  MARK_VISITED: 9,
  GOAL_CHECK: 10,
  FOR_NEIGHBOR: 12,
  IF_VISITED: 13,
  SET_PARENT: 14,
  PUSH: 15,
  RECONSTRUCT: 19,
} as const;

function adjacency(graph: Graph) {
  const adj = new Map<NodeId, NodeId[]>();
  for (const n of graph.nodes) adj.set(n.id, []);
  for (const e of graph.edges) {
    adj.get(e.from)!.push(e.to);
    if (!graph.directed) adj.get(e.to)!.push(e.from);
  }
  // Sort ascending so `.reverse()` later yields lexicographic visit order.
  for (const [k, v] of adj) adj.set(k, [...v].sort());
  return adj;
}

export function runDFS(graph: Graph, start: NodeId, goal?: NodeId): Step[] {
  const steps: Step[] = [];
  const adj = adjacency(graph);

  const visited = new Set<NodeId>();
  const parent = new Map<NodeId, NodeId>();
  const stack: NodeId[] = [start];
  const traversed = new Set<string>();
  const frontierSet = new Set<string>();

  const snapshot = (
    partial: Partial<Step> & Pick<Step, "caption" | "codeLine">,
  ): Step => ({
    visited: new Set(visited),
    traversed: new Set(traversed),
    frontier: new Set(frontierSet),
    // Top of stack (next to pop) at index 0, so the strip reads left-to-right.
    dataStructure: { kind: "stack", items: [...stack].reverse() },
    ...partial,
  });

  steps.push(
    snapshot({
      caption: `We begin at ${start}. The stack holds one thing — where we are.`,
      codeLine: LINE.INIT_STACK,
      current: start,
    }),
  );

  while (stack.length > 0) {
    const current = stack.pop()!;
    steps.push(
      snapshot({
        caption:
          current === start
            ? `We take ${current} off the top of the stack.`
            : `We pop ${current} — the most recently pushed node — and look at it.`,
        codeLine: LINE.POP,
        current,
      }),
    );

    if (visited.has(current)) {
      steps.push(
        snapshot({
          caption: `${current} is already visited — we skip it and keep going.`,
          codeLine: LINE.SKIP_VISITED,
          current,
        }),
      );
      continue;
    }

    visited.add(current);
    steps.push(
      snapshot({
        caption: `We mark ${current} visited.`,
        codeLine: LINE.MARK_VISITED,
        current,
      }),
    );

    if (goal && current === goal) {
      steps.push(
        snapshot({
          caption: `${current} is the goal. DFS can stop.`,
          codeLine: LINE.GOAL_CHECK,
          current,
        }),
      );
      break;
    }

    const neighbors = adj.get(current) ?? [];
    // DFS explores depth-first; push in reverse so the first (alphabetical)
    // neighbor is popped next. Makes the drawn path feel predictable.
    for (const neighbor of [...neighbors].reverse()) {
      const k = edgeKey(current, neighbor, graph.directed);
      frontierSet.add(k);
      if (visited.has(neighbor)) {
        steps.push(
          snapshot({
            caption: `${neighbor} is already visited — we don't revisit it.`,
            codeLine: LINE.IF_VISITED,
            current,
          }),
        );
        frontierSet.delete(k);
        traversed.add(k);
        continue;
      }
      if (!parent.has(neighbor)) parent.set(neighbor, current);
      stack.push(neighbor);
      traversed.add(k);
      frontierSet.delete(k);
      steps.push(
        snapshot({
          caption: `We push ${neighbor} onto the stack. Depth-first means we'll follow this thread next.`,
          codeLine: LINE.PUSH,
          current,
        }),
      );
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

  steps.push(
    snapshot({
      caption:
        goal && path
          ? `Path reconstructed from the parent trail: ${path.join(" → ")}. Note — this is one valid DFS path, not necessarily the shortest.`
          : `Stack empty. Everything reachable from ${start} has been visited.`,
      codeLine: LINE.RECONSTRUCT,
      current: goal,
      path,
      pathEdges,
    }),
  );

  return steps;
}
