"use client";

import { useState } from "react";

/**
 * Interactive queue primer. The learner presses "enqueue" to add a letter
 * to the back; "dequeue" pulls one off the front. The goal is that they
 * *feel* FIFO in their fingers before BFS ever appears.
 */
export function QueueDemo() {
  const [items, setItems] = useState<string[]>(["A", "B", "C"]);
  const [next, setNext] = useState(3); // D is next
  const [lastAction, setLastAction] = useState<string | null>(null);

  const letter = (i: number) => String.fromCharCode(65 + (i % 26));

  const enqueue = () => {
    const l = letter(next);
    setItems((s) => [...s, l]);
    setNext((n) => n + 1);
    setLastAction(`enqueued ${l} to the back`);
  };

  const dequeue = () => {
    if (items.length === 0) {
      setLastAction("queue is empty — nothing to take");
      return;
    }
    const head = items[0];
    setItems((s) => s.slice(1));
    setLastAction(`dequeued ${head} from the front`);
  };

  const reset = () => {
    setItems(["A", "B", "C"]);
    setNext(3);
    setLastAction(null);
  };

  return (
    <div className="card-ink--quiet p-5 md:p-6 space-y-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <div className="font-hand text-ochre text-xl">the queue</div>
          <p className="font-display text-ink text-lg">FIFO — first in, first out.</p>
        </div>
        <div className="text-xs text-ink-quiet font-mono">
          {items.length} {items.length === 1 ? "item" : "items"}
        </div>
      </div>

      {/* Rail */}
      <div className="relative">
        <div className="flex items-stretch gap-0 border-2 border-ink/80 rounded-sm bg-parchment-sun overflow-hidden min-h-[64px]">
          {/* FRONT label */}
          <div className="shrink-0 w-14 flex items-center justify-center border-r border-parchment-edge bg-parchment-deep/70">
            <span className="font-hand text-xs text-vermilion leading-none rotate-[-2deg]">
              front ↤
            </span>
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-2 overflow-x-auto">
            {items.length === 0 ? (
              <span className="font-hand text-ink-ghost italic">empty</span>
            ) : (
              items.map((item, i) => (
                <QueueChip
                  key={`${item}-${i}`}
                  label={item}
                  isFront={i === 0}
                  isBack={i === items.length - 1}
                />
              ))
            )}
          </div>
          <div className="shrink-0 w-14 flex items-center justify-center border-l border-parchment-edge bg-parchment-deep/70">
            <span className="font-hand text-xs text-verdigris leading-none rotate-[2deg]">
              ↦ back
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          className="btn-ink text-sm !py-2"
          onClick={enqueue}
        >
          enqueue {letter(next)}
        </button>
        <button
          type="button"
          className="btn-quiet text-sm !py-2"
          onClick={dequeue}
          disabled={items.length === 0}
        >
          dequeue (take the front)
        </button>
        <button
          type="button"
          className="btn-quiet text-sm !py-2 ml-auto"
          onClick={reset}
          aria-label="Reset queue"
        >
          reset
        </button>
      </div>

      {/* Narration */}
      <div
        className="pl-4 border-l-2 border-ochre/60 min-h-[2.25rem] flex items-center"
        aria-live="polite"
      >
        <p className="font-display italic text-ink-soft">
          {lastAction ??
            "Try it. Enqueue three or four letters, then dequeue them one by one. Notice which letter always leaves first."}
        </p>
      </div>
    </div>
  );
}

function QueueChip({
  label,
  isFront,
  isBack,
}: {
  label: string;
  isFront: boolean;
  isBack: boolean;
}) {
  return (
    <div
      className={[
        "inline-flex items-center justify-center w-12 h-12 rounded-sm border-2 font-mono text-lg shrink-0 animate-[ink-settle_300ms_var(--ease-paper)_both]",
        isFront
          ? "border-vermilion bg-vermilion-soft/40 text-ink"
          : isBack
            ? "border-verdigris bg-verdigris-soft/40 text-ink"
            : "border-parchment-edge bg-parchment-sun text-ink-soft",
      ].join(" ")}
    >
      {label}
    </div>
  );
}
