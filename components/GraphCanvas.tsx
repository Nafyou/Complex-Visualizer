"use client";

import dynamic from "next/dynamic";
import { CanvasSkeleton } from "./CanvasSkeleton";

export const GraphCanvas = dynamic(
  () => import("./GraphCanvas.client").then((m) => m.GraphCanvasClient),
  { ssr: false, loading: () => <CanvasSkeleton /> },
);
