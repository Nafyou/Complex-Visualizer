"use client";

import { Excalidraw, convertToExcalidrawElements } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
import { useEffect, useRef, useState } from "react";
import { buildSkeleton } from "@/lib/excalidraw/scene";
import type { Graph, Step } from "@/lib/algorithms/types";

interface Props {
  graph: Graph;
  step: Step;
  height?: number;
}

/**
 * Two non-obvious things this component does:
 *
 *  1. **The API handle lives in React state, not a ref.** Excalidraw sets
 *     the API asynchronously via a callback *after* first render. If we
 *     stash it in a ref, our `useEffect` has already run once with the
 *     ref still `null` — so the initial scene never paints, and the
 *     graph doesn't appear until the learner first hits Play. Putting the
 *     API in state re-runs the effect the moment it becomes available.
 *
 *  2. **We pass `regenerateIds: false` to `convertToExcalidrawElements`.**
 *     By default the helper replaces every id with a fresh random one,
 *     which makes Excalidraw's WeakMap shape cache miss on every step
 *     (the cache is keyed on element identity). Stable ids keep the cache
 *     hitting, so the rough.js geometry is reused instead of re-rolled.
 *     Combined with stable seeds and stable stroke widths in scene.ts,
 *     this is what stops the canvas from shaking between steps.
 */
export function GraphCanvasClient({ graph, step, height = 460 }: Props) {
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const didInitialFit = useRef(false);

  useEffect(() => {
    if (!api) return;
    const skeleton = buildSkeleton(graph, step);
    const elements = convertToExcalidrawElements(skeleton as never, {
      regenerateIds: false,
    });
    api.updateScene({ elements });

    if (!didInitialFit.current) {
      // Fit the viewport exactly once, on the first successful paint.
      // Subsequent step changes must not re-fit (that reads as shake).
      queueMicrotask(() => {
        api.scrollToContent(elements, { fitToContent: true, animate: false });
        didInitialFit.current = true;
      });
    }
  }, [api, graph, step]);

  return (
    <div className="canvas-frame w-full overflow-hidden" style={{ height }}>
      <Excalidraw
        excalidrawAPI={setApi}
        initialData={{
          appState: {
            viewBackgroundColor: "#FAF3E4",
            theme: "light",
            currentItemStrokeColor: "#1F1B1A",
            currentItemBackgroundColor: "#F4ECDC",
            currentItemRoughness: 1,
          },
        }}
        viewModeEnabled
        zenModeEnabled
        UIOptions={{ canvasActions: { saveToActiveFile: false, export: false } }}
      />
    </div>
  );
}
