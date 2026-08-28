# Project specification

## Problem

Editing while writing interrupts the flow of a first draft. Mystic Type-Writer
removes editing and hides text as it is written, so the writer keeps producing
words instead of revising them, and only sees the full result at the end.

## Users

Writers who want a constrained drafting session in the browser. They use a
desktop or mobile browser, have no account, and expect the session to work
entirely client side with no data leaving the device.

## Required behavior

- The landing page (`/`) shows the configuration form and persists the chosen
  configuration to `localStorage` under `mystictypewriter:typewriter-config`.
- The typewriter page (`/typewriter`) starts an empty session, loads the stored
  configuration, and focuses the editor.
- Typed text disappears progressively according to `disappearanceMode`:
  - `line`, `sentence`, and `word` each define how many units stay fully
    visible (`show`) and how many fade out before hiding (`fade`) in
    `DISAPPEARANCE_CONFIG`.
  - Faded units lose opacity and gain blur; older units are fully hidden.
  - Text also fades out as it approaches the top edge of the typewriter frame.
- `strictEditing` blocks `Backspace` and `Delete`.
- `timeoutEnabled` ends the session and navigates to `/share` after 30 seconds
  without input; the remaining seconds are displayed under 10 seconds.
- `soundEffectsEnabled` plays a keystroke sound per accepted key and a carriage
  return sound when a new visual line starts.
- Pasting into the editor is rejected.
- `Enter` inserts one line break and moves the caret down exactly one line.
- The share page (`/share`) reveals the complete text of the session.
- If stored configuration is unreadable, it is cleared and the user is returned
  to `/`.

## User experience

Primary workflow: configure on `/`, write on `/typewriter`, reveal on `/share`.
The interface is a single dark terminal-style frame with the writing area
bottom aligned, a blinking caret, a back link, a sound toggle, and a "Done!"
link. The editor is always focused so typing works without an explicit click.

## Architecture and data flow

- SvelteKit 2 with Svelte 5 runes, TypeScript, Vite, Tailwind CSS v4, static
  adapter.
- `src/lib/state/config.svelte.ts` owns configuration state and `localStorage`
  persistence; `src/lib/state/typewriter.svelte.ts` owns the session text.
- `src/lib/model/` holds `types.ts`, `constants.ts`, and the `config.ts` input
  model.
- `src/lib/features/typewriter/logic/`:
  - `parseInput.ts` — `splitByMode` and `applyDisappearance` implement the
    disappearance algorithm shared by both renderers.
  - `canvasRender.ts` — monospace wrapping, per-character style mapping, canvas
    metrics, and painting including the top-edge fade and drawn caret.
  - `editor.ts` — caret focus, line-break insertion, and node-based text
    reading that preserves a trailing newline.
  - `timeout.svelte.ts` — inactivity timer state.
- `src/lib/features/typewriter/audio/audio.svelte.ts` plays the sound effects.
- Rendering: a transparent `contenteditable` layer captures input, and the
  visible text is painted on a `<canvas>` sized by `ResizeObserver` and device
  pixel ratio. `/legacy` keeps the earlier DOM renderer for reference.

## Security and privacy

All state is client side. The only persisted data is the configuration object
in `localStorage`; session text is held in memory only. No network calls, no
accounts, no third-party analytics. Pasted content is rejected, and no
user-supplied string is rendered as HTML.

## Performance and compatibility

- Current evergreen desktop and mobile browsers with Canvas 2D support,
  including `ctx.filter` for blur.
- Canvas redraw happens on input, configuration change, caret blink, and
  resize; a redraw must stay imperceptible for a full page of text.
- The layout supports viewports from small phones (`w-[90vw]`) up to
  `max-w-250`.

## Non-goals

- Server-side storage, accounts, or syncing between devices.
- Rich text formatting, spellcheck, or clipboard import.
- Publishing to social networks.

## Acceptance criteria

- `npm run check` reports no errors.
- Each disappearance mode fades and hides units according to
  `DISAPPEARANCE_CONFIG`.
- `Enter` produces exactly one new line, before and after further typing.
- With `strictEditing` enabled, `Backspace` and `Delete` do not change the text.
- With `timeoutEnabled`, 30 seconds of inactivity navigates to `/share`.
- Manual browser check of the typewriter page at desktop and mobile widths.

## Unresolved questions

- Whether `/legacy` is kept long term or removed once the canvas renderer is
  considered stable.
- Whether a `page` disappearance mode is added, and how it interacts with the
  canvas renderer.
