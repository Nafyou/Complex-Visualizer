"use client";

import { useEffect, useState } from "react";

interface Props {
  text: string;
  stepIndex: number;
  totalSteps: number;
}

export function Narration({ text, stepIndex, totalSteps }: Props) {
  // Retrigger the ink-settle animation on each step change.
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [text]);

  // min-height pinned so text length changes between steps never push
  // the layout below up or down (no shake).
  return (
    <div className="relative pl-5 min-h-28">
      <span
        aria-hidden
        className="absolute left-0 top-2 bottom-2 w-0.75 bg-ochre/70 rounded-full"
      />
      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-hand text-ochre text-xl">
          step {stepIndex + 1}
        </span>
        <span className="text-ink-quiet text-xs">
          of {totalSteps}
        </span>
      </div>
      <p
        key={animKey}
        className="font-display text-xl md:text-2xl leading-snug text-ink animate-[ink-settle_460ms_var(--ease-paper)_both]"
      >
        {text}
      </p>
    </div>
  );
}
