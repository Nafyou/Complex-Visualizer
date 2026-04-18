export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-ink/10">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-10 grid sm:grid-cols-3 gap-8">
        <div>
          <div className="font-display text-xl text-ink">The Atlas</div>
          <p className="mt-2 text-sm text-ink-quiet max-w-[36ch]">
            A journal for graph algorithms. Built as a place to think, not
            a place to grind.
          </p>
        </div>

        <div className="text-sm">
          <div className="font-display text-ink-soft mb-2">What's inside</div>
          <ul className="space-y-1 text-ink-quiet">
            <li>— Breadth-first search</li>
            <li>— Depth-first search</li>
            <li>— Dijkstra (shortest path)</li>
            <li>— More, soon.</li>
          </ul>
        </div>

        <div className="text-sm">
          <div className="font-display text-ink-soft mb-2">Along the way</div>
          <ul className="space-y-1 text-ink-quiet">
            <li>Excalidraw for the drawings</li>
            <li>Next.js 16 + Tailwind v4</li>
            <li>Typeset in Fraunces &amp; Source Serif</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-parchment-edge">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-5 flex items-center justify-between text-xs text-ink-quiet">
          <span>Made for curious people.</span>
          <span className="font-hand text-base text-ochre">
            keep going —
          </span>
        </div>
      </div>
    </footer>
  );
}
