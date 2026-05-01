# Mystic Type-Writer

A minimal SvelteKit app for a constrained writing experience inspired by a disappearing typewriter.

The app starts on a configuration screen where the user selects how the writing session should behave, then moves into the typewriter page using the chosen config.

## Concept

Mystic Type-Writer is a writing tool built around a simple rule:

- no traditional editing
- text disappears while writing
- the full result is only meant to be seen at the end

The current project includes:

- a landing/configuration page
- shared in-app typewriter configuration state
- a typewriter route for the writing experience
- a dark terminal-style theme

## Roadmap

- [x] Create landing/configuration page
- [x] Implement shared in-app typewriter configuration state
- [x] Create typewriter basic ui and functionality
- [x] Implement text disappearance based on config
- [x] Add ability to view final text after completion
- [x] ~~Add option to share final text to social media~~
- [x] Add animations and sound effects
- [x] Add timeout for inactivity
- [x] Work on suggestions in docs
- [ ] Exquisite Corpse game mode
  - Config: int players, int rounds, disappearanceMode = 'sentence', show = 1, fade = 1,
  - Each player writes for a set time or until they finish a sentence, then passes to the next player
  - Done button is replaced with an advance button that moves to the next player and resets the timer (if enabled)
  - At the end of the last round the full text is revealed and can be shared

## Future ideas

- Add page disappearance mode
- improve mobile experience, the input box should adjust to the keyboard and not be pushed offscreen
- add a backend to save snippets of text and display them in a gallery, text in the white boxes animated to slowly drift from side to side, maybe with a parallax effect on mouse move or scroll, clicking on a snippet brings it to the front and pauses the animation.

## Tech stack

- **SvelteKit**
- **Svelte 5**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**

## Configuration model

The app currently supports these typewriter options:

- `disappearanceMode`
  - `line`
  - `sentence`
  - `page`
  - `word`
- `strictEditing`
- `animationsEnabled`
- `soundEffectsEnabled`

## Development

Install dependencies:

```sh
npm install
```

Start the dev server:

```sh
npm run dev
```

Start the dev server and open a browser:

```sh
npm run dev -- --open
```

## Scripts

- `npm run dev` — start local dev server
- `npm run build` — create production build
- `npm run preview` — preview production build
- `npm run check` — run Svelte/type checks
- `npm run check:watch` — run checks in watch mode

## Project structure

```text
src/
  app.css
  app.html
  lib/
    assets/
    components/
      icons/
    features/
      typewriter/
        audio/
        logic/
    model/
      config.ts
      constants.ts
      types.ts
    state/
      config.svelte.ts
      typewriter.svelte.ts
  routes/
    +layout.svelte
    +page.svelte
    share/
      +page.svelte
    typewriter/
      +page.svelte
    typewriter/
```

## Styling

The UI uses a dark, terminal-like palette defined in `src/app.css`, with Tailwind CSS v4 and theme tokens.

## License

MIT
