# Design philosophy — The Atlas

The aesthetic commitment of this project in one page, then the details.

---

## The one-paragraph statement

**The Atlas looks like an illuminated mathematician's journal that someone
has been keeping for years.** Warm parchment paper, ink-dark serifs, a
single assertive accent color per section, generous margins, margin notes in
a real handwriting font. The drawings are hand-drawn (Excalidraw). The
interface recedes so the picture and the prose can lead. It is never
skeuomorphic — it is *editorial*, the way a beautiful math textbook is
editorial. The pleasure comes from type, rhythm, and restraint, not from
effects.

---

## What we refuse

This section is load-bearing. "Avoiding AI slop" is a commitment, not a
vibe. If a PR drifts toward any of these, it does not ship.

- **No purple gradients.** Not on buttons, not on backgrounds, not on hero
  sections. Not a single one. The palette below is our entire palette.
- **No Inter, Roboto, Arial, or system-ui** as a display or body font.
  These are defaults, not choices.
- **No dashboard grid** with 4 equal stat cards above a line chart. This is
  not a dashboard.
- **No glassmorphism.** No frosted blur panels over swirling gradients. No
  "neumorphic" embossed buttons.
- **No AI-stock icon set** (rounded-square gradient glyphs). We hand-pick
  Lucide with care, or draw our own inline SVG.
- **No Lorem Ipsum in committed code.** Real prose or nothing.
- **No "click here to learn more"** CTAs. Write verbs that mean something.

---

## The palette

One warm background, one ink foreground, three accents — and we only ever
foreground one accent at a time. Two accents visible in the same viewport
is usually a mistake.

```
parchment       #F4ECDC    The page. Warm cream, slightly more yellow than white.
parchment-deep  #E8DCC4    Aged paper, used for cards and raised surfaces.
parchment-edge  #D9C9A7    Border/divider tone. Just darker than the deep.
ink             #1F1B1A    Near-black with a whisper of warm brown. Primary text.
ink-soft        #3D3733    Secondary text.
ink-quiet       #78706A    Tertiary/captions.

ochre           #C67A36    The "visited / discovered" accent. Burnt sienna.
verdigris       #5E8A76    The "complete / path-found" accent. Muted teal-green.
vermilion       #C5462E    The "current / active" accent. Used sparingly.
saffron         #E6B340    Highlight/annotation. Like a highlighter over paper.
```

Color assignments are semantic and consistent across every algorithm:

- **ink** — nodes at rest, code, body.
- **ochre** — visited nodes / explored edges.
- **vermilion** — the current frontier (what we're examining *right now*).
- **verdigris** — the final path / solved state.
- **saffron** — the learner's own annotations, highlights, margin notes.

A user who learns BFS and moves to DFS reads the color language without
being told. That's the payoff.

Dark mode (v1, not v0): invert to `#18160F` background with parchment-tone
text. Same accents. Do not retint accents for dark mode — they already read
correctly on the dark warm ground.

---

## Typography

Three faces. No more. Each has one job.

- **Display — Fraunces.** Variable serif with soft optical sizes. Confident
  but not sterile. Used for headings, the landing page wordmark, numbers
  in the scrubber. Pulled from Google Fonts.
- **Body — Source Serif 4.** Quiet, evenly-weighted serif that reads long
  at 18–19px. Body copy, narration, UI labels. Google Fonts.
- **Mono — JetBrains Mono.** For code. Ligatures on. The only sans-adjacent
  face in the system.
- **Hand — Caveat.** One job only: margin notes, annotations, the
  "handwritten" accents that echo the Excalidraw canvas. Never for UI
  labels. Never for body.

Sizing scale (set as `--text-*` in `@theme`):

```
xs   13px / 1.5
sm   15px / 1.55
base 17px / 1.6       ← body
lg   19px / 1.55
xl   23px / 1.45
2xl  29px / 1.3       ← section headings
3xl  37px / 1.2
4xl  48px / 1.1       ← page titles
5xl  64px / 1.05      ← landing hero
```

This is a modular scale centered on 17 (not 16). The half-step up makes the
serif read comfortably on a warm background without feeling oversized.

Line-length cap: 66 characters for prose. We use `max-w-[66ch]` almost
everywhere text appears.

---

## Motion

We animate with intention, not reflexively. Three rules:

1. **Transitions tell a story.** The scrubber advances one step; the node
   that just changed state draws a quick ink-stroke halo, then settles.
   The code panel scrolls its highlight to the new line with a 200ms
   easing. These animations *explain*.
2. **Nothing that doesn't earn its place.** No hover bounces on cards. No
   page-load cascades of fade-ups on every paragraph. One orchestrated
   reveal at page-load — the title, then the first drawing, then the
   controls. Then stillness.
3. **Paper-feel easing.** We define `--ease-paper: cubic-bezier(0.2, 0.7,
   0.2, 1)` — a slight overshoot-free deceleration that mimics settling on
   a desk. All UI transitions use this or a close sibling. No elastic, no
   spring-bounce.

Durations: 180ms for micro-interactions, 320ms for state transitions,
600ms for orchestrated reveals.

---

## Space & composition

- **Generous margins.** Content columns are narrow (66ch). The journal
  feel comes from letting the parchment breathe around the text.
- **Asymmetric, occasionally.** The landing hero is deliberately
  off-center. Algorithm pages sometimes drop a drawing into the margin on
  wide screens, the way a real textbook does.
- **Rulers, not cards.** Sections are separated by thin `parchment-edge`
  hairlines more often than by card containers. Cards are reserved for
  things that are *truly* separable (the "in the world" examples, the
  checkpoint box).
- **Margin notes are real.** On wide screens, we use the right margin for
  handwritten-font asides. They're not decorative — they often say things
  the main prose doesn't, just like they do in a real notebook.

---

## Surface details

The parchment has **texture**. A faint 1% noise layer lives as a repeating
SVG background on `body`, so the background never looks flat. We do this
in CSS — no image asset.

Borders on cards are **2px solid ink, not rounded** — more like a drawn
rectangle than a modern UI card. Occasionally with a 1px offset "ink
shadow" in ochre to suggest a hand-drawn second pass. Sparingly. On the
most important cards only.

Focus rings: **ochre, 2px offset, 3px thick.** No default blue. Never.

---

## The hand-drawn covenant

Excalidraw's wobbly lines are the *reason* the app can feel like a
mathematician thinking on paper. That aesthetic is fragile — if we
surround the canvas with hard-edged rounded cards and a sans-serif UI, it
looks like a cheap widget. The entire chrome around the canvas exists to
*extend* the canvas's aesthetic outward. Serifs. Warm ground. Drawn
borders. Handwritten margin notes.

This is the commitment that makes the rest of the design system non-
negotiable.

---

## Copy tone

Written design matters as much as visual design. The app's voice is:

- **Observant, not performative.** "A lot of people reach for a stack
  here. It's the right instinct, wrong shape."
- **Specific.** Prefer a concrete example to a general claim.
- **Warm but not saccharine.** No "Amazing!" "Great job!" "You're a
  genius!" confetti. Acknowledge difficulty honestly.
- **Short.** Most UI copy should be 6 words or fewer. Most prose
  paragraphs should be 3 sentences or fewer. Long form lives in
  dedicated narration panels, not scattered across the UI.

Headings are almost always a noun phrase, not a command.
- Good: *Breadth-first search*
- Good: *How a queue does it*
- Bad: *Learn BFS now!*

---

## Checklist — before merging any visual change

- [ ] Does this use only fonts from the 4-face set? (Fraunces, Source
      Serif, JetBrains Mono, Caveat)
- [ ] Does it avoid every item in "What we refuse"?
- [ ] If accents are used, is there exactly one dominant accent in the
      viewport?
- [ ] Does motion explain something, or is it decorative?
- [ ] Does the copy meet the tone rules? No exclamation-mark celebrations?
- [ ] Does it extend the Excalidraw aesthetic outward, or fight it?

If any answer is no, it doesn't ship.
