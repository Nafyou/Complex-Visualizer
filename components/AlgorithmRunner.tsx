"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getLesson } from "@/lib/lessons/registry";
import { GraphCanvas } from "./GraphCanvas";
import { CodePanel } from "./CodePanel";
import { StepScrubber } from "./StepScrubber";
import { Narration } from "./Narration";
import { DataStructureStrip } from "./DataStructureStrip";
import { Legend } from "./Legend";
import { useJourney } from "./JourneyProvider";

interface Props {
  slug: string;
}

const SPEED_TO_MS: Record<number, number> = {
  0.5: 1600,
  1: 900,
  2: 420,
};

export function AlgorithmRunner({ slug }: Props) {
  const lesson = getLesson(slug);
  if (!lesson) {
    throw new Error(`Unknown algorithm: ${slug}`);
  }
  const steps = useMemo(
    () => lesson.run(lesson.graph, lesson.startNode, lesson.goalNode),
    [lesson],
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const { visit } = useJourney();
  const recordedRef = useRef(false);

  const step = steps[index];

  useEffect(() => {
    if (!playing) return;
    if (index >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setIndex((i) => i + 1), SPEED_TO_MS[speed] ?? 900);
    return () => window.clearTimeout(t);
  }, [playing, index, speed, steps.length]);

  // Record a visit exactly once when the learner first engages.
  useEffect(() => {
    if (recordedRef.current) return;
    if (index > 0 || playing) {
      visit(lesson.slug);
      recordedRef.current = true;
    }
  }, [index, playing, visit, lesson.slug]);

  return (
    <section
      aria-labelledby={`run-${lesson.slug}`}
      className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
    >
      <div className="space-y-4">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h2 id={`run-${lesson.slug}`} className="font-display text-3xl text-ink">
            The run
          </h2>
          <Legend />
        </div>
        <GraphCanvas graph={lesson.graph} step={step} />
        {/* The data structure sits right under the canvas — it's half the
            story of every step. BFS's queue. DFS's stack. Dijkstra's heap. */}
        <DataStructureStrip step={step} />
        <StepScrubber
          index={index}
          total={steps.length}
          playing={playing}
          speed={speed}
          onIndex={(i) => setIndex(i)}
          onPlay={() => {
            if (index >= steps.length - 1) setIndex(0);
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          onSpeed={setSpeed}
          onReset={() => {
            setPlaying(false);
            setIndex(0);
          }}
        />
        <Narration
          text={step.caption}
          stepIndex={index}
          totalSteps={steps.length}
        />
      </div>

      <div className="space-y-4">
        {/* Show Python in the step-synced panel when available — Python
            reads more clearly at this zoom level and the line numbers are
            authored to match the TS source line-for-line. Fall back to TS
            only if a lesson hasn't been translated. */}
        <CodePanel
          code={lesson.pythonCode ?? lesson.code}
          activeLine={step.codeLine}
          language={lesson.pythonCode ? "python" : "ts"}
        />
      </div>
    </section>
  );
}
