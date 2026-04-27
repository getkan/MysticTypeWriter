<script lang="ts">
  import { onMount } from "svelte";
  import { TypewriterConfig, type TypewriterConfigInput } from "$lib/TypewriterConfig";

  type HealthResponse = {
    ok: boolean;
    app: string;
    timestamp: string;
  };

  const STORAGE_KEY = "forwardtothevoid:typewriter-config";

  let typewriterConfig = new TypewriterConfig();
  let configDraft: TypewriterConfigInput = typewriterConfig.toJSON();
  let configError = "";
  let hasMounted = false;

  let loading = true;
  let error = "";
  let health: HealthResponse | null = null;

  onMount(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as Partial<TypewriterConfigInput>;
        const loaded = new TypewriterConfig(parsed);
        typewriterConfig = loaded;
        configDraft = loaded.toJSON();
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      hasMounted = true;
    }
  });

  $: {
    try {
      const next = new TypewriterConfig(configDraft);
      typewriterConfig = next;
      configError = "";

      if (hasMounted) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next.toJSON()));
      }
    } catch (err) {
      configError = err instanceof Error ? err.message : "Invalid configuration";
    }
  }

  const resetConfig = () => {
    const defaults = new TypewriterConfig();
    configDraft = defaults.toJSON();
  };

  const loadHealth = async () => {
    loading = true;
    error = "";

    try {
      const response = await fetch("/api/health");

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      health = (await response.json()) as HealthResponse;
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
      health = null;
    } finally {
      loading = false;
    }
  };

  loadHealth();
</script>

<main class="mx-auto flex min-h-screen w-full max-w-3xl items-center p-6 md:p-10">
  <section class="w-full rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-2xl backdrop-blur">
    <p class="text-sm uppercase tracking-[0.2em] text-cyan-300/90">ForwardToTheVoid</p>
    <h1 class="mt-3 font-display text-4xl font-bold text-white md:text-5xl">An ephemeral typewriter app scaffold</h1>
    <p class="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
      This starter uses SvelteKit + Tailwind for the UI and Express + TypeScript for the API.
    </p>

    <div class="mt-8 rounded-2xl border border-slate-700 bg-slate-950/80 p-5">
      <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Typewriter config</p>
      <p class="mt-2 text-sm text-slate-300">Changes are validated and saved in your browser automatically.</p>

      <div class="mt-5 grid gap-4 md:grid-cols-2">
        <label class="flex flex-col gap-2 text-sm text-slate-200">
          <span class="text-slate-400">Disappearance mode</span>
          <select
            class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
            bind:value={configDraft.disappearanceMode}
          >
            <option value="line">line</option>
            <option value="sentence">sentence</option>
            <option value="page">page</option>
            <option value="timeout">timeout</option>
          </select>
        </label>

        <label class="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
          <input type="checkbox" bind:checked={configDraft.strictEditing} />
          Strict editing
        </label>

        <label class="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
          <input type="checkbox" bind:checked={configDraft.animationsEnabled} />
          Animations enabled
        </label>

        <label class="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100">
          <input type="checkbox" bind:checked={configDraft.soundEffectsEnabled} />
          Sound effects enabled
        </label>
      </div>

      <div class="mt-5 flex flex-wrap gap-3">
        <button
          class="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-white"
          on:click={resetConfig}
          type="button"
        >
          Reset to defaults
        </button>
      </div>

      {#if configError}
        <p class="mt-4 text-sm text-rose-300">Config error: {configError}</p>
      {:else}
        <div class="mt-4 space-y-1 text-sm text-slate-300">
          <p>
            <span class="text-slate-400">Effective mode:</span>
            {typewriterConfig.disappearanceMode}
          </p>
          <p>
            <span class="text-slate-400">Strict editing:</span>
            {typewriterConfig.strictEditing ? "enabled" : "disabled"}
          </p>
        </div>
      {/if}
    </div>

    <div class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/80 p-5">
      <p class="text-xs uppercase tracking-[0.18em] text-slate-400">API status</p>

      {#if loading}
        <p class="mt-3 text-slate-200">Checking server health...</p>
      {:else if error}
        <p class="mt-3 text-rose-300">Request failed: {error}</p>
      {:else if health}
        <div class="mt-3 space-y-2 text-slate-100">
          <p><span class="text-slate-400">App:</span> {health.app}</p>
          <p><span class="text-slate-400">Healthy:</span> {health.ok ? "yes" : "no"}</p>
          <p><span class="text-slate-400">Timestamp:</span> {new Date(health.timestamp).toLocaleString()}</p>
        </div>
      {/if}

      <button
        class="mt-6 rounded-xl bg-cyan-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-300"
        on:click={loadHealth}
      >
        Refresh health check
      </button>
    </div>
  </section>
</main>
