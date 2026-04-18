import Link from "next/link";
import type { Metadata } from "next";
import { QueueDemo } from "@/components/primer/QueueDemo";
import { StackDemo } from "@/components/primer/StackDemo";
import { CodePair } from "@/components/primer/CodePair";
import { MarginNote } from "@/components/MarginNote";
import { LESSONS } from "@/lib/lessons/registry";

export const metadata: Metadata = {
  title: "The Atlas — foundations",
  description:
    "Before the algorithms: what a graph is, what a queue is, what a stack is, and how to build them in TypeScript and Python.",
};

const first = LESSONS[0];

export default function PrimerPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 md:px-10 pt-10 pb-24 space-y-20 animate-[page-reveal_700ms_var(--ease-paper)_both]">
      {/* Header */}
      <header className="space-y-4">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-sm text-ink-quiet hover:text-ink transition-colors"
        >
          <span aria-hidden>←</span>
          <span>back to the atlas</span>
        </Link>
        <div>
          <div className="font-hand text-ochre text-xl">chapter 00 · primer</div>
          <h1 className="font-display font-light text-5xl md:text-6xl leading-[1.02] text-ink tracking-tight -mt-1">
            Foundations
          </h1>
          <p className="mt-2 font-display text-2xl text-ink-soft italic max-w-[42ch]">
            Stacks, queues, and a graph made of little pieces.
          </p>
        </div>
        <div className="rule mt-2" aria-hidden />
        <p className="prose-journal pt-2">
          Before we run any algorithm, we need a handful of mental models.{" "}
          <em>What's a graph? What's a queue? What's a stack?</em> Ten minutes
          here saves you an hour of confusion later — every algorithm in this
          atlas is a small dance on top of these pieces.
        </p>
      </header>

      {/* 1. What is a graph */}
      <section className="grid-atlas">
        <div className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="font-hand text-ochre text-xl">first —</span>
            <h2 className="font-display text-3xl text-ink">what a graph is</h2>
          </div>
          <p className="font-display text-2xl md:text-3xl text-ink leading-snug max-w-[36ch]">
            <span className="mark-saffron">
              A graph is dots and lines.
            </span>{" "}
            That's almost the whole definition.
          </p>
          <div className="prose-journal">
            <p>
              The dots are called <strong>nodes</strong> (or vertices). They
              stand for whatever you want — cities, people, web pages, states
              of a puzzle. The lines between them are <strong>edges</strong>.
              They mean "these two are connected" — and sometimes they carry
              extra information, like a <em>weight</em> (distance, cost, time).
            </p>
            <p>
              Edges can go one way (<em>directed</em>) or both ways
              (<em>undirected</em>). A directed edge is an arrow — a one-way
              street, a Twitter follow, a function calling another. An
              undirected edge is a plain line — a road that works both
              directions, a Facebook friendship.
            </p>
            <p>
              That's it. You now have enough to understand most graph
              algorithms in existence. The drawings in this atlas are
              graphs; the sample the algorithms run on is a graph; the
              cities you route between are graphs.
            </p>
          </div>
        </div>
        <div className="hidden lg:flex flex-col gap-8 pt-10">
          <MarginNote tilt="left">
            everything — web,<br />
            map, family tree —<br />
            is a graph if you<br />
            squint at it right.
          </MarginNote>
          <GraphDiagram />
        </div>
      </section>

      <div className="rule" aria-hidden />

      {/* 2. The queue */}
      <section className="space-y-6">
        <div className="flex items-baseline gap-3">
          <span className="font-hand text-ochre text-xl">next —</span>
          <h2 className="font-display text-3xl text-ink">
            the queue
          </h2>
        </div>
        <p className="prose-journal">
          A queue is your spot in line at the bakery.{" "}
          <strong>First in, first served.</strong> Or, in CS-speak,{" "}
          <span className="font-mono text-sm">FIFO — First In, First Out</span>.
          You <em>enqueue</em> (join the back) and <em>dequeue</em> (leave
          from the front). That's the whole data structure.
        </p>
        <p className="prose-journal">
          Try it below. Enqueue a few letters, then dequeue them. Notice{" "}
          <span className="mark-saffron">
            the letter that always leaves first is the one you put in first
          </span>
          . That's the property that makes BFS (the next chapter) find shortest
          paths by hops.
        </p>
        <QueueDemo />
        <CodePair
          title="A queue in code"
          caption="Two ways to build the exact same thing. Arrays give you enqueue/dequeue in both languages; Python's deque does it faster at scale."
          snippets={[
            {
              language: "ts",
              label: "TypeScript",
              code: `// A queue with a plain array.
const queue: string[] = [];

queue.push("A");        // enqueue
queue.push("B");        // enqueue
queue.push("C");        // enqueue
const first = queue.shift();   // → "A"  (dequeue)
const second = queue.shift();  // → "B"
console.log(queue);            // → ["C"]`,
            },
            {
              language: "py",
              label: "Python",
              code: `# Python has a proper FIFO deque.
from collections import deque

queue = deque()
queue.append("A")        # enqueue
queue.append("B")        # enqueue
queue.append("C")        # enqueue
first = queue.popleft()  # → "A"  (dequeue)
second = queue.popleft() # → "B"
print(queue)             # → deque(["C"])`,
            },
          ]}
        />
      </section>

      <div className="rule" aria-hidden />

      {/* 3. The stack */}
      <section className="space-y-6">
        <div className="flex items-baseline gap-3">
          <span className="font-hand text-ochre text-xl">then —</span>
          <h2 className="font-display text-3xl text-ink">
            the stack
          </h2>
        </div>
        <p className="prose-journal">
          A stack is a pile of plates in the sink.{" "}
          <strong>Last in, first out.</strong> In CS-speak,{" "}
          <span className="font-mono text-sm">LIFO — Last In, First Out</span>.
          You <em>push</em> (add to the top) and <em>pop</em> (take the top).
          Same two operations, opposite end.
        </p>
        <p className="prose-journal">
          Try it. Push a few letters; pop them. Notice{" "}
          <span className="mark-saffron">
            the last letter you put on is the first to come off
          </span>
          . That's the property that makes DFS go deep before wide.
        </p>
        <StackDemo />
        <CodePair
          title="A stack in code"
          caption="Arrays are native stacks in both languages — push/pop to the end."
          snippets={[
            {
              language: "ts",
              label: "TypeScript",
              code: `const stack: string[] = [];

stack.push("A");  // push
stack.push("B");  // push
stack.push("C");  // push
const top = stack.pop();   // → "C"  (pop)
const next = stack.pop();  // → "B"
console.log(stack);        // → ["A"]`,
            },
            {
              language: "py",
              label: "Python",
              code: `stack = []

stack.append("A")   # push
stack.append("B")   # push
stack.append("C")   # push
top = stack.pop()   # → "C"  (pop)
nxt = stack.pop()   # → "B"
print(stack)        # → ["A"]`,
            },
          ]}
        />
      </section>

      <div className="rule" aria-hidden />

      {/* 4. A graph in code */}
      <section className="space-y-6">
        <div className="flex items-baseline gap-3">
          <span className="font-hand text-ochre text-xl">finally —</span>
          <h2 className="font-display text-3xl text-ink">
            a graph in code
          </h2>
        </div>
        <p className="prose-journal">
          How do we give a graph to a computer? The most common way is an{" "}
          <strong>adjacency list</strong> — a map from each node to its list
          of neighbors. It's compact, it's fast enough for almost any graph
          you'll meet, and it reads well.
        </p>
        <p className="prose-journal">
          Below is the exact graph we'll use for the algorithm chapters,
          written in both languages. Read both. They're doing the same thing.
        </p>
        <CodePair
          title="The city graph as an adjacency list"
          caption="Seven nodes, ten edges, undirected. We'll run BFS, DFS, and Dijkstra on this one."
          snippets={[
            {
              language: "ts",
              label: "TypeScript",
              code: `// Adjacency list — each node → array of {neighbor, weight}.
type Edge = { to: string; weight: number };
const graph: Record<string, Edge[]> = {
  A: [{ to: "B", weight: 2 }, { to: "C", weight: 3 }],
  B: [{ to: "A", weight: 2 }, { to: "D", weight: 1 }, { to: "E", weight: 5 }],
  C: [{ to: "A", weight: 3 }, { to: "D", weight: 4 }, { to: "F", weight: 6 }],
  D: [{ to: "B", weight: 1 }, { to: "C", weight: 4 },
      { to: "E", weight: 2 }, { to: "F", weight: 3 }],
  E: [{ to: "B", weight: 5 }, { to: "D", weight: 2 }, { to: "G", weight: 2 }],
  F: [{ to: "C", weight: 6 }, { to: "D", weight: 3 }, { to: "G", weight: 1 }],
  G: [{ to: "E", weight: 2 }, { to: "F", weight: 1 }],
};

// neighbors of a node:
for (const { to, weight } of graph["A"]) {
  console.log(\`A → \${to} costs \${weight}\`);
}`,
            },
            {
              language: "py",
              label: "Python",
              code: `# Adjacency list — each node → list of (neighbor, weight).
graph = {
    "A": [("B", 2), ("C", 3)],
    "B": [("A", 2), ("D", 1), ("E", 5)],
    "C": [("A", 3), ("D", 4), ("F", 6)],
    "D": [("B", 1), ("C", 4), ("E", 2), ("F", 3)],
    "E": [("B", 5), ("D", 2), ("G", 2)],
    "F": [("C", 6), ("D", 3), ("G", 1)],
    "G": [("E", 2), ("F", 1)],
}

# neighbors of a node:
for to, weight in graph["A"]:
    print(f"A → {to} costs {weight}")`,
            },
          ]}
        />
        <div className="card-ink--quiet p-5 md:p-6">
          <div className="font-hand text-ochre text-lg mb-2">
            the teacher, quietly —
          </div>
          <p className="prose-journal text-base">
            Two small notes before you move on. <strong>One:</strong> an{" "}
            <em>undirected</em> graph is usually stored with the edge listed{" "}
            <em>both ways</em> — look above: <code className="font-mono text-sm">A</code>{" "}
            lists <code className="font-mono text-sm">B</code> as a neighbor,{" "}
            <em>and</em> <code className="font-mono text-sm">B</code> lists{" "}
            <code className="font-mono text-sm">A</code>. For a directed graph
            you'd only list it one way.{" "}
            <strong>Two:</strong> if weights don't matter (BFS, DFS) you can
            drop them entirely and use{" "}
            <code className="font-mono text-sm">{`Record<string, string[]>`}</code>.
          </p>
        </div>
      </section>

      <div className="rule" aria-hidden />

      {/* Wrap + continue */}
      <section>
        <Link
          href={`/learn/${first.slug}`}
          className="block card-ink--quiet p-6 md:p-8 hover:border-ink/50 transition-colors group"
        >
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-hand text-ochre text-lg">next chapter —</span>
            <span className="text-xs text-ink-quiet font-mono">chapter 01</span>
          </div>
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h3 className="font-display text-3xl text-ink leading-tight">
              {first.title}
            </h3>
            <span className="font-display italic text-ink-soft">
              {first.tagline}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-soft group-hover:text-ochre transition-colors">
            now that you have a queue in your head, let's put it to work →
          </p>
        </Link>
      </section>
    </article>
  );
}

/**
 * Small decorative graph — four nodes, three edges — for the "what is a graph"
 * margin. Deliberately hand-drawn-ish.
 */
function GraphDiagram() {
  return (
    <svg viewBox="0 0 220 200" className="w-full max-w-[240px]" aria-hidden>
      {/* edges */}
      <path
        d="M50 50 Q 100 45 160 55"
        stroke="#1F1B1A" strokeWidth="1.8" fill="none" strokeLinecap="round"
      />
      <path
        d="M50 50 Q 65 110 55 160"
        stroke="#1F1B1A" strokeWidth="1.8" fill="none" strokeLinecap="round"
      />
      <path
        d="M160 55 Q 165 115 145 160"
        stroke="#1F1B1A" strokeWidth="1.8" fill="none" strokeLinecap="round"
      />
      <path
        d="M55 160 Q 100 170 145 160"
        stroke="#1F1B1A" strokeWidth="1.8" fill="none" strokeLinecap="round"
      />

      {/* nodes */}
      <Node cx={50}  cy={50}  label="A" fill="#E3B37D" />
      <Node cx={160} cy={55}  label="B" fill="#FAF3E4" />
      <Node cx={55}  cy={160} label="C" fill="#FAF3E4" />
      <Node cx={145} cy={160} label="D" fill="#FAF3E4" />

      {/* margin label */}
      <text
        x="14" y="16"
        className="font-hand"
        fontFamily="var(--font-hand), cursive"
        fontSize="13"
        fill="#C67A36"
      >
        dots + lines
      </text>
    </svg>
  );
}

function Node({
  cx, cy, label, fill,
}: { cx: number; cy: number; label: string; fill: string }) {
  return (
    <g>
      <ellipse
        cx={cx} cy={cy} rx="16" ry="15"
        stroke="#1F1B1A" strokeWidth="1.8" fill={fill}
      />
      <text
        x={cx} y={cy + 4} textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontSize="12" fill="#1F1B1A"
      >
        {label}
      </text>
    </g>
  );
}
