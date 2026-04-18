import { runBFS, bfsSource, bfsSourcePython } from "@/lib/algorithms/bfs";
import { cityGraph } from "@/lib/sample-graphs";
import type { Lesson } from "@/lib/algorithms/types";

export const bfsLesson: Lesson = {
  slug: "bfs",
  title: "Breadth-first search",
  tagline: "A wave spreading out from where you start.",
  complexity: { time: "O(V + E)", space: "O(V)" },
  intuitionLead:
    "BFS explores a graph the way a ripple explores a pond — closest things first, then farther, then farthest.",
  intuitionBody: [
    "If you shout in a canyon, the echo reaches the closest walls first, then the farther ones. Breadth-first search listens to a graph the same way. It keeps a line of nodes waiting to be visited, and always takes the one that has been waiting longest.",
    "That line is called a queue — first in, first out. Every time we look at a node, we add its new neighbors to the back of the queue. By the time we reach a node, we've already seen everything closer.",
    "Because of that, BFS finds the shortest path measured in number of hops. Not distance, not cost — hops. That's its superpower and its boundary.",
  ],
  preSimulationNote:
    "Watch how the ochre wash spreads outward in rings. The current node is the one we're looking at right now; the vermilion edges are what we're about to consider.",
  code: bfsSource,
  codeLanguage: "ts",
  pythonCode: bfsSourcePython,
  teacherNotes: [
    {
      when: "run",
      title: "what to watch for",
      body:
        "Keep an eye on the queue panel. Every time a node is popped from the front, its un-visited neighbors are added to the back. The queue never 'jumps' — it's strictly FIFO. That's the whole trick.",
    },
    {
      when: "code",
      title: "why a Set for `visited`?",
      body:
        "If we used an array, checking 'have I seen this?' would cost O(n) each time. A Set (or Python set) does it in O(1). On a 50-node graph it doesn't matter; on a social graph of 50 million, it's the difference between 'instant' and 'never finishes'.",
    },
    {
      when: "world",
      title: "a small honest caveat",
      body:
        "BFS finds the shortest path by number of edges — not by cost. If roads have travel times, you want Dijkstra, not BFS. BFS is perfect when every 'step' is equal: hops in a social graph, moves in a puzzle, links from a starting page.",
    },
  ],
  selfChecks: [
    { id: "bfs-intuition", label: "I can explain the 'ripple' metaphor in my own words.", section: "intuition" },
    { id: "bfs-run",       label: "I watched at least one full run end-to-end.",           section: "run" },
    { id: "bfs-code",      label: "I understand why a queue, and why Set for visited.",    section: "code" },
    { id: "bfs-world",     label: "I can name one real system that uses BFS.",             section: "world" },
  ],
  worldExamples: [
    {
      product: "Web crawlers",
      problem: "Discover pages from a seed URL without drilling deep too fast.",
      how: "Crawlers BFS the link graph so they see a breadth of sites before sinking into any one domain.",
    },
    {
      product: "Friends-of-friends on social graphs",
      problem: "Find people two or three connections away — and in what order.",
      how: "BFS from you yields rings: direct friends, then their friends. Levels fall out for free.",
    },
    {
      product: "Puzzle solvers (Rubik's, sliding tiles)",
      problem: "Find the shortest sequence of moves to reach a target state.",
      how: "States are nodes, moves are edges; BFS guarantees the first time you see the goal, you've used the fewest moves.",
    },
  ],
  checkpoint: {
    question:
      "Why does BFS find the shortest path in number of hops, but not necessarily the cheapest path when edges have weights?",
    choices: [
      {
        label: "Because the queue always pops the node added earliest, not the cheapest.",
        correct: true,
        because:
          "Exactly. BFS treats every edge as weight 1. The first time it reaches a node, that's via the fewest edges — but 'fewest edges' and 'cheapest' aren't the same once weights exist. That's precisely where Dijkstra picks up.",
      },
      {
        label: "Because BFS uses a stack and stacks don't understand distance.",
        because:
          "BFS uses a queue, not a stack. Swapping the queue for a stack would give you DFS, which doesn't find shortest paths at all.",
      },
      {
        label: "Because BFS doesn't remember which nodes it has visited.",
        because:
          "BFS does remember — that's the 'visited' set. Without it, BFS wouldn't terminate on graphs with cycles. This isn't what weights change.",
      },
      {
        label: "Because weighted graphs can have negative edges.",
        because:
          "Negative edges are their own problem (they break Dijkstra too). But even with all-positive weights, BFS still fails on them because it ignores weight entirely.",
      },
    ],
    exercisePrompt:
      "Starting at A on the graph above, in what order does BFS mark nodes as visited? Type the visit order as comma-separated letters (e.g., A,B,C).",
    exerciseAnswer: "A,B,C,D,E,F,G",
    reflectionPrompt:
      "In your own words: when would you reach for BFS instead of DFS? (One sentence.)",
  },
  graph: cityGraph,
  startNode: "A",
  goalNode: "G",
  run: runBFS,
};
