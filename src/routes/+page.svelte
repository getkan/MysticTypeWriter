<script lang="ts">
	import Typewriter from "$lib/components/icons/Typewriter.svelte";
	import { resolve } from "$app/paths";
	import { onMount } from "svelte";
	import { STORAGE_KEY } from "$lib/model/constants";
	import { DISAPPEARANCE_MODES, type TypewriterConfig } from "$lib/model/types";
	import { getConfig, updateConfig } from "$lib/state/config.svelte";
	import { playTypewriterSound } from "$lib/features/typewriter/audio/audio.svelte";

	onMount(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);

			if (stored) {
				const parsed = JSON.parse(stored) as Partial<TypewriterConfig>;
				updateConfig(parsed);
			} else {
				updateConfig({
					disappearanceMode: "line",
					timeoutEnabled: true,
					animationsEnabled: true,
					soundEffectsEnabled: false,
				});
				localStorage.setItem(STORAGE_KEY, JSON.stringify(getConfig()));
			}
		} catch {
			localStorage.removeItem(STORAGE_KEY);
		}
	});

	let configState = $state(getConfig());
</script>

<div
	class="border-offwhite bg-background relative flex flex-col gap-8 rounded-lg border-2 p-8 md:min-w-200"
>
	<h1
		class="bg-background absolute -top-4 left-2 flex transform flex-nowrap items-center gap-2 px-4 text-[1.5rem] font-bold sm:-top-8 sm:text-[2rem]"
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
					onchange={(e) => {
						updateConfig({
							soundEffectsEnabled: (e.currentTarget as HTMLInputElement)
								.checked,
						});
						if ((e.currentTarget as HTMLInputElement).checked) {
							playTypewriterSound();
						}
					}}
				/>
				<span>Sound effects enabled</span>
			</label>

			<a
				href={resolve("/typewriter")}
				class="ml-auto flex w-fit items-baseline gap-2 rounded-lg p-2"
				>Start Writing<span class="text-[2rem] leading-4">→</span></a
			>
		</div>
	</div>
</div>
