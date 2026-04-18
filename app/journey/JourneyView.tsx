"use client";

import Link from "next/link";
import { useJourney } from "@/components/JourneyProvider";
import { LESSONS } from "@/lib/lessons/registry";

function formatWhen(ts: number) {
  const delta = Date.now() - ts;
  const min = 60_000;
  const hour = 60 * min;
  const day = 24 * hour;
  if (delta < min) return "just now";
  if (delta < hour) return `${Math.floor(delta / min)} min ago`;
  if (delta < day) return `${Math.floor(delta / hour)} hr ago`;
  if (delta < 7 * day) return `${Math.floor(delta / day)} days ago`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function JourneyView() {
  const { state, hydrated, reset } = useJourney();

  if (!hydrated) {
    return (
      <div className="text-ink-quiet text-sm">loading your journey…</div>
    );
  }

  const learned = LESSONS.filter((l) => state.checkpoints[l.slug]);
  const visited = LESSONS.filter(
    (l) => state.visits[l.slug] && !state.checkpoints[l.slug],
  );
  const untouched = LESSONS.filter(
    (l) => !state.visits[l.slug] && !state.checkpoints[l.slug],
  );

  const nothingYet = learned.length === 0 && visited.length === 0;

  return (
    <div className="space-y-14">
      {nothingYet && (
        <div className="card-ink p-8 space-y-3">
          <div className="font-hand text-ochre text-xl">a blank page —</div>
          <p className="font-display text-2xl text-ink leading-snug max-w-[40ch]">
            Nothing in your journal yet. That's the way journals begin.
          </p>
          <Link
            href={`/learn/${LESSONS[0].slug}`}
            className="btn-ink mt-2 inline-flex"
          >
            Start with {LESSONS[0].title.toLowerCase()} →
          </Link>
        </div>
      )}

      {learned.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="font-hand text-ochre text-xl">you've learned</span>
            <span className="h-px flex-1 bg-parchment-edge" aria-hidden />
          </div>
          <ul className="space-y-6">
            {learned.map((l) => {
              const cp = state.checkpoints[l.slug];
              const note = state.notes[l.slug];
              return (
                <li key={l.slug} className="card-ink--quiet p-6">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <Link
                      href={`/learn/${l.slug}`}
                      className="font-display text-2xl text-ink leading-tight hover:text-ochre transition-colors"
                    >
                      {l.title}
                    </Link>
                    <span className="text-xs font-mono text-verdigris">
                      ✓ passed · {formatWhen(cp.passedAt)}
                    </span>
                  </div>
                  {note && (
                    <blockquote className="mt-3 pl-4 border-l-2 border-ochre/60 italic text-ink-soft leading-relaxed max-w-[60ch]">
                      “{note}”
                    </blockquote>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {visited.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="font-hand text-ochre text-xl">you've opened</span>
            <span className="h-px flex-1 bg-parchment-edge" aria-hidden />
          </div>
          <ul className="space-y-3">
            {visited.map((l) => {
              const v = state.visits[l.slug];
              const checks = state.selfChecks[l.slug] ?? {};
              const ticked = Object.values(checks).filter(Boolean).length;
              const total = l.selfChecks?.length ?? 0;
              return (
                <li
                  key={l.slug}
                  className="flex items-baseline justify-between gap-4 py-3 border-b border-parchment-edge/70"
                >
                  <Link
                    href={`/learn/${l.slug}`}
                    className="font-display text-xl text-ink hover:text-ochre transition-colors"
                  >
                    {l.title}
                  </Link>
                  <div className="flex items-baseline gap-4 text-xs text-ink-quiet">
                    {total > 0 && (
                      <span className="font-mono" aria-label="Self-checks ticked">
                        {ticked}/{total} ticked
                      </span>
                    )}
                    <span className="font-mono">
                      last · {formatWhen(v.lastAt)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {untouched.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="font-hand text-ochre text-xl">still ahead</span>
            <span className="h-px flex-1 bg-parchment-edge" aria-hidden />
          </div>
          <ul className="space-y-1">
            {untouched.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/learn/${l.slug}`}
                  className="inline-flex items-baseline gap-2 py-2 text-ink-soft hover:text-ochre transition-colors"
                >
                  <span className="font-display text-lg">{l.title}</span>
                  <span className="font-display italic text-ink-quiet">
                    — {l.tagline}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!nothingYet && (
        <footer className="pt-10 border-t border-parchment-edge flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-ink-quiet max-w-[48ch]">
            Your journey lives in this browser's local storage. Clearing it
            deletes your notes and checkpoints — gone, not recoverable.
          </p>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Clear your entire journey? Notes, checkpoints, all of it — can't be undone.",
                )
              ) {
                reset();
              }
            }}
            className="btn-quiet text-sm"
          >
            Clear journey
          </button>
        </footer>
      )}
    </div>
  );
}
