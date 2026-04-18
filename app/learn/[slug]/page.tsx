import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AlgorithmShell } from "@/components/AlgorithmShell";
import { getLesson, lessonSlugs, LESSONS } from "@/lib/lessons/registry";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return lessonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Not found" };
  return {
    title: `The Atlas — ${lesson.title}`,
    description: lesson.tagline,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const index = LESSONS.findIndex((l) => l.slug === lesson.slug);
  const next = LESSONS[index + 1];

  return (
    <>
      <AlgorithmShell lesson={lesson} />
      {next && (
        <div className="mx-auto max-w-6xl px-6 md:px-10 pb-24">
          <Link
            href={`/learn/${next.slug}`}
            className="block card-ink--quiet p-6 md:p-8 hover:border-ink/50 transition-colors group"
          >
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-hand text-ochre text-lg">next chapter —</span>
              <span className="text-xs text-ink-quiet font-mono">
                chapter {String(index + 2).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h3 className="font-display text-3xl text-ink leading-tight">
                {next.title}
              </h3>
              <span className="font-display italic text-ink-soft">
                {next.tagline}
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-soft group-hover:text-ochre transition-colors">
              continue the journey →
            </p>
          </Link>
        </div>
      )}
    </>
  );
}
