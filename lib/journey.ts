export interface JourneyState {
  version: 2;
  visits: Record<string, { firstAt: number; lastAt: number; steps: number }>;
  checkpoints: Record<string, { passedAt: number; note?: string }>;
  notes: Record<string, string>;
  /** slug → { selfCheckId → true }.  Micro-progress between "visited" and
   *  "passed the full checkpoint". */
  selfChecks: Record<string, Record<string, boolean>>;
}

const KEY = "atlas-journey";

export function emptyJourney(): JourneyState {
  return {
    version: 2,
    visits: {},
    checkpoints: {},
    notes: {},
    selfChecks: {},
  };
}

type LegacyJourneyV1 = {
  version: 1;
  visits?: JourneyState["visits"];
  checkpoints?: JourneyState["checkpoints"];
  notes?: JourneyState["notes"];
};

export function loadJourney(): JourneyState {
  if (typeof window === "undefined") return emptyJourney();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyJourney();
    const parsed = JSON.parse(raw) as { version?: number } & Record<string, unknown>;
    // Forward-migrate v1 → v2 (adds selfChecks).
    if (parsed.version === 1) {
      const v1 = parsed as LegacyJourneyV1;
      return {
        ...emptyJourney(),
        visits: v1.visits ?? {},
        checkpoints: v1.checkpoints ?? {},
        notes: v1.notes ?? {},
      };
    }
    if (parsed.version !== 2) return emptyJourney();
    return parsed as unknown as JourneyState;
  } catch {
    return emptyJourney();
  }
}

export function saveJourney(state: JourneyState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function recordVisit(state: JourneyState, slug: string): JourneyState {
  const now = Date.now();
  const prev = state.visits[slug];
  return {
    ...state,
    visits: {
      ...state.visits,
      [slug]: {
        firstAt: prev?.firstAt ?? now,
        lastAt: now,
        steps: (prev?.steps ?? 0) + 1,
      },
    },
  };
}

export function recordCheckpoint(
  state: JourneyState,
  slug: string,
  note?: string,
): JourneyState {
  return {
    ...state,
    checkpoints: {
      ...state.checkpoints,
      [slug]: { passedAt: Date.now(), note },
    },
  };
}

export function writeNote(
  state: JourneyState,
  slug: string,
  text: string,
): JourneyState {
  return { ...state, notes: { ...state.notes, [slug]: text } };
}

export function toggleSelfCheck(
  state: JourneyState,
  slug: string,
  checkId: string,
): JourneyState {
  const forSlug = state.selfChecks[slug] ?? {};
  const nextVal = !forSlug[checkId];
  const nextForSlug = { ...forSlug };
  if (nextVal) nextForSlug[checkId] = true;
  else delete nextForSlug[checkId];
  return {
    ...state,
    selfChecks: { ...state.selfChecks, [slug]: nextForSlug },
  };
}
