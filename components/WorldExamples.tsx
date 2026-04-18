import type { WorldExample } from "@/lib/algorithms/types";

interface Props {
  examples: WorldExample[];
}

export function WorldExamples({ examples }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {examples.map((ex, i) => (
        <article
          key={ex.product}
          className="card-ink--quiet p-5 flex flex-col"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <span className="font-hand text-ochre text-lg mb-1">
            in the world
          </span>
          <h3 className="font-display text-2xl text-ink leading-tight">
            {ex.product}
          </h3>
          <div className="rule my-3" aria-hidden />
          <p className="text-ink-soft mb-3">
            <span className="font-display text-ink">Problem · </span>
            {ex.problem}
          </p>
          <p className="text-ink-quiet text-sm leading-relaxed mt-auto">
            {ex.how}
          </p>
        </article>
      ))}
    </div>
  );
}
