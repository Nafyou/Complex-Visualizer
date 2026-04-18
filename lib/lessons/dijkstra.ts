import { runDijkstra, dijkstraSource, dijkstraSourcePython } from "@/lib/algorithms/dijkstra";
import { cityGraph } from "@/lib/sample-graphs";
import type { Lesson } from "@/lib/algorithms/types";

export const dijkstraLesson: Lesson = {
  slug: "dijkstra",
  title: "Dijkstra's shortest path",
  tagline: "The cheapest way through, when every edge has a cost.",
  complexity: { time: "O((V + E) log V)", space: "O(V)" },
  intuitionLead:
    "When edges aren't all equal — some roads longer than others — BFS stops being enough. Dijkstra is what takes over.",
  intuitionBody: [
    "Imagine you're driving across a city and every road has a time on it. You want the quickest route. BFS would count intersections, not minutes. Dijkstra counts minutes.",
    "It works with a promise and a priority queue. The promise: once I finalize a node's distance, I'm never going to find a cheaper way there. The priority queue keeps candidates ordered by 'what's the cheapest so far?' — so we always finalize the one that can't be improved.",
    "The rule is the relaxation step: if reaching a neighbor through me is cheaper than whatever we knew before, write down the new distance and remember that the path goes through me. That's the whole algorithm, really.",
    "Two caveats. Dijkstra needs non-negative weights (negative ones break the promise). And it finalizes by cost, not hops — so a 3-hop route can beat a 1-hop route if the edge is slow enough.",
  ],
  preSimulationNote:
    "Watch the heap on the side. Each step pops the cheapest candidate, then tries to improve its neighbors. Numbers on edges are weights.",
  code: dijkstraSource,
  codeLanguage: "ts",
  pythonCode: dijkstraSourcePython,
  teacherNotes: [
    {
      when: "run",
      title: "stale entries",
      body:
        "You'll see moments where Dijkstra pops a node and immediately skips it. That's a *stale* entry — we found a cheaper path to that node after we pushed this one, so the old one in the heap is obsolete. It's a common source of bugs in hand-rolled implementations; the fix is the `cost > dist[node]` check.",
    },
    {
      when: "code",
      title: "why non-negative weights?",
      body:
        "The moment we pop a node we *commit* — we're saying no cheaper path can exist. A negative edge could undercut that promise by discounting a path after we've already finalized it. That's why Dijkstra is for non-negative weights, and Bellman-Ford (re-relaxes every edge V-1 times) is what you reach for when negatives are on the table.",
    },
    {
      when: "world",
      title: "Dijkstra's grandchild: A*",
      body:
        "Real map apps don't run pure Dijkstra — they run A*, which is Dijkstra plus a geographic heuristic (how close am I to the goal, as the crow flies). The heuristic biases exploration toward the goal. Same bones, better navigation.",
    },
  ],
  selfChecks: [
    { id: "dij-intuition", label: "I understand why BFS isn't enough when edges have weights.", section: "intuition" },
    { id: "dij-run",       label: "I watched at least one full relaxation step change a distance.", section: "run" },
    { id: "dij-code",      label: "I understand why stale heap entries are safe (just skipped).",   section: "code" },
    { id: "dij-world",     label: "I can explain how A* is Dijkstra + a heuristic.",                section: "world" },
  ],
  worldExamples: [
    {
      product: "Google Maps, Apple Maps",
      problem: "Given current traffic, find the fastest driving route between two places.",
      how: "A weighted shortest-path problem. Production routing uses A* (Dijkstra plus a geographic heuristic) and contraction hierarchies, but Dijkstra's relaxation is the bones.",
    },
    {
      product: "Network routing protocols (OSPF)",
      problem: "Route packets between routers through the lowest-cost path.",
      how: "Each router computes Dijkstra across the link-state graph to know the next hop for every destination.",
    },
    {
      product: "Game pathfinding (for non-trivial terrain)",
      problem: "Move a unit across a grid where terrain has a movement cost.",
      how: "The grid is a graph with weighted edges. Dijkstra (or A*) picks the cheapest route, not just the one with fewest tiles.",
    },
  ],
  checkpoint: {
    question:
      "Why does Dijkstra require all edge weights to be non-negative?",
    choices: [
      {
        label:
          "Because finalizing a node's distance assumes no cheaper path can appear later — a negative edge could create one.",
        correct: true,
        because:
          "Exactly. The moment we pop a node from the heap we commit to its distance, trusting that every remaining option is at least as expensive. A negative edge can undercut that commitment by offering a discount after the fact. That's why Bellman-Ford (which re-relaxes) is the tool when negatives are in play.",
      },
      {
        label:
          "Because the priority queue can't store negative numbers.",
        because:
          "Priority queues are happy with negatives — they're just numbers. The problem isn't storage, it's the guarantee Dijkstra makes when it finalizes a node.",
      },
      {
        label:
          "Because the graph would have cycles and the algorithm would loop forever.",
        because:
          "Dijkstra handles cycles fine, even with positive weights. The issue with negatives isn't looping; it's that a future edge can retroactively improve a finalized distance.",
      },
      {
        label:
          "Because negative weights make the shortest path undefined.",
        because:
          "Not quite — negative-weight cycles make shortest paths undefined (you can loop to reduce cost forever). A single negative edge on an acyclic path is fine conceptually; it's Dijkstra's finalization strategy that breaks.",
      },
    ],
    exercisePrompt:
      "On the graph above (undirected, with weights as drawn), from A to G, what is the shortest-path cost? Type a number.",
    exerciseAnswer: "7",
    reflectionPrompt:
      "In your own words: what does Dijkstra know that BFS doesn't?",
  },
  graph: cityGraph,
  startNode: "A",
  goalNode: "G",
  run: runDijkstra,
};
