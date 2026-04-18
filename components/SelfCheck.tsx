"use client";

import { useJourney } from "./JourneyProvider";
import type { SelfCheckItem } from "@/lib/algorithms/types";

interface Props {
  slug: string;
  items: SelfCheckItem[];
  section: SelfCheckItem["section"];
  /** Label shown on the card header. Defaults to "does it click?". */
  heading?: string;
}

/**
 * A tiny self-assessment block. Sits at the end of a lesson section so the
 * learner can tick off what actually landed before moving on. Ticks are
 * saved to the journey journal immediately.
 */
export function SelfCheck({
  slug,
  items,
  section,
  heading = "does it click?",
}: Props) {
  const { state, toggleCheck, hydrated } = useJourney();
  const rows = items.filter((i) => i.section === section);
  if (rows.length === 0) return null;

  const ticked = state.selfChecks[slug] ?? {};

  return (
    <aside
      aria-label="Self-check"
      className="card-ink--quiet p-5 md:p-6 max-w-[60ch]"
    >
      <div className="flex items-baseline justify-between mb-3">
        <span className="font-hand text-ochre text-lg">{heading}</span>
        <span className="text-[11px] font-mono text-ink-quiet">
          {hydrated
            ? `${rows.filter((r) => ticked[r.id]).length} / ${rows.length} ticked`
            : "—"}
        </span>
      </div>
      <ul className="space-y-2">
        {rows.map((item) => {
          const checked = !!ticked[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggleCheck(slug, item.id)}
                aria-pressed={checked}
                className="w-full text-left flex items-start gap-3 py-2 px-2 -mx-2 rounded-sm hover:bg-parchment-deep/50 transition-colors"
              >
                <span
                  aria-hidden
                  className={[
                    "mt-0.5 w-5 h-5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors",
                    checked
                      ? "border-verdigris bg-verdigris text-parchment"
                      : "border-ink/60 bg-parchment-sun",
                  ].join(" ")}
                >
                  {checked && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6.5 L 5 9 L 10 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span
                  className={[
                    "leading-snug",
                    checked ? "text-ink-quiet line-through" : "text-ink-soft",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
