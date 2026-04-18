"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  emptyJourney,
  loadJourney,
  recordCheckpoint,
  recordVisit,
  saveJourney,
  toggleSelfCheck,
  writeNote,
  type JourneyState,
} from "@/lib/journey";

interface JourneyContextValue {
  state: JourneyState;
  hydrated: boolean;
  visit: (slug: string) => void;
  pass: (slug: string, note?: string) => void;
  note: (slug: string, text: string) => void;
  toggleCheck: (slug: string, checkId: string) => void;
  reset: () => void;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<JourneyState>(emptyJourney);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    setState(loadJourney());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => saveJourney(state), 250);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [state, hydrated]);

  const visit = useCallback(
    (slug: string) => setState((s) => recordVisit(s, slug)),
    [],
  );
  const pass = useCallback(
    (slug: string, note?: string) => setState((s) => recordCheckpoint(s, slug, note)),
    [],
  );
  const note = useCallback(
    (slug: string, text: string) => setState((s) => writeNote(s, slug, text)),
    [],
  );
  const toggleCheck = useCallback(
    (slug: string, checkId: string) =>
      setState((s) => toggleSelfCheck(s, slug, checkId)),
    [],
  );
  const reset = useCallback(() => setState(emptyJourney()), []);

  return (
    <JourneyContext.Provider
      value={{ state, hydrated, visit, pass, note, toggleCheck, reset }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used inside <JourneyProvider>");
  return ctx;
}
