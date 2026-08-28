# Project roadmap

The next delivery is the Exquisite Corpse game mode: a multi-player session on
one device where each player writes a turn, sees almost nothing of what came
before, and the full text is revealed only at the end.

## Phase 1: Game session model and configuration

### Outcome

The landing page can configure an Exquisite Corpse session, and the session
rules are represented in shared state without any gameplay UI yet.

### Included work

- Extend the configuration model with `gameMode`, `players` (integer), and
  `rounds` (integer).
- When Exquisite Corpse is selected, force `disappearanceMode: "sentence"` with
  `show: 1` and `fade: 1`, and disable conflicting options in the form.
- Add game session state: current player, current round, and per-turn text
  boundaries within the full session text.
- Persist the configuration alongside the existing typewriter configuration.

### Dependencies and risks

- `DISAPPEARANCE_CONFIG` is currently a static map keyed by mode; per-session
  `show`/`fade` overrides must not change behavior for the existing modes.
- Configuration is stored in one `localStorage` key; adding fields must remain
  backward compatible with stored objects.

### Exit criteria

- Selecting the game mode on `/` stores a valid session configuration, and the
  existing single-player flow is unchanged.

### Validation

- `npm run check`.
- Unit-level checks of the disappearance overrides.
- Manual check that stored legacy configurations still load.

## Phase 2: Turn taking and handoff

### Outcome

Players can take turns writing on the typewriter page, with each turn ending on
an explicit advance action or on the inactivity timer.

### Included work

- Replace the "Done!" link with an advance action while a game is running.
- Advance to the next player, reset the inactivity timer, and show whose turn
  it is and which round is active.
- Keep the accumulated text in session state while showing the new player only
  the last sentence.
- End the session after the final player of the final round and route to the
  reveal.

### Dependencies and risks

- The canvas renderer draws the tail of the text; the handoff must not reveal
  earlier turns through the top-edge fade.
- Timer reset and turn advance must not double-fire when both occur together.

### Exit criteria

- A full session with two or more players and two or more rounds completes and
  reaches the reveal with all turns joined in order.

### Validation

- `npm run check`.
- Manual play-through of a multi-player, multi-round session.

## Phase 3: Reveal, session safety, and release readiness

### Outcome

The completed story is revealed and shareable, and an in-progress game survives
accidental navigation.

### Included work

- Reveal the full text on `/share`, attributed by turn where useful.
- Persist in-progress game state so a reload can resume, and warn before
  unload or in-app navigation away from an active game.
- Accessibility pass on the turn indicator and advance control, including
  keyboard operation and screen reader announcements.
- Update `README.md` and `docs/SPEC.md` with the shipped game mode.

### Dependencies and risks

- Persisting session text changes the privacy profile described in `SPEC.md`;
  the stored data must stay local and be cleared when a session ends.
- `beforeunload` warnings are throttled by browsers and cannot be relied on
  alone.

### Exit criteria

- A reloaded game resumes at the correct player and round, and finishing a
  session clears the stored game state.

### Validation

- `npm run check`.
- Manual reload, back-navigation, and completion tests.
- Manual keyboard and screen reader check of the turn controls.
