import type { Metadata } from "next";
import { JourneyView } from "./JourneyView";

export const metadata: Metadata = {
  title: "The Atlas — your journey",
  description: "Where you've been, what you've learned, and what you've written.",
};

export default function JourneyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 md:px-10 pt-14 pb-24 animate-[page-reveal_700ms_var(--ease-paper)_both]">
      <header className="mb-10">
        <div className="flex items-center gap-3 text-ochre mb-3">
          <span className="font-hand text-xl">your —</span>
          <span className="h-px w-10 bg-ochre/50" aria-hidden />
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-ink leading-[1.02] tracking-tight">
          Journey
        </h1>
        <p className="mt-4 max-w-[58ch] font-display italic text-2xl text-ink-soft leading-snug">
          What you've looked at. What you've finished. What you've said about
          it, in your own words.
        </p>
        <p className="mt-5 max-w-[60ch] text-sm text-ink-quiet">
          Stored in your browser. Not on a server. Yours to keep or clear.
        </p>
      </header>
      <div className="rule mb-10" aria-hidden />
      <JourneyView />
    </div>
  );
}
