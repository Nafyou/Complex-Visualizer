import type { Graph } from "./algorithms/types";

// A pleasant, deliberately asymmetric graph, positioned for a 720x420 canvas.
// Coordinates are in Excalidraw world units.
export const cityGraph: Graph = {
  directed: false,
  nodes: [
    { id: "A", x: 80,  y: 220 },
    { id: "B", x: 230, y: 120 },
    { id: "C", x: 230, y: 320 },
    { id: "D", x: 380, y: 200 },
    { id: "E", x: 530, y: 110 },
    { id: "F", x: 530, y: 310 },
    { id: "G", x: 680, y: 210 },
  ],
  edges: [
    { from: "A", to: "B", weight: 2 },
    { from: "A", to: "C", weight: 3 },
    { from: "B", to: "D", weight: 1 },
    { from: "C", to: "D", weight: 4 },
    { from: "D", to: "E", weight: 2 },
    { from: "D", to: "F", weight: 3 },
    { from: "E", to: "G", weight: 2 },
    { from: "F", to: "G", weight: 1 },
    { from: "B", to: "E", weight: 5 },
    { from: "C", to: "F", weight: 6 },
  ],
};
