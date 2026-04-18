"use client";

import { useEffect } from "react";

interface Props {
  index: number;
  total: number;
  playing: boolean;
  speed: number;
  onIndex: (i: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onSpeed: (s: number) => void;
  onReset: () => void;
}

export function StepScrubber({
  index,
  total,
  playing,
  speed,
  onIndex,
  onPlay,
  onPause,
  onSpeed,
  onReset,
}: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" ||
          (e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") onIndex(Math.min(index + 1, total - 1));
      if (e.key === "ArrowLeft") onIndex(Math.max(index - 1, 0));
      if (e.key === " ") {
        e.preventDefault();
        playing ? onPause() : onPlay();
      }
      if (e.key === "r" || e.key === "R") onReset();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, total, playing, onIndex, onPlay, onPause, onReset]);

  const pct = total > 1 ? (index / (total - 1)) * 100 : 0;

  return (
    <div className="card-ink--quiet p-4 md:p-5">
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          className="btn-ink"
          onClick={playing ? onPause : onPlay}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "Pause" : "Play"}
          <kbd className="ml-1 text-[10px] opacity-70 font-mono">space</kbd>
        </button>
        <div className="flex items-center gap-1">
          <IconButton
            label="Previous step"
            onClick={() => onIndex(Math.max(index - 1, 0))}
            disabled={index === 0}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M10 2 L4 7 L10 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
          <IconButton
            label="Next step"
            onClick={() => onIndex(Math.min(index + 1, total - 1))}
            disabled={index === total - 1}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M4 2 L10 7 L4 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
        </div>

        <div className="ml-auto flex items-center gap-1 text-xs text-ink-quiet">
          <span className="font-hand text-base text-ink-soft mr-1">speed</span>
          {[0.5, 1, 2].map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => onSpeed(s)}
              className={[
                "px-2 py-1 rounded-sm border",
                speed === s
                  ? "border-ink bg-ink text-parchment"
                  : "border-parchment-edge text-ink-soft hover:bg-parchment-deep/60",
              ].join(" ")}
            >
              {s}×
            </button>
          ))}
          <button
            type="button"
            onClick={onReset}
            className="ml-2 btn-quiet !py-1 !px-2 text-xs"
            aria-label="Reset"
          >
            Reset <kbd className="text-[10px] opacity-70 font-mono ml-1">r</kbd>
          </button>
        </div>
      </div>

      <label className="block">
        <span className="sr-only">Scrub steps</span>
        <div className="scrubber-track">
          <div className="scrubber-fill" style={{ width: `${pct}%` }} />
          <input
            type="range"
            min={0}
            max={total - 1}
            value={index}
            onChange={(e) => onIndex(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Scrub steps"
          />
          <span
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 rounded-full bg-ink border-2 border-parchment shadow-sm transition-[left] duration-150"
            style={{ left: `${pct}%` }}
          />
        </div>
      </label>
      <div className="mt-2 flex justify-between text-xs text-ink-quiet">
        <span>step 1</span>
        <span className="font-mono">{index + 1} / {total}</span>
        <span>step {total}</span>
      </div>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className="w-9 h-9 inline-flex items-center justify-center border-[1.5px] border-parchment-edge rounded-sm text-ink-soft hover:text-ink hover:bg-parchment-deep/60 disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
