# ForwardToTheVoid

An ephemeral typewriter without saving or editing. As you write, your words disappear. Only when you finish is the complete text revealed.

This repository now includes a basic full-stack web app scaffold:

- Frontend: SvelteKit + TypeScript + Tailwind (with SSR support)
- Backend: Express + TypeScript
- Workspace: npm workspaces monorepo

## Pages
- `/`: Welcome splash page where the typewriter settings can be configured and the writing session can be started.
- `/writing`: The main writing interface where the ephemeral typewriter experience happens. As you type, your words will disappear until you finish, revealing the complete text.

## Typewriter Configuration Options

These options are configured on the splash page before starting a writing session.

- **Disappearance Mode**: `line | sentence | page | timeout`
	Controls when written text becomes hidden while typing.
- **Enable Strict Editing**: `true | false`
	When enabled, editing is allowed only until the active line, sentence, page, or timeout disappears (depending on the selected mode).
- **Animations Enabled**: `true | false`
	Enables or disables visual transition effects.
- **Sound Effects Enabled**: `true | false`
	Enables or disables typing and disappearance sounds.

## Project structure

```text
.
├── apps
│   ├── server
│   │   ├── src/index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web
│       ├── src/
│       │   ├── routes/
│       │   │   ├── +layout.svelte
│       │   │   └── +page.svelte
│       │   ├── lib/
│       │   │   └── TypewriterConfig.ts
│       │   ├── app.css
│       │   └── app.html
│       ├── package.json
│       ├── svelte.config.js
│       ├── vite.config.ts
│       ├── tailwind.config.cjs
│       └── postcss.config.cjs
├── docs
│   └── TypewriterConfig.md
├── package.json
└── tsconfig.base.json
```

## Requirements

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Development

Run backend and frontend together:

```bash
npm run dev
```

Default dev URLs:(used by SvelteKit) 

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/health

The Vite dev server proxies `/api/*` to the Express server.

## Build

```bash
npm run build
```

Build outputs:

- Backend: `apps/server/dist`
- Frontend: `apps/web/build` (production-ready Node.js server)

## Run production server

```bash
npm run start
```

The Express server serves API routes and static assets from the frontend build output.

## Docker

### Build Docker image

```bash
docker build -t forwardtothevoid .
```

### Run with Docker

```bash
docker run -p 3000:3000 forwardtothevoid
```

### Run with Docker Compose

```bash
docker-compose up
```

The app will be available at http://localhost:3000

## Current baseline behavior

- `GET /api/health` returns health metadata.
- Frontend displays API health status and lets you refresh the check.

## Next steps

- Add the actual ephemeral typewriter domain features.
- Add persistence policy and session lifetime logic (if needed).
- Add tests for API routes and UI behavior.

