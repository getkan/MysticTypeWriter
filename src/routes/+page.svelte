<script lang="ts">
    import Typewriter from '$lib/Typewriter.svelte';
    import { onMount } from 'svelte';
    import { STORAGE_KEY, DISAPPEARANCE_MODES, TypewriterConfigInput, type TypewriterConfig } from "$lib/TypewriterConfig";
    import { state as configState } from './config.svelte';

    let typewriterConfigInput = $state(new TypewriterConfigInput());

    onMount(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);

            if (stored) {
                const parsed = JSON.parse(stored) as Partial<TypewriterConfigInput>;
                typewriterConfigInput = new TypewriterConfigInput(parsed);
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        } 
    });

    function updateConfig(changes: Partial<TypewriterConfig>) {
        typewriterConfigInput = typewriterConfigInput.with(changes);
    }

    $effect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(typewriterConfigInput));
        configState.config = typewriterConfigInput.toTypewriterConfig();
    });
</script>

<h1 class="font-bold bg-background text-[1.5rem] flex md:hidden items-center gap-2">
    <Typewriter />
    <span>Forward to the Void</span>
</h1>
<div class="border-2 border-offwhite rounded-lg p-8 relative md:min-w-200 flex flex-col gap-8">
    <h1 class="absolute font-bold bg-background text-[2rem] px-4 -top-8 hidden md:flex items-center gap-2 ">
        <Typewriter />
        <span class="whitespace-nowrap">Forward to the Void</span>
    </h1>
    <p class="max-w-175">This is a typewriter - no editing is allowed. As you write, the words you write will disappear slowly. You will only see the full story once it's complete.</p>
    <div>
        <h2 class="font-bold text-[1.5rem] mb-4">Configuration</h2>

        <div class="grid gap-4">
            <label class="flex flex-col gap-1">
                <span class="text-sm opacity-80">Disappearance mode</span>
                <select
                    class="bg-highlight-dark border border-highlight-light rounded px-3 py-2"
                    value={typewriterConfigInput.disappearanceMode}
                    onchange={(e) =>
                        updateConfig({
                            disappearanceMode: (e.currentTarget as HTMLSelectElement).value as TypewriterConfig['disappearanceMode']
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
                    checked={typewriterConfigInput.strictEditing}
                    onchange={(e) =>
                        updateConfig({ strictEditing: (e.currentTarget as HTMLInputElement).checked })}
                />
                <span>Strict editing - editing of last {configState?.config?.disappearanceMode} is {typewriterConfigInput.strictEditing ? "allowed" : "not allowed"}</span>
            </label>

            <!-- <label class="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={typewriterConfigInput.animationsEnabled}
                    onchange={(e) =>
                        updateConfig({ animationsEnabled: (e.currentTarget as HTMLInputElement).checked })}
                />
                <span>Animations enabled</span>
            </label>

            <label class="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={typewriterConfigInput.soundEffectsEnabled}
                    onchange={(e) =>
                        updateConfig({ soundEffectsEnabled: (e.currentTarget as HTMLInputElement).checked })}
                />
                <span>Sound effects enabled</span>
            </label> -->

            <a href="/typewriter" class="w-fit ml-auto rounded-lg p-2 flex gap-2 items-baseline">Start Writing<span class="text-[2rem] leading-[1rem]">→</span></a>
        </div>
    </div>
</div>