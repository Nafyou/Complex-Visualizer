"use client";

import type { Step } from "@/lib/algorithms/types";

interface Props {
  step: Step;
}

const KIND_LABEL: Record<NonNullable<Step["dataStructure"]>["kind"], string> = {
  queue: "the queue (FIFO)",
  stack: "the stack (LIFO)",
  heap: "the priority queue",
};

const FRONT_LABEL: Record<NonNullable<Step["dataStructure"]>["kind"], string> = {
  queue: "↤ front",
  stack: "↥ top",
  heap: "↤ min",
};

export function DataStructureStrip({ step }: Props) {
  const ds = step.dataStructure;
  if (!ds) return null;

  // min-height reserves room for two wrapped rows of chips, so adding or
  // removing items from the queue/stack doesn't jolt the layout below.
  return (
    <div className="card-ink--quiet p-4 min-h-24">
      <div className="flex items-center justify-between mb-2">
        <span className="font-hand text-ochre text-lg">
          {KIND_LABEL[ds.kind]}
        </span>
        <span className="text-xs text-ink-quiet">
          {ds.items.length} {ds.items.length === 1 ? "item" : "items"}
        </span>
      </div>
      {ds.items.length === 0 ? (
        <div className="font-hand text-ink-ghost italic">empty</div>
      ) : (
        <ol className="flex flex-wrap gap-1.5" aria-label={KIND_LABEL[ds.kind]}>
          {ds.items.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className={[
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border-2 font-mono text-sm",
                i === 0
                  ? "border-vermilion bg-vermilion-soft/40 text-ink"
                  : "border-parchment-edge bg-parchment-sun text-ink-soft",
              ].join(" ")}
            >
              {i === 0 && (
                <span className="font-hand text-xs text-vermilion -mr-0.5">
                  {FRONT_LABEL[ds.kind]}
                </span>
              )}
              {item}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
