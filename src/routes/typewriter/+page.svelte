<script lang="ts">
	import { getConfig, updateConfig } from "$lib/state/config.svelte";
	import {
		getTypewriterInput,
		setTypewriterInput,
	} from "$lib/state/typewriter.svelte";
	import { onDestroy, onMount } from "svelte";
	import { STORAGE_KEY } from "$lib/model/constants";
	import type { TypewriterConfig } from "$lib/model/types";
	import { resolve } from "$app/paths";
	import {
		playTypewriterSound,
		playReturnSound,
	} from "$lib/features/typewriter/audio/audio.svelte";
	import { goto } from "$app/navigation";
	import SoundOn from "$lib/components/icons/SoundOn.svelte";
	import SoundOff from "$lib/components/icons/SoundOff.svelte";
	import Typewriter from "$lib/components/icons/Typewriter.svelte";
	import {
		parseInput,
		type ParsedChunk,
	} from "$lib/features/typewriter/logic/parseInput";
	import {
		initiateTimeout,
		destroyTimeout,
		getTimeRemaining,
	} from "$lib/features/typewriter/logic/timeout.svelte";
	import {
		focusEditor,
		insertNewline,
	} from "$lib/features/typewriter/logic/editor";

	let configState = $derived.by(() => getConfig());
	let typewriterInput = $derived.by(() => getTypewriterInput());
	const timeRemaining = $derived.by(() => getTimeRemaining());

	let inputRef: HTMLSpanElement | null = null;
	let lineRef: HTMLDivElement | null = null;
	let cursorRef: HTMLSpanElement | null = null;

	const checkCursorEdgeIntersection = () => {
		if (!cursorRef || !configState.soundEffectsEnabled) return;
		const parent = cursorRef.parentElement;
		if (!parent) return;
		const cursorRect = cursorRef.getBoundingClientRect();
		const parentRect = parent.getBoundingClientRect();
		if (cursorRect.right >= parentRect.right - 8) {
			playReturnSound();
		}
	};

	onMount(() => {
		try {
			setTypewriterInput("");

			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored) as Partial<TypewriterConfig>;
				updateConfig(parsed);
			}

			if (configState.timeoutEnabled) {
				initiateTimeout();
			}

			focusEditor(inputRef);
		} catch {
			localStorage.removeItem(STORAGE_KEY);
			goto(resolve("/"));
		}
	});

	const soundEnabled = $derived.by(() => getConfig().soundEffectsEnabled);
	const onSoundToggle = () => {
		updateConfig({ soundEffectsEnabled: !soundEnabled });
		focusEditor(inputRef);
	};

	onDestroy(() => {
		destroyTimeout();
	});

	const onkeydownTypewriter = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			insertNewline(inputRef);
			setTypewriterInput(inputRef?.innerText ?? "");
			return;
		}

		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault();
		}
		if (
			configState.timeoutEnabled &&
			!["Shift", "Control", "Alt", "Meta", "Backspace", "Delete"].includes(
				e.key,
			)
		) {
			initiateTimeout();
		}

		if (configState.soundEffectsEnabled) {
			playTypewriterSound();
		}
		focusEditor(inputRef);
	};

	const inputTypewriter = (
		e: Event & { currentTarget: EventTarget & HTMLSpanElement },
	) => {
		setTypewriterInput(e.currentTarget.innerText);
		requestAnimationFrame(checkCursorEdgeIntersection);
	};

	const parsedChunks = $derived.by((): ParsedChunk[] =>
		parseInput(typewriterInput, configState.disappearanceMode, lineRef),
	);
</script>

<div
	class="border-offwhite bg-background sm: relative flex h-109 w-[90vw] max-w-250 flex-col justify-end rounded-lg border-2 p-8 sm:h-80"
	onclick={() => inputRef?.focus()}
	onkeydown={() => {}}
	role="button"
	tabindex="0"
	aria-label="Typewriter input area, click to focus"
>
	<h1
		class="bg-background absolute -top-6 right-8 z-2 px-2 text-[2rem] font-bold"
	>
		{#if configState.timeoutEnabled && timeRemaining <= 10000}
			<span class="text-3xl">{Math.ceil(timeRemaining / 1000)}</span>
		{:else}
			<Typewriter />
		{/if}
	</h1>

	<a
		href={resolve("/")}
		class="absolute -top-12 left-0 flex w-fit items-baseline gap-2 rounded-lg p-2"
		><span class="text-[2rem] leading-4">←</span>Back</a
	>

	<div class="absolute inset-0 overflow-hidden">
		<span
			class="bg-background absolute top-0 right-0 left-0 z-4 h-4.5 rounded-t-lg"
		></span>
		<span
			class="bg-background absolute top-0 right-0 left-0 z-4 h-10 rounded-t-lg opacity-66"
		></span>
		<span
			class="bg-background absolute top-0 right-0 left-0 z-4 h-16.5 rounded-t-lg opacity-33"
		></span>
		<div
			contenteditable="true"
			role="textbox"
			tabindex="0"
			class="absolute right-8 bottom-8 left-8 block text-left wrap-break-word whitespace-pre-wrap text-transparent outline-none"
			spellcheck="false"
			bind:this={inputRef}
			onkeydown={onkeydownTypewriter}
			oninput={inputTypewriter}
			onpaste={(e) => e.preventDefault()}
		></div>

		<div
			class="pointer-events-none absolute right-8 bottom-8 left-8 block text-left wrap-break-word whitespace-pre-wrap"
		>
			{#each parsedChunks as chunk}
				{@render Chunk(chunk.text, chunk.opacity, chunk.blur)}
			{/each}<span
				bind:this={cursorRef}
				class="animate-blink ml-1 inline-block h-[1.1em] w-1 bg-current align-middle"
			></span>
		</div>
		<div
			bind:this={lineRef}
			class="pointer-events-none invisible absolute right-8 bottom-8 left-8 text-left wrap-break-word whitespace-pre-wrap"
		></div>
	</div>
	<button
		onclick={onSoundToggle}
		class="absolute -bottom-12 left-4 cursor-pointer"
	>
		{#if soundEnabled}
			<SoundOn class="h-8 w-8" />
		{:else}
			<SoundOff class="h-8 w-8" />
		{/if}
	</button>
	<a
		href={resolve("/share")}
		class="border-offwhite bg-background hover:bg-highlight-dark focus:bg-highlight-dark absolute right-1 -bottom-17 flex w-fit justify-center gap-2 rounded-lg border-2 p-2 text-3xl font-bold"
		>Done!</a
	>
</div>

{#snippet Chunk(text: string, opacity: number, blur: number = 0)}
	<span style="opacity:{opacity}%; filter: blur({blur}px);">{text}</span>
{/snippet}
