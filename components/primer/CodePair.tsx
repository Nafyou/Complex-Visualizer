"use client";

import { useState } from "react";

interface Snippet {
  language: "ts" | "py";
  label: string;
  code: string;
}

interface Props {
  title?: string;
  caption?: string;
  snippets: Snippet[];
  /** When "pair": show side-by-side on md+. When "tabs": always tabbed. */
  layout?: "pair" | "tabs";
}

/**
 * Show the same idea in two languages. On wide screens we put them
 * side-by-side; on narrow, we tab between them.
 */
export function CodePair({
  title,
  caption,
  snippets,
  layout = "pair",
}: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      {(title || caption) && (
        <div className="space-y-1">
          {title && (
            <h3 className="font-display text-xl text-ink leading-tight">
              {title}
            </h3>
          )}
          {caption && (
            <p className="text-ink-soft text-sm max-w-[62ch]">{caption}</p>
          )}
        </div>
      )}

      {layout === "pair" ? (
        <>
          {/* Tabs on small screens */}
          <div className="md:hidden">
            <Tabs
              snippets={snippets}
              active={active}
              onPick={setActive}
            />
            <CodeBlock snippet={snippets[active]} />
          </div>
          {/* Pair on md+ */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {snippets.map((s) => (
              <CodeBlock key={s.label} snippet={s} />
            ))}
          </div>
        </>
      ) : (
        <>
          <Tabs snippets={snippets} active={active} onPick={setActive} />
          <CodeBlock snippet={snippets[active]} />
        </>
      )}
    </div>
  );
}

function Tabs({
  snippets,
  active,
  onPick,
}: {
  snippets: Snippet[];
  active: number;
  onPick: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 mb-2">
      {snippets.map((s, i) => (
        <button
          key={s.label}
          type="button"
          onClick={() => onPick(i)}
          className={[
            "px-3 py-1.5 text-sm rounded-sm border-2",
            active === i
              ? "border-ink bg-ink text-parchment"
              : "border-parchment-edge text-ink-soft hover:bg-parchment-deep/60",
          ].join(" ")}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

function CodeBlock({ snippet }: { snippet: Snippet }) {
  return (
    <div className="card-ink--quiet overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-parchment-edge bg-parchment-deep/50">
        <span className="font-hand text-ochre text-base">
          {snippet.label}
        </span>
        <span className="text-[10px] font-mono text-ink-quiet uppercase tracking-wider">
          {snippet.language === "ts" ? "typescript" : "python"}
        </span>
      </div>
      <pre className="font-mono text-[13.5px] leading-[1.7] overflow-x-auto px-4 py-3 text-ink">
        {snippet.code}
      </pre>
    </div>
  );
}
