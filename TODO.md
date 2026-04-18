# TODO — The Atlas, next lap

A working plan for the next three goals. Written to be opinionated — a
recommended path per goal with tradeoffs called out, not a menu of
options. Everything here is negotiable; nothing here is implemented yet.

---

## The three goals, in plain English

1. **One page, less navigating.** A learner shouldn't have to click through
   four routes to read the atlas end to end. Consolidate the primer + all
   algorithm chapters onto a single scrollable page with anchored
   sections, and keep the current `/learn/[slug]` URLs as deep links.
2. **Easy content improvement.** Lessons today live as typed TS objects
   (`lib/lessons/bfs.ts`). Editing prose requires opening TypeScript and
   knowing the shape. Move the writable parts (prose, checkpoints, world
   examples) into MDX files that anyone comfortable with markdown can
   edit — while keeping the load-bearing code (algorithms, step
   generators, graph layouts) in TypeScript.
3. **Admin CRUD.** A `/admin` surface that lists lessons, edits them,
   creates new ones, and removes ones. Backed by a small API route
   handler. Authenticated with a simple env-var password for v1 (no
   accounts, no DB).

---

## G1 — Consolidate onto one page

### Proposed shape

One long route at `/learn` that renders every chapter in sequence:

```
┌──────────────────────────────────────────────────────────────────┐
│  sticky side-nav (on lg+)     │     the atlas, scrolling          │
│  ─────────────────────        │                                   │
│  00  Foundations        ●     │   ┌─── 00. Foundations ───┐       │
│  01  BFS                ○     │   │  queue demo           │       │
│  02  DFS                ○     │   │  stack demo           │       │
│  03  Dijkstra           ○     │   │  a graph in code      │       │
│                               │   └───────────────────────┘       │
│  [ journey · 2/4 ticked ]     │                                   │
│                               │   ┌─── 01. BFS ───────────┐       │
│  (dot filled when that        │   │  intuition            │       │
│   chapter's self-checks       │   │  the run (canvas)     │       │
│   or checkpoint complete)     │   │  the code (py/ts)     │       │
│                               │   │  in the world         │       │
│                               │   │  checkpoint           │       │
│                               │   └───────────────────────┘       │
│                               │   ...                             │
└──────────────────────────────────────────────────────────────────┘
```

### Key design calls

- **Still keep deep-link URLs.** `/learn/bfs` scrolls to the BFS section
  on the same page (anchor/hash router). This preserves shareable links
  and the journey's "jump to chapter" behavior.
- **Only one `GraphCanvas` in memory.** Mounting three Excalidraws at
  once is heavy (Excalidraw's initial paint is slow). Render canvases
  lazily — on first scroll into view — using `IntersectionObserver`.
  Once mounted, keep them mounted.
- **Chapter headers are sticky-ish** — the chapter label stays glued to
  the top edge while you're in that section, so you always know where
  you are.
- **Journey ribbon stays in the side-nav.** Self-check and checkpoint
  completion fills the chapter dot (empty → half → full).

### Files touched

```
app/learn/page.tsx               → renders every chapter in sequence
app/learn/[slug]/page.tsx        → becomes a thin redirect to /learn#slug
components/ChapterNav.tsx        → NEW. sticky side nav with progress dots
components/LazyChapter.tsx       → NEW. IntersectionObserver wrapper to
                                    defer Excalidraw mount per chapter
components/AlgorithmShell.tsx    → accepts a `headingLevel` prop so it can
                                    become an `h2` inside the page instead
                                    of an `h1`
app/page.tsx                     → landing "Start" CTA points to
                                    /learn#primer instead of /learn/primer
```

### Steps

1. Extract current `AlgorithmShell` so it works when rendered multiple
   times on one page (id-scoped anchors, unique `aria-labelledby`s —
   today most already use `slug`, but double-check).
2. Build `LazyChapter` that wraps a chapter's inner body and only
   renders it when within ~200px of the viewport. Show a parchment
   skeleton until then.
3. Build `ChapterNav` with a sticky left rail. Read `useJourney()` for
   progress dots. Anchor-scroll on click.
4. Rewrite `/learn` to stack: `Primer → BFS → DFS → Dijkstra`.
5. Turn `/learn/[slug]` into a redirect to `/learn#<slug>` so existing
   bookmarks work.

### Why not tabs or an accordion

- Tabs: hide content behind interaction. Makes the atlas feel like an
  app dashboard; breaks linear reading.
- Accordion: tempting, but collapsing code panels and Excalidraws mid-read
  is disorienting. Linear scroll is better here.

### Cost to the current design

None aesthetic. The four-facet lesson shape stays the same. We're just
stacking them instead of routing between them.

---

## G2 — Make content easy to improve

### Proposed shape

Lessons move to **MDX files with YAML frontmatter**. The frontmatter
carries structured data (title, tagline, complexity, checkpoint spec,
world examples). The MDX body carries the prose — intuition,
teacher-notes, whatever needs editorial attention.

```
content/lessons/
  00-primer.mdx
  01-bfs.mdx
  02-dfs.mdx
  03-dijkstra.mdx
```

`01-bfs.mdx`:

```mdx
---
slug: bfs
title: Breadth-first search
tagline: A wave spreading out from where you start.
complexity: { time: "O(V + E)", space: "O(V)" }
graph: cityGraph          # symbolic ref to a graph in lib/sample-graphs.ts
startNode: A
goalNode: G
algorithm: bfs            # symbolic ref to runBFS in lib/algorithms/bfs.ts
worldExamples:
  - product: Web crawlers
    problem: Discover pages from a seed URL without drilling deep too fast.
    how: Crawlers BFS the link graph so they see a breadth of sites first.
  # ...
checkpoint:
  question: "Why does BFS find the shortest path in number of hops…"
  answer: "A,B,C,D,E,F,G"
  # choices, reflectionPrompt, etc.
selfChecks:
  - id: bfs-intuition
    section: intuition
    label: "I can explain the ripple metaphor in my own words."
  # ...
---

## The intuition

BFS explores a graph the way a ripple explores a pond — closest things
first, then farther, then farthest.

<TeacherNote>
  Keep an eye on the queue panel. Every time a node is popped from the
  front, its un-visited neighbors are added to the back.
</TeacherNote>

## The run

<AlgorithmRun />  {/* renders the canvas + code panel + scrubber */}

## In the world

<WorldExamples />  {/* reads from frontmatter */}

...
```

### Why MDX and not pure markdown

Two reasons:

- **Components inline.** The `<AlgorithmRun />`, `<TeacherNote>`, and
  eventually `<QueueDemo />` need to appear mid-prose. Markdown alone
  can't do that without HTML soup; MDX lets us write a React component
  inside the document cleanly.
- **Still editable.** 95% of what a content editor writes is markdown.
  The MDX-specific bits are a small set of components with obvious
  names. Non-developers can edit comfortably.

### Why not keep TypeScript modules

- **Prose belongs in docs, not in code.** Re-flowing a paragraph
  shouldn't require knowing what a `Lesson` type is.
- **Diffs read poorly.** A prose edit in a TS file produces a noisy diff
  (string-escape weirdness, linebreaks inside template literals).
- **Non-devs need a door.** MDX is a door; TS modules are a locked door.

### Why not a headless CMS

- Overkill at our scale (4 lessons). Adds a service dependency, auth,
  webhooks, build-time fetch. A flat file is faster and honest.
- If we ever reach 50 lessons with distributed authors, revisit.

### Files touched

```
content/lessons/               → NEW. MDX source of truth for lessons
lib/content/loadLesson.ts      → NEW. parses MDX + frontmatter into Lesson
lib/content/registry.ts        → NEW. enumerates all MDX files at build
lib/lessons/*                  → DELETED (replaced by MDX)
next.config.mjs                → wire `@next/mdx` + custom components
components/mdx/                → NEW. <AlgorithmRun>, <TeacherNote>,
                                  <CodePair>, <WorldExamples>, etc.
```

### Steps

1. Add `@next/mdx` + `gray-matter` (or Next's built-in frontmatter parser).
2. Define the "safe frontmatter schema" in `lib/content/schema.ts` (Zod)
   so bad frontmatter fails the build with a clear message.
3. Port `bfs.ts` lesson to `01-bfs.mdx`. Verify the page still renders
   identically.
4. Port DFS, Dijkstra, primer.
5. Delete the old TS lesson files; update the registry to load from MDX.
6. Document the authoring workflow in `docs/authoring-lessons.md`.

### What stays in TypeScript (on purpose)

- Algorithm step generators (`lib/algorithms/bfs.ts` etc.). These are
  code; they don't belong in markdown.
- Excalidraw scene builder.
- Sample graphs and their hand-chosen coordinates.

### Migration risks

- Hand-matched line numbers (the `LINE` constants for code-panel sync)
  still live in the TS algorithm files. MDX frontmatter just references
  `algorithm: bfs` — the code and its line map stay in TS. Good.
- MDX compilation adds build time. Measurable but small at our scale.

---

## G3 — Admin CRUD

### Proposed shape

A minimal authenticated admin at `/admin` that lists lessons, opens a
markdown editor, and writes changes. Backed by Next.js route handlers
under `app/api/lessons/`.

```
GET    /api/lessons               list all lesson slugs + metadata
GET    /api/lessons/[slug]        read one MDX file (frontmatter + body)
PUT    /api/lessons/[slug]        overwrite (validated by the Zod schema)
POST   /api/lessons               create (slug required in body)
DELETE /api/lessons/[slug]        move to `content/lessons/_archive/`
                                  (never hard-delete — keep the history)
```

Every mutating route requires an `Authorization: Bearer <ADMIN_TOKEN>`
header matching `process.env.ATLAS_ADMIN_TOKEN`. No user accounts.

### The admin UI

A single page at `/admin`:

```
┌─── atlas admin ──────────────────────────┐
│ lessons                                   │
│ ──────                                    │
│ ● 00  Foundations       edit  delete      │
│ ● 01  BFS               edit  delete      │
│ ● 02  DFS               edit  delete      │
│ ● 03  Dijkstra          edit  delete      │
│                                           │
│ [ new lesson ]                            │
│                                           │
│ ──── editor ────                          │
│ [ frontmatter form — title, tagline,      │
│   complexity, checkpoint, world examples] │
│ [ markdown body — textarea with preview ] │
│ [ save ] [ preview ] [ cancel ]           │
└───────────────────────────────────────────┘
```

Minimal. No WYSIWYG. The admin just needs:
- structured fields for the frontmatter bits (a tiny form)
- a big textarea for the MDX body
- a "preview" that renders the lesson in a new tab using the same
  AlgorithmShell, from the unsaved draft

### Storage — file system vs. database

**Recommendation: file system, in dev. Wrap it with an "publish" flow for
prod.**

- **In dev** (`npm run dev`), PUT/POST/DELETE write MDX files directly
  into `content/lessons/`. Fast iteration, trivial to review via `git
  diff`, zero new infrastructure.
- **In prod** (on Vercel), the filesystem is read-only at runtime.
  Two options:
  - **V1**: disable write endpoints in prod; the admin is a local-dev tool.
    Content changes happen via git + a deploy.
  - **V2**: add a "Publish" button that uses the GitHub API to commit
    the change to `main` or open a PR. Tokens via env vars.

I'd ship V1 first and decide on V2 based on whether the user actually
wants to edit from prod.

### Why not a database

- We're editing MDX files that already live in the repo. A database
  would put content in two places; git would become the canonical
  store of a *snapshot*, not of the ongoing state.
- Every deploy would have to be preceded by a DB dump. That's
  operationally expensive for a 4-lesson app.

### Files touched

```
app/admin/page.tsx                 → NEW. client-rendered admin UI
app/admin/[slug]/page.tsx          → NEW. single-lesson editor
app/api/lessons/route.ts           → NEW. GET/POST
app/api/lessons/[slug]/route.ts    → NEW. GET/PUT/DELETE
lib/admin/auth.ts                  → NEW. bearer-token middleware
lib/admin/filestore.ts             → NEW. safe MDX read/write helpers
  (refuses to write outside content/lessons/; validates frontmatter;
   formats body with prettier on save)
components/admin/LessonEditor.tsx  → NEW. the form + textarea
.env.example                       → document ATLAS_ADMIN_TOKEN
docs/admin-guide.md                → NEW. how to run locally + auth
```

### Steps

1. Build the file-store helpers with strict path sanitization.
2. Ship the four API routes with Zod-validated bodies.
3. Build the list view (`/admin`) — just a GET and a few links.
4. Build the editor page — form + textarea, wired to PUT.
5. Add create and delete.
6. Disable mutating routes when `NODE_ENV === "production"` unless an
   explicit `ATLAS_ADMIN_WRITES_ENABLED=1` flag is set. Document this.

### Security notes

- Never render admin-submitted markdown without MDX compilation — the
  compiler rejects raw `<script>` tags in strict mode, which we'll use.
- Sanitize slugs to `^[a-z0-9-]+$`. No path traversal.
- Always read/write through the `filestore` helper. Never let a route
  handler concat a user-provided slug into a path.
- The bearer token is a secret. Don't log it. Don't ship it client-side.
  Check it in a middleware, not per-route.

---

## Sequencing

Do them in **this order**, because each one unlocks the next:

1. **G2 first (MDX lessons).** Everything else becomes easier once
   lessons are data. The consolidated page and the admin UI both
   benefit: the admin edits MDX; the consolidated page loops over MDX
   files. Doing G1 or G3 before G2 means doing them twice.
2. **G1 next (consolidate).** Now that lessons are an array of MDX
   files, stacking them on one page is a map over the array.
3. **G3 last (admin).** By the time admin lands, the content model is
   stable and validated. The admin is a thin CRUD shell over it.

Concretely, rough estimates:

- G2: ~1 dev-day — port three lessons + build MDX loader.
- G1: ~0.5 dev-day once G2 is done — mostly layout.
- G3: ~1 dev-day — API, auth, editor, preview.

---

## Open questions (worth asking before starting)

1. **Who edits?** Just the maintainer, or a small group of contributors?
   If contributors, the admin needs real auth (not just a token). v1
   assumes single-maintainer.
2. **Markdown preview — WYSIWYG or split-pane?** Recommend split-pane
   (markdown on the left, rendered on the right). WYSIWYG for MDX is a
   significant lift and often breaks on custom components.
3. **Does "consolidate to one page" mean the primer too?** I'm assuming
   yes — the primer is Chapter 00 and belongs at the top of the scroll.
4. **Do we keep `/learn/[slug]` URLs indexable?** Proposed behavior is a
   client redirect to `/learn#slug` — good for humans, bad for search
   engines. If we care about SEO, render the same content at both
   URLs (server-side), but the page with `#slug` is the "canonical"
   via a `<link rel="canonical">`.
5. **Should self-checks and checkpoints migrate with the lesson MDX,
   or stay in TS?** Recommend MDX frontmatter — they're content, not
   logic. Their *behavior* (what a tick does, how a checkpoint passes)
   stays in TS.

---

## What's explicitly NOT in scope for this lap

- The playground. Stays a placeholder until after these three land.
- Multi-user accounts, roles, audit logs. Out of scope for v1.
- Localization. English-only for now.
- Versioning / draft-publish split. Archive on delete is enough.
- Inline algorithm editing (modifying the code the run panel shows).
  Algorithm source remains TypeScript; too easy to break.

---

*Last updated at scaffold time. Update as decisions firm up.*
