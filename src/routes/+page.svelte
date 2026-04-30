<script lang="ts">
	import Typewriter from "$lib/Typewriter.svelte";
	import { base } from "$app/paths";
	import { onMount } from "svelte";
	import {
		STORAGE_KEY,
		DISAPPEARANCE_MODES,
		type TypewriterConfig,
	} from "$lib/TypewriterConfig";
	import { config, updateConfig } from "./state.svelte";

	onMount(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);

			if (stored) {
				const parsed = JSON.parse(stored) as Partial<TypewriterConfig>;
				updateConfig(parsed);
			}
		} catch {
			localStorage.removeItem(STORAGE_KEY);
		}
	});

	let configState = $state(config());
</script>

<h1
	class="bg-background flex items-center gap-2 text-[1.5rem] font-bold md:hidden"
>
	<Typewriter />
	<span>Mystic Type-Writer</span>
</h1>
<div
	class="border-offwhite bg-background relative flex flex-col gap-8 rounded-lg border-2 p-8 md:min-w-200"
>
	<h1
		class="bg-background absolute -top-8 hidden items-center gap-2 px-4 text-[2rem] font-bold md:flex"
	>
		<Typewriter />
		<span class="whitespace-nowrap">Mystic Type-Writer</span>
	</h1>
	<p class="max-w-200">
		With this mystic typewriter no editing is allowed. As you write, the {configState.disappearanceMode}s
		you write will disappear slowly. You will only see the full story once it's
		complete.
	</p>
	<div>
		<h2 class="mb-4 text-[1.5rem] font-bold">Configuration</h2>

		<div class="grid gap-4">
			<label class="flex flex-col gap-1">
				<span class="text-sm opacity-80">Disappearance mode</span>
				<select
					class="bg-highlight-dark border-highlight-light rounded border px-3 py-2"
					bind:value={configState.disappearanceMode}
					onchange={(e) =>
						updateConfig({
							disappearanceMode: (e.currentTarget as HTMLSelectElement)
								.value as TypewriterConfig["disappearanceMode"],
						})}
				>
					{#each DISAPPEARANCE_MODES as mode}
						<option value={mode}>{mode}</option>
					{/each}
				</select>
			</label>

			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={configState.timeoutEnabled}
					onchange={(e) =>
						updateConfig({
							timeoutEnabled: (e.currentTarget as HTMLInputElement).checked,
						})}
				/>
				<span
					>Timeout - If you don't type for 30 seconds, the typewriter will
					automatically end the session.</span
				>
			</label>

			<!-- <label class="flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={configState.strictEditing}
					onchange={(e) =>
						updateConfig({
							strictEditing: (e.currentTarget as HTMLInputElement).checked,
						})}
				/>
				<span
					>Strict editing - editing of last {configState.disappearanceMode} is {configState.strictEditing
						? "allowed"
						: "not allowed"}</span
				>
			</label> -->

			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={configState.animationsEnabled}
					onchange={(e) =>
						updateConfig({
							animationsEnabled: (e.currentTarget as HTMLInputElement).checked,
						})}
				/>
				<span>Animations enabled</span>
			</label>

			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={configState.soundEffectsEnabled}
					onchange={(e) =>
						updateConfig({
							soundEffectsEnabled: (e.currentTarget as HTMLInputElement)
								.checked,
						})}
				/>
				<span>Sound effects enabled</span>
			</label>

			<a
				href={`${base}/typewriter`}
				class="ml-auto flex w-fit items-baseline gap-2 rounded-lg p-2"
				>Start Writing<span class="text-[2rem] leading-4">→</span></a
			>
		</div>
	</div>
</div>
