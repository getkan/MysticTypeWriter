# Codebase Organization Suggestions

This document proposes practical improvements to keep the project easier to scale as features like sharing and post-session review are added.

## 1) Introduce a feature-first directory layout

Current structure mixes route code, shared state, and feature-specific UI.

Suggested structure:

```text
src/
  lib/
    components/
      icons/
    features/
      typewriter/
        components/
        logic/
        audio/
      config/
        components/
        model/
      share/
        components/
        logic/
    state/
    utils/
  routes/
    +layout.svelte
    +layout.ts
    +page.svelte
    typewriter/
      +page.svelte
    share/
      +page.svelte
```

Benefits:

- Keeps each feature's UI, logic, and helpers together.
- Reduces cross-route coupling.
- Makes new feature work more discoverable.

## 2) Separate state shape from state actions

`src/routes/state.svelte.ts` currently stores state and mutation actions in one file and is route-scoped.

Recommendation:

- Move app-wide state to `src/lib/state/`.
- Split each store into:
  - state source (runes state)
  - read API (selectors/getters)
  - write API (actions)

Example files:

- `src/lib/state/config.svelte.ts`
- `src/lib/state/typewriter.svelte.ts`

Benefits:

- Prevents route files from becoming global service modules.
- Improves testability and ownership boundaries.

## 3) Extract typewriter page logic into focused modules

`src/routes/typewriter/+page.svelte` currently combines:

- editor keyboard behavior
- timeout behavior
- parsing/fading logic
- render-specific DOM measurement logic

Recommendation:

- `logic/parseInput.ts` for disappearance algorithm
- `logic/timeout.svelte.ts` for timer/session timeout state
- `logic/editor.svelte.ts` for selection/caret behavior
- Keep the page component focused on composition and event wiring

Benefits:

- Smaller Svelte files with clearer responsibilities.
- Lower regression risk when changing one subsystem.

## 4) Standardize icon component location and API

Icons are currently split across route folders and shared lib locations.

Recommendation:

- Move all icons to `src/lib/components/icons/`.
- Keep one prop contract for all icons:
  - `size?: string | number`
  - `title?: string`
  - rest props passthrough

Benefits:

- Consistent usage and accessibility behavior.
- Easier replacement or theming of icon set.

## 5) Add lightweight domain typing modules

Some domain concepts are embedded directly inside UI files.

Recommendation:

- Create central domain files:
  - `src/lib/features/typewriter/model/types.ts`
  - `src/lib/features/typewriter/model/constants.ts`

Move items such as:

- `ParsedChunk`
- disappearance mode related mappings and helper types

Benefits:

- Prevents type duplication and drift.
- Improves readability in components.

## 6) Add a route-level README for feature entry points

Recommendation:

- Add short README files for complex feature folders (for example `src/lib/features/typewriter/README.md`).
- Include:
  - purpose
  - module map
  - data flow summary

Benefits:

- Faster onboarding and easier handoff.

## 7) Introduce explicit naming conventions

Recommendation:

- Suffix files by role:
  - `*.svelte.ts` for rune state/effects
  - `*.logic.ts` for pure logic
  - `*.types.ts` for types
  - `*.constants.ts` for static config
- Keep route files thin and avoid business logic in `+page.svelte` where possible.

Benefits:

- Better code search and intent clarity.
- Less ambiguity about where new code should live.

## 8) Add quality gates for organization drift

Recommendation:

- Extend scripts:
  - `npm run check` in CI on every push
  - optional linting with ESLint for import/order and unused code
- Add one small architecture checklist to PR template:
  - Is state in feature/global state module?
  - Is pure logic extracted from route component?
  - Are shared UI elements in `lib/components`?

Benefits:

- Keeps structure improvements from regressing over time.

## Suggested rollout order

1. Move shared state out of `src/routes/state.svelte.ts`.
2. Extract parse/timeout/editor logic from typewriter route.
3. Consolidate icon components.
4. Introduce feature folders and naming conventions.
5. Add PR checklist and CI checks.
