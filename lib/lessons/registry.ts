import type { Lesson } from "@/lib/algorithms/types";
import { bfsLesson } from "./bfs";
import { dfsLesson } from "./dfs";
import { dijkstraLesson } from "./dijkstra";

/**
 * The atlas of lessons, in reading order.
 * New algorithms are added here — one line — and become available at
 * /learn/[slug] automatically.
 */
export const LESSONS: Lesson[] = [bfsLesson, dfsLesson, dijkstraLesson];

export const LESSON_BY_SLUG: Record<string, Lesson> = Object.fromEntries(
  LESSONS.map((l) => [l.slug, l]),
);

export function getLesson(slug: string): Lesson | null {
  return LESSON_BY_SLUG[slug] ?? null;
}

export function lessonSlugs(): string[] {
  return LESSONS.map((l) => l.slug);
}
