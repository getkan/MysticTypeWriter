# Forward to the Void

A minimal SvelteKit app for a constrained writing experience inspired by a disappearing typewriter.

The app starts on a configuration screen where the user selects how the writing session should behave, then moves into the typewriter page using the chosen config.

## Concept

Forward to the Void is a writing tool built around a simple rule:

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
- [ ] Add ability to view final text after completion
- [ ] Add option to share final text to social media
- [ ] Add animations and sound effects

## Future ideas
- Add page disappearance mode

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
  lib/
    TypewriterConfig.ts
  routes/
    +page.svelte
    Typewriter.svelte
    typewriter/
```

## Styling

The UI uses a dark, terminal-like palette defined in `src/app.css`, with Tailwind CSS v4 and theme tokens.

## License

MIT
