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

export function GraphCanvasClient({ graph, step, height = 460 }: Props) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const didInitialScroll = useRef(false);

  useEffect(() => {
    if (!apiRef.current) return;
    const skeleton = buildSkeleton(graph, step);
    const elements = convertToExcalidrawElements(skeleton as never);
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
          scrollToContent: true,
        }}
        viewModeEnabled
        zenModeEnabled
        UIOptions={{ canvasActions: { saveToActiveFile: false, export: false } }}
      />
    </div>
  );
}
