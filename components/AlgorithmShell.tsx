import Link from "next/link";
import type { Lesson } from "@/lib/algorithms/types";
import { WorldExamples } from "./WorldExamples";
import { Checkpoint } from "./Checkpoint";
import { MarginNote } from "./MarginNote";
import { AlgorithmRunner } from "./AlgorithmRunner";
import { TeacherNotes } from "./TeacherNote";
import { SelfCheck } from "./SelfCheck";
import { CodePair } from "./primer/CodePair";

interface Props {
  lesson: Lesson;
}

export function AlgorithmShell({ lesson }: Props) {
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
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="font-hand text-ochre text-xl">chapter</div>
            <h1 className="font-display font-light text-5xl md:text-6xl leading-[1.02] text-ink tracking-tight -mt-1">
              {lesson.title}
            </h1>
            <p className="mt-2 font-display text-2xl text-ink-soft italic">
              {lesson.tagline}
            </p>
          </div>
          <dl className="flex gap-7 text-sm">
            <div>
              <dt className="text-ink-quiet text-xs uppercase tracking-wider">Time</dt>
              <dd className="font-mono text-ink">{lesson.complexity.time}</dd>
            </div>
            <div>
              <dt className="text-ink-quiet text-xs uppercase tracking-wider">Space</dt>
              <dd className="font-mono text-ink">{lesson.complexity.space}</dd>
            </div>
          </dl>
        </div>
        <div className="rule mt-2" aria-hidden />
      </header>

      {/* 1. Intuition */}
      <section aria-labelledby={`intuition-${lesson.slug}`} className="grid-atlas">
        <div className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="font-hand text-ochre text-xl">first —</span>
            <h2 id={`intuition-${lesson.slug}`} className="font-display text-3xl text-ink">
              the intuition
            </h2>
          </div>
          <p className="font-display text-2xl md:text-3xl text-ink leading-snug max-w-[36ch]">
            <span className="mark-saffron">{lesson.intuitionLead}</span>
          </p>
          <div className="prose-journal">
            {lesson.intuitionBody.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <TeacherNotes notes={lesson.teacherNotes} when="intuition" />
          {lesson.selfChecks && (
            <SelfCheck slug={lesson.slug} items={lesson.selfChecks} section="intuition" />
          )}
        </div>
        <div className="hidden lg:flex flex-col gap-8 pt-10">
          <MarginNote tilt="left">
            the queue remembers.<br />
            the stack forgets.
          </MarginNote>
          <MarginNote tilt="right">
            same graph, same start —<br />
            different shape of exploring.
          </MarginNote>
          <div className="pt-2 text-xs text-ink-quiet border-l-2 border-parchment-edge pl-3">
            new to queues or stacks?{" "}
            <Link href="/learn/primer" className="text-ochre hover:underline">
              visit the primer →
            </Link>
          </div>
        </div>
      </section>

      <div className="rule" aria-hidden />

      {/* 2. The run */}
      <section className="space-y-6">
        {lesson.preSimulationNote && (
          <p className="font-hand text-lg text-ochre/90 max-w-[60ch]">
            {lesson.preSimulationNote}
          </p>
        )}
        <AlgorithmRunner slug={lesson.slug} />
        <TeacherNotes notes={lesson.teacherNotes} when="run" />
        {lesson.selfChecks && (
          <SelfCheck slug={lesson.slug} items={lesson.selfChecks} section="run" />
        )}
      </section>

      <div className="rule" aria-hidden />

      {/* 2b. The code in two languages */}
      {lesson.pythonCode && (
        <>
          <section
            aria-labelledby={`code-${lesson.slug}`}
            className="space-y-6"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-hand text-ochre text-xl">also —</span>
              <h2 id={`code-${lesson.slug}`} className="font-display text-3xl text-ink">
                the same idea, in two languages
              </h2>
            </div>
            <p className="prose-journal">
              The run panel above highlights the TypeScript version step by step.
              Here it is again, next to its Python twin. Read them together —
              every line on the left has a mirror on the right.
            </p>
            <CodePair
              snippets={[
                {
                  language: "ts",
                  label: "TypeScript",
                  code: lesson.code,
                },
                {
                  language: "py",
                  label: "Python",
                  code: lesson.pythonCode,
                },
              ]}
            />
            <TeacherNotes notes={lesson.teacherNotes} when="code" />
            {lesson.selfChecks && (
              <SelfCheck slug={lesson.slug} items={lesson.selfChecks} section="code" />
            )}
          </section>
          <div className="rule" aria-hidden />
        </>
      )}

      {/* 3. In the world */}
      <section aria-labelledby={`world-${lesson.slug}`} className="space-y-6">
        <div className="flex items-baseline gap-3">
          <span className="font-hand text-ochre text-xl">then —</span>
          <h2 id={`world-${lesson.slug}`} className="font-display text-3xl text-ink">
            in the world
          </h2>
        </div>
        <p className="text-ink-soft max-w-[66ch]">
          Every algorithm is an abstraction over something people actually do.
          Here are three places this one shows up.
        </p>
        <WorldExamples examples={lesson.worldExamples} />
        <TeacherNotes notes={lesson.teacherNotes} when="world" />
        {lesson.selfChecks && (
          <SelfCheck slug={lesson.slug} items={lesson.selfChecks} section="world" />
        )}
      </section>

      <div className="rule" aria-hidden />

      {/* 4. Checkpoint */}
      <Checkpoint slug={lesson.slug} spec={lesson.checkpoint} />
    </article>
  );
}
