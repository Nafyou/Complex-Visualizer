import type { Metadata } from "next";
import Link from "next/link";
import { LESSONS } from "@/lib/lessons/registry";

export const metadata: Metadata = {
  title: "The Atlas — playground",
  description: "Draw your own graph and watch an algorithm run on it.",
};

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 md:px-10 pt-14 pb-24 animate-[page-reveal_700ms_var(--ease-paper)_both]">
      <header className="mb-10">
        <div className="flex items-center gap-3 text-ochre mb-3">
          <span className="font-hand text-xl">the —</span>
          <span className="h-px w-10 bg-ochre/50" aria-hidden />
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-ink leading-[1.02] tracking-tight">
          Playground
        </h1>
        <p className="mt-4 max-w-[58ch] font-display italic text-2xl text-ink-soft leading-snug">
          Draw your own graph. Pick an algorithm. Watch it run.
        </p>
      </header>

      <div className="rule mb-10" aria-hidden />

      <div className="card-ink p-8 space-y-4">
        <span className="font-hand text-ochre text-xl">a soft note —</span>
        <p className="font-display text-2xl text-ink leading-snug max-w-[44ch]">
          This chapter is being drafted.
        </p>
        <p className="text-ink-soft max-w-[60ch] leading-relaxed">
          The playground lets you construct a small graph by hand and run any
          of the atlas algorithms on it. It's a design challenge — Excalidraw
          is great for display but awkward for free-drawing structured graphs,
          so we're taking the time to make the authoring feel right rather
          than ship something half-formed.
        </p>
        <p className="text-ink-soft leading-relaxed max-w-[60ch]">
          In the meantime, every chapter in the atlas already lets you rewind
          and rerun the simulation on its sample graph. That's most of what
          the playground will do, with one more layer: your own nodes and
          edges.
        </p>
        <div className="flex items-center gap-4 flex-wrap pt-3">
          <Link href="/learn" className="btn-ink">
            Go to the atlas →
          </Link>
          <Link
            href={`/learn/${LESSONS[0].slug}`}
            className="btn-quiet"
          >
            Start with {LESSONS[0].title.toLowerCase()}
          </Link>
        </div>
      </div>

      <div className="mt-14">
        <span className="font-hand text-ochre text-lg">
          planned shape —
        </span>
        <ul className="mt-4 space-y-3 text-ink-soft">
          <li className="flex gap-3">
            <span className="font-display text-ink">01.</span>
            <span>
              A small Excalidraw canvas in <em>edit mode</em> — tap to add a
              node, drag between two nodes to add an edge, double-tap an edge
              to assign a weight.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-ink">02.</span>
            <span>
              A picker for the three atlas algorithms, plus "pick a start
              node" and "pick a goal node."
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-ink">03.</span>
            <span>
              The same scrubber you know from the atlas pages, replaying
              your custom graph.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-ink">04.</span>
            <span>
              Save-as-permalink so you can share an interesting little graph
              you built.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
