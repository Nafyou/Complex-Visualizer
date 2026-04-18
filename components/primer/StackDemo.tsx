"use client";

import { useState } from "react";

/**
 * Interactive stack primer. "Push" puts a plate on top; "pop" takes the top
 * plate off. The plates stack upward visually so LIFO feels inevitable.
 */
export function StackDemo() {
  const [items, setItems] = useState<string[]>(["A", "B", "C"]);
  const [next, setNext] = useState(3);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const letter = (i: number) => String.fromCharCode(65 + (i % 26));

  const push = () => {
    const l = letter(next);
    setItems((s) => [...s, l]);
    setNext((n) => n + 1);
    setLastAction(`pushed ${l} onto the top`);
  };

  const pop = () => {
    if (items.length === 0) {
      setLastAction("stack is empty — nothing to pop");
      return;
    }
    const top = items[items.length - 1];
    setItems((s) => s.slice(0, -1));
    setLastAction(`popped ${top} off the top`);
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
          <div className="font-hand text-ochre text-xl">the stack</div>
          <p className="font-display text-ink text-lg">LIFO — last in, first out.</p>
        </div>
        <div className="text-xs text-ink-quiet font-mono">
          {items.length} {items.length === 1 ? "plate" : "plates"}
        </div>
      </div>

      {/* Tower */}
      <div className="relative">
        <div className="flex flex-col-reverse items-center gap-1.5 border-2 border-ink/80 rounded-sm bg-parchment-sun px-4 py-4 min-h-[220px] justify-start">
          {/* floor */}
          <div className="absolute left-4 right-4 bottom-2 h-[2px] bg-ink/60 rounded-full" />
          {items.length === 0 ? (
            <span className="font-hand text-ink-ghost italic self-center mb-4">
              empty
            </span>
          ) : (
            items.map((item, i) => (
              <StackPlate
                key={`${item}-${i}`}
                label={item}
                isTop={i === items.length - 1}
                isBottom={i === 0}
              />
            ))
          )}
        </div>
        <span className="absolute top-2 right-3 font-hand text-xs text-vermilion rotate-[-4deg]">
          ↥ top
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          className="btn-ink text-sm !py-2"
          onClick={push}
        >
          push {letter(next)}
        </button>
        <button
          type="button"
          className="btn-quiet text-sm !py-2"
          onClick={pop}
          disabled={items.length === 0}
        >
          pop (take the top)
        </button>
        <button
          type="button"
          className="btn-quiet text-sm !py-2 ml-auto"
          onClick={reset}
          aria-label="Reset stack"
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
            "Push three or four letters. Now pop them. Notice which letter comes off first — it's the one you just put on."}
        </p>
      </div>
    </div>
  );
}

function StackPlate({
  label,
  isTop,
  isBottom,
}: {
  label: string;
  isTop: boolean;
  isBottom: boolean;
}) {
  return (
    <div
      className={[
        "w-[75%] max-w-[220px] h-11 rounded-sm border-2 flex items-center justify-center font-mono text-lg animate-[ink-settle_300ms_var(--ease-paper)_both]",
        isTop
          ? "border-vermilion bg-vermilion-soft/40 text-ink"
          : "border-parchment-edge bg-parchment-sun text-ink-soft",
        isBottom ? "mb-2" : "",
      ].join(" ")}
    >
      {label}
      {isTop && (
        <span className="font-hand text-xs text-vermilion ml-2 leading-none">
          — next to pop
        </span>
      )}
    </div>
  );
}
