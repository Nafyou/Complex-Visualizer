"use client";

import { Excalidraw, convertToExcalidrawElements } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
import { useEffect, useRef } from "react";
import { buildSkeleton } from "@/lib/excalidraw/scene";
import type { Graph, Step } from "@/lib/algorithms/types";

interface Props {
  graph: Graph;
  step: Step;
  height?: number;
}

/**
 * Note on the "shake" bug, because the fix here is non-obvious:
 *
 * Excalidraw renders arrows with rough.js. Rough.js randomizes every stroke
 * from two inputs: a `seed` (stable per element) and the element's identity.
 * When we call `updateScene` with fresh `convertToExcalidrawElements(...)`
 * output, the helper by default *regenerates every element id* — which makes
 * Excalidraw treat them as brand-new elements, invalidating the shape cache
 * and re-rolling the wobble on every step. Passing `regenerateIds: false`
 * keeps our skeleton ids and lets the cache hit, so the graph stops shaking.
 *
 * We also only ever call `scrollToContent` exactly once (on mount) — otherwise
 * the viewport subtly re-fits on every step and reads as shake.
 */
export function GraphCanvasClient({ graph, step, height = 460 }: Props) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const didInitialScroll = useRef(false);

  useEffect(() => {
    if (!apiRef.current) return;
    const skeleton = buildSkeleton(graph, step);
    const elements = convertToExcalidrawElements(skeleton as never, {
      regenerateIds: false,
    });
    apiRef.current.updateScene({ elements });

    if (!didInitialScroll.current) {
      queueMicrotask(() => {
        apiRef.current?.scrollToContent(elements, {
          fitToContent: true,
          animate: false,
        });
        didInitialScroll.current = true;
      });
    }
  }, [graph, step]);

  return (
    <div className="canvas-frame w-full overflow-hidden" style={{ height }}>
      <Excalidraw
        excalidrawAPI={(api) => {
          apiRef.current = api;
        }}
        initialData={{
          appState: {
            viewBackgroundColor: "#FAF3E4",
            theme: "light",
            currentItemStrokeColor: "#1F1B1A",
            currentItemBackgroundColor: "#F4ECDC",
            currentItemRoughness: 1,
          },
          // No `scrollToContent: true` here — we do it manually on mount via
          // scrollToContent() so it fires exactly once.
        }}
        viewModeEnabled
        zenModeEnabled
        UIOptions={{ canvasActions: { saveToActiveFile: false, export: false } }}
      />
    </div>
  );
}
