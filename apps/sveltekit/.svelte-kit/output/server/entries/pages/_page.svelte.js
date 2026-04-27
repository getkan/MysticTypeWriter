import { p as attr, e as escape_html } from "../../chunks/attributes.js";
class TypewriterConfig {
  disappearanceMode;
  strictEditing;
  animationsEnabled;
  soundEffectsEnabled;
  constructor(input = {}) {
    this.disappearanceMode = input.disappearanceMode ?? "sentence";
    this.strictEditing = input.strictEditing ?? true;
    this.animationsEnabled = input.animationsEnabled ?? true;
    this.soundEffectsEnabled = input.soundEffectsEnabled ?? false;
    this.validate();
  }
  validate() {
    if (!["line", "sentence", "page", "timeout"].includes(this.disappearanceMode)) {
      throw new Error("disappearanceMode must be one of: line, sentence, page, timeout");
    }
  }
  with(changes) {
    return new TypewriterConfig({
      disappearanceMode: changes.disappearanceMode ?? this.disappearanceMode,
      strictEditing: changes.strictEditing ?? this.strictEditing,
      animationsEnabled: changes.animationsEnabled ?? this.animationsEnabled,
      soundEffectsEnabled: changes.soundEffectsEnabled ?? this.soundEffectsEnabled
    });
  }
  toJSON() {
    return {
      disappearanceMode: this.disappearanceMode,
      strictEditing: this.strictEditing,
      animationsEnabled: this.animationsEnabled,
      soundEffectsEnabled: this.soundEffectsEnabled
    };
  }
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const STORAGE_KEY = "forwardtothevoid:typewriter-config";
    let typewriterConfig = new TypewriterConfig();
    let configDraft = typewriterConfig.toJSON();
    let configError = "";
    let hasMounted = false;
    let loading = true;
    let error = "";
    let health = null;
    const loadHealth = async () => {
      loading = true;
      error = "";
      try {
        const response = await fetch("/api/health");
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }
        health = await response.json();
      } catch (err) {
        error = err instanceof Error ? err.message : "Unknown error";
        health = null;
      } finally {
        loading = false;
      }
    };
    loadHealth();
    {
      try {
        const next = new TypewriterConfig(configDraft);
        typewriterConfig = next;
        configError = "";
        if (hasMounted) ;
      } catch (err) {
        configError = err instanceof Error ? err.message : "Invalid configuration";
      }
    }
    $$renderer2.push(`<main class="mx-auto flex min-h-screen w-full max-w-3xl items-center p-6 md:p-10"><section class="w-full rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-2xl backdrop-blur"><p class="text-sm uppercase tracking-[0.2em] text-cyan-300/90">ForwardToTheVoid</p> <h1 class="mt-3 font-display text-4xl font-bold text-white md:text-5xl">An ephemeral typewriter app scaffold</h1> <p class="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">This starter uses SvelteKit + Tailwind for the UI and Express + TypeScript for the API.</p> <div class="mt-8 rounded-2xl border border-slate-700 bg-slate-950/80 p-5"><p class="text-xs uppercase tracking-[0.18em] text-slate-400">Typewriter config</p> <p class="mt-2 text-sm text-slate-300">Changes are validated and saved in your browser automatically.</p> <div class="mt-5 grid gap-4 md:grid-cols-2"><label class="flex flex-col gap-2 text-sm text-slate-200"><span class="text-slate-400">Disappearance mode</span> `);
    $$renderer2.select(
      {
        class: "rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100",
        value: configDraft.disappearanceMode
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "line" }, ($$renderer4) => {
          $$renderer4.push(`line`);
        });
        $$renderer3.option({ value: "sentence" }, ($$renderer4) => {
          $$renderer4.push(`sentence`);
        });
        $$renderer3.option({ value: "page" }, ($$renderer4) => {
          $$renderer4.push(`page`);
        });
        $$renderer3.option({ value: "timeout" }, ($$renderer4) => {
          $$renderer4.push(`timeout`);
        });
      }
    );
    $$renderer2.push(`</label> <label class="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"><input type="checkbox"${attr("checked", configDraft.strictEditing, true)}/> Strict editing</label> <label class="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"><input type="checkbox"${attr("checked", configDraft.animationsEnabled, true)}/> Animations enabled</label> <label class="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"><input type="checkbox"${attr("checked", configDraft.soundEffectsEnabled, true)}/> Sound effects enabled</label></div> <div class="mt-5 flex flex-wrap gap-3"><button class="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-white" type="button">Reset to defaults</button></div> `);
    if (configError) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-4 text-sm text-rose-300">Config error: ${escape_html(configError)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="mt-4 space-y-1 text-sm text-slate-300"><p><span class="text-slate-400">Effective mode:</span> ${escape_html(typewriterConfig.disappearanceMode)}</p> <p><span class="text-slate-400">Strict editing:</span> ${escape_html(typewriterConfig.strictEditing ? "enabled" : "disabled")}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="mt-6 rounded-2xl border border-slate-700 bg-slate-950/80 p-5"><p class="text-xs uppercase tracking-[0.18em] text-slate-400">API status</p> `);
    if (loading) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-3 text-slate-200">Checking server health...</p>`);
    } else if (error) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<p class="mt-3 text-rose-300">Request failed: ${escape_html(error)}</p>`);
    } else if (health) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div class="mt-3 space-y-2 text-slate-100"><p><span class="text-slate-400">App:</span> ${escape_html(health.app)}</p> <p><span class="text-slate-400">Healthy:</span> ${escape_html(health.ok ? "yes" : "no")}</p> <p><span class="text-slate-400">Timestamp:</span> ${escape_html(new Date(health.timestamp).toLocaleString())}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button class="mt-6 rounded-xl bg-cyan-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-300">Refresh health check</button></div></section></main>`);
  });
}
export {
  _page as default
};
