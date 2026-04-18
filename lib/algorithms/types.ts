export type NodeId = string;

export interface GraphNode {
  id: NodeId;
  x: number;
  y: number;
  label?: string;
}

export interface GraphEdge {
  from: NodeId;
  to: NodeId;
  weight?: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed?: boolean;
}

export function edgeKey(from: NodeId, to: NodeId, directed = false) {
  if (directed) return `${from}->${to}`;
  return from < to ? `${from}--${to}` : `${to}--${from}`;
}

export interface Step {
  caption: string;
  visited: Set<NodeId>;
  current?: NodeId;
  frontier?: Set<string>;
  traversed?: Set<string>;
  path?: NodeId[];
  pathEdges?: Set<string>;
  dataStructure?: {
    kind: "queue" | "stack" | "heap";
    items: string[];
  };
  codeLine: number;
}

export interface WorldExample {
  product: string;
  problem: string;
  how: string;
}

export interface CheckpointSpec {
  question: string;
  choices: {
    label: string;
    correct?: boolean;
    because: string;
  }[];
  exercisePrompt: string;
  exerciseAnswer: string;
  reflectionPrompt: string;
}

export interface TeacherNote {
  when: "intuition" | "run" | "code" | "world" | "checkpoint";
  title: string;
  body: string;
}

export interface SelfCheckItem {
  id: string;
  label: string;
  /** Where to render the check-off inside the lesson layout. */
  section: "intuition" | "run" | "code" | "world";
}

export interface Lesson {
  slug: string;
  title: string;
  tagline: string;
  complexity: { time: string; space: string };
  intuitionLead: string;
  intuitionBody: string[];
  preSimulationNote?: string;
  /** TypeScript reference source — this one is line-synced to the canvas. */
  code: string;
  codeLanguage: "ts";
  /** Python translation of the same algorithm, shown for comparison. */
  pythonCode?: string;
  /** Short teacher-voice callouts placed at specific points in the page. */
  teacherNotes?: TeacherNote[];
  /** Micro-checkboxes the learner can tick as they feel it click. */
  selfChecks?: SelfCheckItem[];
  worldExamples: WorldExample[];
  checkpoint: CheckpointSpec;
  graph: Graph;
  startNode: NodeId;
  goalNode?: NodeId;
  run: (graph: Graph, start: NodeId, goal?: NodeId) => Step[];
}
