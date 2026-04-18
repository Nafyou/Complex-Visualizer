import { runDFS, dfsSource, dfsSourcePython } from "@/lib/algorithms/dfs";
import { cityGraph } from "@/lib/sample-graphs";
import type { Lesson } from "@/lib/algorithms/types";

export const dfsLesson: Lesson = {
  slug: "dfs",
  title: "Depth-first search",
  tagline: "Follow a thread all the way to the end, then back up.",
  complexity: { time: "O(V + E)", space: "O(V)" },
  intuitionLead:
    "DFS explores a graph the way you explore a cave: pick a tunnel, walk until it ends, then back up and try the next one.",
  intuitionBody: [
    "Where BFS spreads out in rings, DFS commits. It dives down one path as far as it can — then, and only then, retraces to the last unexplored fork. It's an instinct we already have: it's how we search a hedge maze, how we trace a family tree branch, how we peel an onion.",
    "The magic is a stack instead of a queue. Pop the most recent, not the oldest. Pushing a neighbor means 'I'll come back to this one next.' Popping means 'I'm done here, where was I before?'",
    "DFS won't find the shortest path. What it will find is a path — reliably, with very little memory — and it happens to expose the deep structure of a graph: cycles, bridges, connected components.",
  ],
  preSimulationNote:
    "Watch the visited wash travel in a line, not a ring. The stack at the side is what holds DFS's memory of 'places I meant to come back to.'",
  code: dfsSource,
  codeLanguage: "ts",
  pythonCode: dfsSourcePython,
  teacherNotes: [
    {
      when: "run",
      title: "watch the stack",
      body:
        "DFS's stack only ever grows at the top. When we pop, we always pop the most recent push. Look at the 'next to pop' marker — it's following the thread we just committed to.",
    },
    {
      when: "code",
      title: "iterative vs recursive",
      body:
        "Many intros teach DFS recursively — and recursion IS the most natural expression of it (the call stack IS the stack). We use an explicit stack here so you can *see* it. Both versions do the same thing; recursion just hides the data structure inside the language runtime.",
    },
    {
      when: "world",
      title: "not for shortest paths",
      body:
        "DFS will find *a* path. It won't find the *shortest* one. If you need shortest, you want BFS (unweighted) or Dijkstra (weighted). DFS's superpower is structural — finding cycles, ordering dependencies, exploring exhaustively.",
    },
  ],
  selfChecks: [
    { id: "dfs-intuition", label: "I can describe the 'dive then back up' pattern in my own words.", section: "intuition" },
    { id: "dfs-run",       label: "I watched the stack grow and shrink through a full run.",        section: "run" },
    { id: "dfs-code",      label: "I get why DFS uses a stack (explicit or via recursion).",         section: "code" },
    { id: "dfs-world",     label: "I can name one place DFS is the right tool.",                     section: "world" },
  ],
  worldExamples: [
    {
      product: "File-system walkers (find, ripgrep, rsync)",
      problem: "Visit every file under a directory.",
      how: "Recurse into each folder fully before moving to its sibling — classic DFS on the directory tree.",
    },
    {
      product: "Topological sort in build tools",
      problem: "Schedule tasks when some depend on others (make, npm, webpack).",
      how: "A DFS that emits each node when it finishes gives a valid build order in reverse.",
    },
    {
      product: "Cycle detection in type checkers",
      problem: "Find circular imports or recursive type references.",
      how: "While DFS-ing the dependency graph, if you ever step onto a node you're currently inside, you've found a cycle.",
    },
  ],
  checkpoint: {
    question:
      "Your DFS visits A, then B, then D. Now the stack holds [C, E]. Which node is visited next — and why?",
    choices: [
      {
        label: "E, because the stack pops its most recent push.",
        correct: true,
        because:
          "Yes — E was pushed onto the stack after C, so E is on top. That's the 'dive deeper first' behavior that makes DFS DFS.",
      },
      {
        label: "C, because C comes before E alphabetically.",
        because:
          "Alphabetical order isn't what DFS respects — the stack does. The order in which things were *pushed* decides what comes out next, regardless of name.",
      },
      {
        label: "A, because DFS revisits the start.",
        because:
          "DFS marks nodes visited and never revisits them in a loop — that would be infinite on any graph with cycles.",
      },
      {
        label: "It depends on the graph's edge weights.",
        because:
          "Plain DFS doesn't look at weights at all. Think of it as choosing its next step by recency of push, nothing else.",
      },
    ],
    exercisePrompt:
      "Starting at A on the graph above, searching for G, neighbors expanded in alphabetical order (pushed onto the stack reversed, so A's first dive is into B): in what order does DFS mark nodes as visited before it reaches G?",
    exerciseAnswer: "A,B,D,C,F,G",
    reflectionPrompt:
      "In your own words: name one kind of problem where DFS is the right tool, and one where it isn't.",
  },
  graph: cityGraph,
  startNode: "A",
  goalNode: "G",
  run: runDFS,
};
