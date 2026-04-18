"use client";

import { useEffect, useRef } from "react";

interface Props {
  code: string;
  activeLine: number;
}

export function CodePanel({ code, activeLine }: Props) {
  const lines = code.split("\n");
  const activeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeLine]);

  return (
    <div className="card-ink--quiet overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-parchment-edge bg-parchment-deep/50">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block w-2.5 h-2.5 rounded-full bg-vermilion/70"
          />
          <span
            aria-hidden
            className="inline-block w-2.5 h-2.5 rounded-full bg-ochre/70"
          />
          <span
            aria-hidden
            className="inline-block w-2.5 h-2.5 rounded-full bg-verdigris/70"
          />
        </div>
        <span className="font-hand text-ochre text-base">the code</span>
      </div>
      <pre
        className="font-mono text-[13.5px] leading-[1.7] overflow-auto max-h-[460px] text-ink"
        aria-label="Algorithm source, step-synced"
      >
        {lines.map((line, i) => {
          const lineNumber = i + 1;
          const isActive = lineNumber === activeLine;
          return (
            <div
              key={lineNumber}
              ref={isActive ? activeRef : null}
              className={[
                "flex px-4 py-[2px] transition-colors duration-200",
                isActive ? "code-line-active" : "",
              ].join(" ")}
            >
              <span
                aria-hidden
                className="inline-block w-6 text-right pr-3 text-ink-ghost select-none shrink-0"
              >
                {lineNumber}
              </span>
              <span className="whitespace-pre">{line || " "}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
