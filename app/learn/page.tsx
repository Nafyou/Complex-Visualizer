import Link from "next/link";
import type { Metadata } from "next";
import { LESSONS } from "@/lib/lessons/registry";

export const metadata: Metadata = {
  title: "The Atlas — the atlas",
  description: "Every algorithm in the Atlas, in reading order.",
};

export default function AtlasIndex() {
  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10 pt-14 pb-24 animate-[page-reveal_700ms_var(--ease-paper)_both]">
      <header className="mb-14">
        <div className="flex items-center gap-3 text-ochre mb-3">
          <span className="font-hand text-xl">the</span>
          <span className="h-px w-10 bg-ochre/50" aria-hidden />
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-ink leading-[1.02] tracking-tight">
          Atlas
        </h1>
        <p className="mt-4 max-w-[60ch] font-display italic text-2xl text-ink-soft leading-snug">
          Three chapters, each the same shape:{" "}
          <span className="not-italic text-ink">intuition</span>,{" "}
          <span className="not-italic text-ink">the run</span>,{" "}
          <span className="not-italic text-ink">in the world</span>,{" "}
          <span className="not-italic text-ink">checkpoint</span>.
        </p>
      </header>

      <div className="rule" aria-hidden />

      <ol className="mt-10 space-y-10">
        {/* Chapter 00 — foundations */}
        <li>
          <Link
            href="/learn/primer"
            className="group grid md:grid-cols-[auto_minmax(0,1fr)_auto] gap-6 md:gap-10 items-start hover:translate-x-0.5 transition-transform"
          >
            <div className="font-display text-6xl text-ochre leading-none w-16">
              00
            </div>
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="font-display text-4xl text-ink leading-tight">
                  Foundations
                </h2>
                <span className="font-hand text-ochre text-lg">
                  start here
                </span>
              </div>
              <p className="mt-1 font-display text-2xl italic text-ink-soft max-w-[56ch]">
                Stacks, queues, and a graph made of little pieces.
              </p>
              <p className="mt-4 max-w-[62ch] text-ink-soft leading-relaxed">
                Before the algorithms: the primitives they rely on. Interactive
                queue and stack demos, a tour of what a graph even is, and
                side-by-side TypeScript + Python for how to build one in code.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1 text-xs text-ink-quiet pt-2">
              <div>
                <span className="font-hand text-base text-ink-soft">takes · </span>
                <span className="font-mono text-ink">~10 min</span>
              </div>
              <span className="mt-2 text-ink-soft group-hover:text-ochre transition-colors">
                open →
              </span>
            </div>
          </Link>
          <div className="rule mt-10" aria-hidden />
        </li>

        {LESSONS.map((lesson, i) => (
          <li key={lesson.slug}>
            <Link
              href={`/learn/${lesson.slug}`}
              className="group grid md:grid-cols-[auto_minmax(0,1fr)_auto] gap-6 md:gap-10 items-start hover:translate-x-0.5 transition-transform"
            >
              <div className="font-display text-6xl text-ochre leading-none w-16">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="font-display text-4xl text-ink leading-tight">
                    {lesson.title}
                  </h2>
                  <span className="font-hand text-ochre text-lg">
                    chapter {i + 1}
                  </span>
                </div>
                <p className="mt-1 font-display text-2xl italic text-ink-soft max-w-[56ch]">
                  {lesson.tagline}
                </p>
                <p className="mt-4 max-w-[62ch] text-ink-soft leading-relaxed">
                  {lesson.intuitionLead}
                </p>
              </div>
              <div className="hidden md:flex flex-col items-end gap-1 text-xs text-ink-quiet pt-2">
                <div>
                  <span className="font-hand text-base text-ink-soft">time · </span>
                  <span className="font-mono text-ink">{lesson.complexity.time}</span>
                </div>
                <div>
                  <span className="font-hand text-base text-ink-soft">space · </span>
                  <span className="font-mono text-ink">{lesson.complexity.space}</span>
                </div>
                <span className="mt-2 text-ink-soft group-hover:text-ochre transition-colors">
                  open →
                </span>
              </div>
            </Link>
            {i < LESSONS.length - 1 && <div className="rule mt-10" aria-hidden />}
          </li>
        ))}
      </ol>

      <div className="mt-20 pt-10 border-t border-parchment-edge">
        <p className="font-hand text-xl text-ochre max-w-[48ch] leading-tight">
          more coming — topological sort, union-find, A*, minimum spanning tree.
          the atlas grows as I write.
        </p>
      </div>
    </div>
  );
}
