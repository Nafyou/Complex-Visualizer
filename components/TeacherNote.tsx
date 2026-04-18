import type { TeacherNote as TeacherNoteType } from "@/lib/algorithms/types";

interface Props {
  notes: TeacherNoteType[] | undefined;
  when: TeacherNoteType["when"];
}

/**
 * A warm, teacher-voice callout. Rendered inline at specific points in a
 * lesson so the pedagogy feels present — "the teacher just leaned over the
 * desk to point something out."
 */
export function TeacherNotes({ notes, when }: Props) {
  const filtered = notes?.filter((n) => n.when === when) ?? [];
  if (filtered.length === 0) return null;

  return (
    <div className="space-y-3 max-w-[62ch]">
      {filtered.map((n, i) => (
        <div
          key={i}
          className="relative pl-5 py-3 pr-4 bg-parchment-deep/40 border-l-4 border-ochre rounded-r-sm"
        >
          <span
            aria-hidden
            className="absolute -left-0.5 top-0 bottom-0 w-1 bg-ochre/70 rounded-full"
          />
          <div className="font-hand text-ochre text-base leading-none mb-1.5">
            the teacher says —
          </div>
          <p className="font-display text-lg text-ink leading-snug">
            {n.title}
          </p>
          <p className="mt-1 text-ink-soft leading-relaxed">{n.body}</p>
        </div>
      ))}
    </div>
  );
}
