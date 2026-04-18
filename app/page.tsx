import Link from "next/link";
import { LESSONS } from "@/lib/lessons/registry";
import { SiteLogo } from "@/components/SiteLogo";

export default function Landing() {
  return (
    <div className="relative">
      {/* HERO ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 md:px-10 pt-14 md:pt-24 pb-20 animate-[page-reveal_900ms_var(--ease-paper)_both]">
        <div className="grid md:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] gap-10 md:gap-16 items-end">
          <div>
            <div className="flex items-center gap-3 text-ochre">
              <span className="font-hand text-xl">welcome —</span>
              <span className="h-px w-12 bg-ochre/50" aria-hidden />
            </div>
            <h1 className="mt-3 font-display text-5xl md:text-6xl leading-[1.02] tracking-tight text-balance">
              A journal for graphs.{" "}
              <em className="text-ink-soft">
                Hand-drawn. Step-by-step. Yours.
              </em>
            </h1>
            <p className="mt-6 font-display text-2xl md:text-3xl text-ink-soft max-w-[32ch] leading-snug italic">
              Not a dashboard. Not a drill book.{" "}
              <span className="mark-saffron not-italic text-ink">
                A place to think.
              </span>
            </p>
            <div className="mt-9 flex items-center gap-4 flex-wrap">
              <Link
                href="/learn/primer"
                className="btn-ink"
                aria-label="Start with the foundations primer"
              >
                Start with the foundations
                <span aria-hidden>→</span>
              </Link>
              <Link href="/learn" className="btn-quiet">
                See the atlas
              </Link>
              <span className="font-hand text-ochre text-lg ml-1">
                stacks, queues, graphs — then BFS, DFS, Dijkstra
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center gap-4 text-ink-soft">
            <HeroGraphic />
            <span className="font-hand text-lg text-ochre max-w-[22ch] text-center leading-tight rotate-[-1.5deg]">
              the ripple, the dive,<br />
              the weighted road
            </span>
          </div>
        </div>
      </section>

      {/* WHAT IT IS ────────────────────────────────────────────────── */}
      <section className="border-y-2 border-ink/10 bg-parchment-deep/40">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 grid md:grid-cols-3 gap-10">
          <ValueProp
            label="1."
            title="See it unfold."
            body="Every algorithm runs on an Excalidraw canvas, in wobbly ink. The current node glows; visited nodes fill; the path settles verdigris. You can scrub back and forth as many times as you need."
          />
          <ValueProp
            label="2."
            title="Read the code that did it."
            body="A code panel sits beside the canvas. The line that produced the current step lights up, synced to the drawing. Watch and read together — the way you'd watch someone teach you at a whiteboard."
          />
          <ValueProp
            label="3."
            title="Carry it with you."
            body="Your journey is yours. Checkpoints you've passed, notes you've written, reflections in your own words — kept in your browser, visible at /journey."
          />
        </div>
      </section>

      {/* THE ATLAS (preview) ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 md:px-10 py-20">
        <div className="flex items-baseline gap-3 mb-8">
          <span className="font-hand text-ochre text-xl">this is the —</span>
          <h2 className="font-display text-4xl text-ink">atlas</h2>
        </div>
        <p className="max-w-[58ch] text-ink-soft text-lg mb-10">
          A primer on the building blocks, then three chapters of algorithms.
          Same four-facet shape every time: intuition, the run, in the world,
          checkpoint. Consistency is the curriculum.
        </p>
        <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Chapter 00 — primer */}
          <li>
            <Link
              href="/learn/primer"
              className="block h-full card-ink--quiet p-6 hover:border-ink/60 transition-colors group"
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="font-hand text-ochre text-lg">chapter 00</span>
                <span className="font-mono text-xs text-ink-quiet">
                  ~10 min
                </span>
              </div>
              <h3 className="font-display text-2xl text-ink leading-tight">
                Foundations
              </h3>
              <p className="mt-2 font-display italic text-ink-soft">
                Stacks, queues, and a graph made of little pieces.
              </p>
              <div className="rule my-4" aria-hidden />
              <span className="text-sm text-ink-soft inline-flex items-center gap-1 group-hover:text-ochre transition-colors">
                begin here <span aria-hidden>→</span>
              </span>
            </Link>
          </li>
          {LESSONS.map((lesson, i) => (
            <li key={lesson.slug}>
              <Link
                href={`/learn/${lesson.slug}`}
                className="block h-full card-ink--quiet p-6 hover:border-ink/60 transition-colors group"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <span className="font-hand text-ochre text-lg">
                    chapter {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs text-ink-quiet">
                    {lesson.complexity.time}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-ink leading-tight">
                  {lesson.title}
                </h3>
                <p className="mt-2 font-display italic text-ink-soft">
                  {lesson.tagline}
                </p>
                <div className="rule my-4" aria-hidden />
                <span className="text-sm text-ink-soft inline-flex items-center gap-1 group-hover:text-ochre transition-colors">
                  begin this one <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* A LETTER ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 md:px-10 pb-28">
        <div className="flex items-center gap-3 mb-5">
          <SiteLogo size={24} className="text-ochre" />
          <span className="font-hand text-xl text-ochre">
            a short letter, before you begin
          </span>
        </div>
        <div className="prose-journal">
          <p>
            Graph algorithms are one of the most elegant ideas in computer
            science — and one of the most badly taught. Textbooks overwhelm
            with proofs; grinder sites overwhelm with problems. Somewhere
            between those is the place where understanding actually happens:
            watching the thing unfold, once, slowly, with someone explaining
            what each move means.
          </p>
          <p>
            That's what this is trying to be. Not comprehensive. Not gamified.
            Just a good companion for an afternoon — the kind that leaves you
            able to <em>explain</em> BFS to a friend without looking anything
            up.
          </p>
          <p>
            There's no login, no streak, no leaderboard. Your journey lives in
            your browser. Close the tab whenever. Come back whenever. The
            atlas will be here.
          </p>
        </div>
        <div className="mt-8 flex items-center gap-3">
          <Link href="/learn/primer" className="btn-ink">
            Begin <span aria-hidden>→</span>
          </Link>
          <span className="font-hand text-ochre text-lg">
            keep going —
          </span>
        </div>
      </section>
    </div>
  );
}

function ValueProp({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="space-y-3">
      <div className="font-display text-5xl text-ochre leading-none">{label}</div>
      <h3 className="font-display text-2xl text-ink leading-tight">{title}</h3>
      <p className="text-ink-soft max-w-[36ch]">{body}</p>
    </div>
  );
}

/**
 * A decorative hero — three small drawn graphs stacked to suggest the three
 * algorithms. Hand-wobbled paths and a single vermilion dot.
 */
function HeroGraphic() {
  return (
    <svg
      viewBox="0 0 200 220"
      width="200"
      height="220"
      className="animate-float"
      aria-hidden
    >
      {/* BFS: concentric rings */}
      <g transform="translate(100, 40)" stroke="#1F1B1A" fill="none">
        <path
          d="M0,0 m-26,-3 a27,25 -2 1 1 52,1 a27,25 -2 1 1 -52,-1 Z"
          strokeWidth="1.5" opacity="0.5"
        />
        <path
          d="M0,0 m-15,-1 a15,14 -2 1 1 30,1 a15,14 -2 1 1 -30,-1 Z"
          strokeWidth="1.5" opacity="0.7"
        />
        <circle cx="0" cy="0" r="4" fill="#C5462E" stroke="none" />
      </g>

      {/* DFS: zigzag dive */}
      <g transform="translate(100, 110)" stroke="#1F1B1A" fill="none" strokeWidth="1.5">
        <path d="M-40,-18 Q -30,-10 -18,-14" strokeLinecap="round" />
        <path d="M-18,-14 Q -4,2 8,-8" strokeLinecap="round" />
        <path d="M8,-8 Q 20,10 38,16" strokeLinecap="round" />
        <circle cx="-40" cy="-18" r="3.5" fill="#F4ECDC" />
        <circle cx="-18" cy="-14" r="3.5" fill="#C67A36" />
        <circle cx="8" cy="-8" r="3.5" fill="#C67A36" />
        <circle cx="38" cy="16" r="3.5" fill="#C5462E" />
      </g>

      {/* Dijkstra: weighted triangle with numbers */}
      <g transform="translate(100, 180)" stroke="#1F1B1A" fill="none" strokeWidth="1.5">
        <path d="M-34,6 Q -20,-4 -2,-16" strokeLinecap="round" />
        <path d="M-2,-16 Q 18,-4 32,6" strokeLinecap="round" />
        <path d="M-34,6 Q 0,14 32,6" strokeLinecap="round" stroke="#5E8A76" strokeWidth="2" />
        <circle cx="-34" cy="6" r="4" fill="#F4ECDC" />
        <circle cx="-2" cy="-16" r="4" fill="#F4ECDC" />
        <circle cx="32" cy="6" r="4" fill="#F4ECDC" />
      </g>

      {/* Hand-drawn brackets */}
      <text x="10" y="28" className="font-hand" fill="#C67A36" fontSize="13" fontFamily="var(--font-hand)">
        bfs
      </text>
      <text x="10" y="108" className="font-hand" fill="#C67A36" fontSize="13" fontFamily="var(--font-hand)">
        dfs
      </text>
      <text x="10" y="178" className="font-hand" fill="#C67A36" fontSize="13" fontFamily="var(--font-hand)">
        dijkstra
      </text>
    </svg>
  );
}
