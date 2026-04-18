"use client";

import Link from "next/link";
import { useJourney } from "./JourneyProvider";

export function JourneyBadge() {
  const { state, hydrated } = useJourney();
  const learned = Object.keys(state.checkpoints).length;
  const visited = Object.keys(state.visits).length;

  return (
    <Link
      href="/journey"
      className="group inline-flex items-center gap-2 text-xs text-ink-quiet hover:text-ink transition-colors"
      aria-label={`Your journey: ${learned} learned, ${visited} visited`}
    >
      <span
        className="relative inline-block w-2.5 h-2.5 rounded-full bg-ochre"
        aria-hidden
      >
        <span className="absolute inset-0 rounded-full bg-ochre animate-[blink_1.4s_ease-in-out_infinite] opacity-60" />
      </span>
      <span className="font-hand text-base leading-none text-ink-soft">
        {hydrated ? (
          learned > 0 ? `${learned} learned` : visited > 0 ? `${visited} visited` : "begin"
        ) : "\u00a0"}
      </span>
    </Link>
  );
}
