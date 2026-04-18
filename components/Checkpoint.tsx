"use client";

import { useState } from "react";
import type { CheckpointSpec } from "@/lib/algorithms/types";
import { useJourney } from "./JourneyProvider";

interface Props {
  slug: string;
  spec: CheckpointSpec;
}

export function Checkpoint({ slug, spec }: Props) {
  const { state, pass, note } = useJourney();
  const [picked, setPicked] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [reflection, setReflection] = useState(state.notes[slug] ?? "");

  const pickedChoice = picked !== null ? spec.choices[picked] : null;
  const questionCorrect = !!pickedChoice?.correct;
  const answerNormalized = answer.trim().toUpperCase().replace(/\s+/g, "");
  const expected = spec.exerciseAnswer.toUpperCase().replace(/\s+/g, "");
  const answerCorrect = answer.length > 0 && answerNormalized === expected;
  const isNumericAnswer = /^\d+(\.\d+)?$/.test(expected);
  const passed = state.checkpoints[slug]?.passedAt != null;
  const allDone = questionCorrect && answerCorrect && reflection.trim().length > 0;

  const handleSubmit = () => {
    if (!allDone) return;
    note(slug, reflection.trim());
    pass(slug, reflection.trim());
  };

  return (
    <section
      aria-labelledby={`checkpoint-${slug}`}
      className="card-ink p-6 md:p-8 space-y-7"
    >
      <header className="flex items-baseline justify-between gap-4 flex-wrap">
        <h2
          id={`checkpoint-${slug}`}
          className="font-display text-3xl text-ink"
        >
          Checkpoint
        </h2>
        <span className="font-hand text-lg text-ochre">
          {passed
            ? "you passed this one — revisit any time"
            : "three small parts. take your time."}
        </span>
      </header>

      {/* 1. Multiple-choice question */}
      <div>
        <p className="font-display text-xl text-ink mb-3">
          {spec.question}
        </p>
        <ol className="space-y-2">
          {spec.choices.map((c, i) => {
            const isPicked = picked === i;
            return (
              <li key={c.label}>
                <button
                  type="button"
                  onClick={() => setPicked(i)}
                  className={[
                    "w-full text-left px-4 py-3 border-2 rounded-sm transition-colors",
                    isPicked
                      ? c.correct
                        ? "border-verdigris bg-verdigris-soft/40"
                        : "border-vermilion bg-vermilion-soft/30"
                      : "border-parchment-edge hover:border-ink/40 hover:bg-parchment-deep/50",
                  ].join(" ")}
                  aria-pressed={isPicked}
                >
                  <span className="font-display text-lg text-ink">
                    {String.fromCharCode(65 + i)}.{" "}
                  </span>
                  <span className="text-ink-soft">{c.label}</span>
                  {isPicked && (
                    <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                      <span className="font-hand text-base text-ochre mr-2">
                        why:
                      </span>
                      {c.because}
                    </p>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* 2. Exercise */}
      <div>
        <p className="font-display text-xl text-ink mb-3">
          {spec.exercisePrompt}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-1 min-w-[16rem] font-mono text-base px-3 py-2 border-2 border-ink/70 rounded-sm bg-parchment-sun focus:border-ochre focus:outline-none"
            placeholder={isNumericAnswer ? "a number" : "A,B,C,…"}
            aria-label="Your answer"
            inputMode={isNumericAnswer ? "numeric" : "text"}
          />
          <span
            className={[
              "text-sm",
              answer.length === 0
                ? "text-ink-ghost"
                : answerCorrect
                  ? "text-verdigris"
                  : "text-vermilion",
            ].join(" ")}
            aria-live="polite"
          >
            {answer.length === 0
              ? isNumericAnswer
                ? "type a number"
                : "type the order, commas between"
              : answerCorrect
                ? "yes — that's it."
                : isNumericAnswer
                  ? "not quite — rerun and add the weights along the path."
                  : "not quite — replay the run and watch the data structure."}
          </span>
        </div>
      </div>

      {/* 3. Reflection */}
      <div>
        <p className="font-display text-xl text-ink mb-3">
          {spec.reflectionPrompt}
        </p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={3}
          className="w-full font-sans text-base px-4 py-3 border-2 border-ink/70 rounded-sm bg-parchment-sun focus:border-ochre focus:outline-none leading-relaxed"
          placeholder="Your answer becomes part of your journal."
          aria-label="Your reflection"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-parchment-edge">
        <span className="text-sm text-ink-quiet">
          {allDone
            ? "All three done. Mark this algorithm learned?"
            : "Complete the three parts above to save it to your journey."}
        </span>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allDone}
          className="btn-ink disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {passed ? "Re-save to journal" : "Save to journal"}
        </button>
      </div>
    </section>
  );
}
