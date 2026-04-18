export function Legend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-soft">
      <Chip color="bg-parchment-sun border-ink" label="unvisited" />
      <Chip color="bg-vermilion-soft border-vermilion" label="current" />
      <Chip color="bg-ochre-soft border-ochre" label="visited" />
      <Chip color="bg-verdigris-soft border-verdigris" label="on the path" />
    </div>
  );
}

function Chip({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className={`inline-block w-3.5 h-3.5 rounded-full border-2 ${color}`}
      />
      <span>{label}</span>
    </span>
  );
}
