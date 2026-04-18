# Teaching model — the 4-facet lesson

Every algorithm page is the same shape. Consistency is the curriculum.

---

## The shape

```
  1. INTUITION      one sentence · real-world analogy · tiny drawing
  2. THE RUN        the visual simulation, with synced code + narration
  3. IN THE WORLD   three cards: product · problem · one-line "how"
  4. CHECKPOINT     one question, one exercise, one note-to-self field
```

Each facet has a specific job. None can be skipped. None should grow beyond
its scope.

---

## 1. Intuition

**Job:** give the learner a mental handle before any code appears.

**Format:**
- A one-sentence definition. No notation, no jargon. ("A wave spreading out
  from where you start.")
- A real-world analogy, 2–3 sentences. ("If you shout in a canyon, the
  echo reaches the closest walls first, then the farther ones. BFS
  explores a graph the same way.")
- A small, static Excalidraw drawing — 4–5 nodes, one or two arrows —
  that *shows* the intuition. Not the algorithm running, just the
  concept.

**Tone test:** a curious non-CS person reading this should think "I get
the idea." If they wouldn't, it's too jargon-heavy.

---

## 2. The run

**Job:** let the learner watch the algorithm unfold, *and* see which line
of code made each change, *and* read a sentence that explains why.

**Three panels, synced:**

- **Canvas** (Excalidraw). Nodes colored by state. The *current* node
  pulses vermilion. Visited ochre. Solved verdigris.
- **Code.** The line that produced the current step is highlighted in
  saffron. Scrolls into view.
- **Narration.** A one-sentence caption for this step. Present tense.
  ("We pop A off the queue and look at its neighbors.")

**Controls:**
- Play / pause. Step forward / back. Scrubber showing "step 4 of 12."
- Speed (0.5× / 1× / 2×). Defaults to 1×.
- Reset. Try different start node (when applicable).

**Constraint:** the learner must always be able to *go backwards*. You
cannot learn from a forward-only animation. Reverse scrubbing is
table-stakes.

---

## 3. In the world

**Job:** anchor the abstraction to something the learner has touched.

**Three compact cards**, each:
- **Product or system name** (Google Maps, npm, Instagram).
- **The problem it solves** (shortest route, dependency install order,
  friends-of-friends).
- **One line on how.** Not a rigorous explanation — a plausible,
  honest-ish pointer. ("Google Maps runs a weighted search like Dijkstra
  across road segments, biased toward roads you're likely to accept as
  reasonable detours.")

This section must be **specific and honest.** If we don't know how npm
resolves dependencies internally, we say "likely uses a topological
sort" and link out. Never invent authority.

---

## 4. Checkpoint

**Job:** turn watching into doing. Writing into remembering.

**Three parts, in this order:**

1. **One question.** Multiple choice, one right answer, three wrong ones
   with honest-why-they're-wrong feedback. (Not "Incorrect." Not "Try
   again!" A sentence about what that answer would imply.)
2. **One exercise.** Usually: "Run BFS on this graph in your head. What's
   the order of visited nodes?" The user types the answer. We check.
3. **One note-to-self field.** "In your own words: when would you reach
   for BFS?" Free text. Saved to the journey journal. Not graded.

Passing the checkpoint is the only thing that marks an algorithm as
"learned" in the journal. Watching alone doesn't count.

---

## Copy rules (same as the design doc, restated)

- No exclamation-mark celebration. No "Amazing!" "Great job!" Instead:
  acknowledgment specific to what the user did.
- Present tense in narrations.
- Headings are noun phrases. "How a queue does it" not "Learn how queues
  work."
- Length: if prose runs over 3 paragraphs, it's usually the wrong format —
  turn something into a drawing.

---

## Why this structure (and not chapters, quizzes, a tree of topics)

**We chose small over comprehensive.** An algorithm visualizer can easily
become a dozen-button dashboard of knobs and options. We resisted that.
One algorithm. Four facets. Always the same shape.

The journey provides continuity; the 4-facet pattern provides rhythm.
Rhythm is what lets someone complete five algorithms in an afternoon and
feel they've traveled somewhere.
