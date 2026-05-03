# Add a Node Backend for Snippet Storage

This guide explains how to add a Node-powered backend to this SvelteKit project so users can save text snippets and view them on another page.

## Goal

- Save user input from the writing flow.
- Persist snippets on the server.
- Display saved snippets in a dedicated gallery page.

## 1. Switch to a Node runtime adapter

The current app uses a static adapter, which cannot run server API routes for persistent POST and GET operations.

1. Install the Node adapter:

```sh
npm install -D @sveltejs/adapter-node
```

2. Update `svelte.config.js`:

- Replace `@sveltejs/adapter-static` import with `@sveltejs/adapter-node`.
- Set `kit.adapter = adapter()`.

Expected result:

- The app can run server endpoints and Node file-system logic.

## 2. Add a SQL database layer (SQLite first)

Use SQLite for local development and small deployments. It is SQL, requires minimal setup, and works well with SvelteKit on Node.

Install DB tooling:

```sh
npm install drizzle-orm better-sqlite3 zod
npm install -D drizzle-kit @types/better-sqlite3
```

Create DB config:

- `drizzle.config.ts`

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/lib/server/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: "./data/mystic.db",
	},
});
```

Create schema file:

- `src/lib/server/db/schema.ts`

```ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const snippets = sqliteTable("snippets", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	text: text("text").notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});
```

Create DB client:

- `src/lib/server/db/client.ts`

```ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqlite = new Database("data/mystic.db");
export const db = drizzle(sqlite);
```

Generate and apply migration:

```sh
npx drizzle-kit generate
npx drizzle-kit migrate
```

Expected result:

- A SQL database file at `data/mystic.db`.
- A `snippets` table managed by migrations.

## 3. Create a server-side snippet repository

Add a SQL-backed repository module:

- `src/lib/server/snippets/store.ts`

Recommended implementation:

- Use Drizzle queries against the `snippets` table.
- Return rows in descending `createdAt` order.
- Keep route handlers thin by placing data access in this module.

Minimum API for the module:

- `addSnippet(text: string)`
- `listSnippets()`

Validation rules:

- Reject empty text.
- Trim whitespace.
- Enforce a max length (example: 5000 chars).
- Check for offensive content and injection patterns as needed.

## 4. Add API routes

Create endpoint file:

- `src/routes/api/snippets/+server.ts`

Implement handlers:

1. `POST`

- Parse JSON body `{ text: string }`.
- Validate input.
- Save snippet through `addSnippet`.
- Return `201` with saved snippet.

2. `GET`

- Return snippets from `listSnippets`.
- Return `200` with an array sorted newest first.

Error handling:

- Return structured JSON errors with proper status codes.

## 5. Save text from the writing flow

Update the writing completion action in:

- `src/routes/typewriter/+page.svelte`

Recommended behavior:

1. On Done click, send `POST` to `/api/snippets` with current text.
2. If save succeeds, navigate to gallery page.
3. If save fails, show an inline error and allow retry.

Implementation note:

- Keep the existing user flow intact by adding save logic before navigation.

## 6. Add a page to display saved snippets

Create a new gallery route:

- `src/routes/gallery/+page.server.ts`
- `src/routes/gallery/+page.svelte`

Server load (`+page.server.ts`):

- Read snippets from storage and return as page data.

UI page (`+page.svelte`):

- Render snippet list.
- Show created timestamp.
- Show an empty state when no snippets exist.

## 7. Add navigation links

Add links to the new gallery page in existing UI:

- `src/routes/+page.svelte`
- `src/routes/share/+page.svelte`

Suggested labels:

- View Gallery
- Saved Snippets

## 8. Update project documentation

Update `README.md` with:

- Node runtime requirement (no longer static-only).
- Build and run instructions for Node output:

```sh
npm run build
node build
```

- Note that `data/mystic.db` is a local SQLite database file.
- Warning that local disk can be ephemeral on some hosts.

Also add scripts to `package.json`:

```json
{
	"scripts": {
		"db:generate": "drizzle-kit generate",
		"db:migrate": "drizzle-kit migrate"
	}
}
```

## 9. Handle base path correctly

This project uses a base path in `svelte.config.js`.

When calling API routes from the frontend:

- Prefer base-aware URL handling.
- Avoid hardcoded assumptions that break under `/MysticTypeWriter`.

## 10. Verify end-to-end

Run local checks:

```sh
npm run check
npm run db:generate
npm run db:migrate
npm run build
node build
```

Manual test flow:

1. Start a writing session.
2. Enter text.
3. Click Done to save.
4. Open gallery page.
5. Confirm snippet appears.

## 11. Production path (Postgres option)

If you need multi-instance scaling, switch from SQLite to Postgres while keeping the same repository API (`addSnippet`, `listSnippets`).

High-level migration:

1. Change Drizzle dialect and driver to Postgres.
2. Set `DATABASE_URL` in environment variables.
3. Run migrations against the Postgres database.
4. Keep route handlers unchanged.
