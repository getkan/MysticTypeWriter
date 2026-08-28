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
		drawTypewriter,
		layoutLines,
		measureCanvas,
	} from "$lib/features/typewriter/logic/canvasRender";
	import {
		initiateTimeout,
		destroyTimeout,
		getTimeRemaining,
	} from "$lib/features/typewriter/logic/timeout.svelte";
	import {
		focusEditor,
		insertNewline,
		readEditorText,
	} from "$lib/features/typewriter/logic/editor";

	let configState = $derived.by(() => getConfig());
	let typewriterInput = $derived.by(() => getTypewriterInput());
	const timeRemaining = $derived.by(() => getTimeRemaining());

	let inputRef: HTMLDivElement | null = null;
	let containerRef = $state<HTMLDivElement | null>(null);
	let canvasRef = $state<HTMLCanvasElement | null>(null);
	let canvasWidth = $state(0);
	let canvasHeight = $state(0);
	let cursorVisible = $state(true);
	let viewportHeight = $state(0);
	let viewportTop = $state(0);

	let blinkTimer = -1;
	let resizeObserver: ResizeObserver | null = null;
	let previousLineCount = 1;
	let detachViewport: (() => void) | null = null;

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

		blinkTimer = setInterval(() => {
			cursorVisible = !cursorVisible;
		}, 600);

		if (containerRef) {
			resizeObserver = new ResizeObserver(([entry]) => {
				canvasWidth = entry.contentRect.width;
				canvasHeight = entry.contentRect.height;
			});
			resizeObserver.observe(containerRef);
		}

		// The visual viewport shrinks and scrolls when the mobile keyboard opens,
		// so the typewriter is pinned to it rather than to the layout viewport.
		const viewport = window.visualViewport;
		const syncViewport = () => {
			viewportHeight = viewport?.height ?? window.innerHeight;
			viewportTop = viewport?.offsetTop ?? 0;
		};
		syncViewport();

		if (viewport) {
			viewport.addEventListener("resize", syncViewport);
			viewport.addEventListener("scroll", syncViewport);
			detachViewport = () => {
				viewport.removeEventListener("resize", syncViewport);
				viewport.removeEventListener("scroll", syncViewport);
			};
		} else {
			window.addEventListener("resize", syncViewport);
			detachViewport = () => window.removeEventListener("resize", syncViewport);
		}
	});

	onDestroy(() => {
		destroyTimeout();
		if (blinkTimer !== -1) clearInterval(blinkTimer);
		resizeObserver?.disconnect();
		detachViewport?.();
	});

	$effect(() => {
		const canvas = canvasRef;
		const width = canvasWidth;
		const height = canvasHeight;
		const input = typewriterInput;
		const mode = configState.disappearanceMode;
		const visible = cursorVisible;

		if (!canvas || width === 0 || height === 0) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		// A canvas is a replaced element, so `inset` alone will not size it: the
		// intrinsic width/height attributes win. Set the CSS box explicitly.
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		const metrics = measureCanvas(ctx, canvas, width);
		const lines = layoutLines(input, mode, metrics.charsPerLine);

		drawTypewriter(ctx, {
			width,
			height,
			lines,
			metrics,
			cursorVisible: visible,
		});

		if (lines.length > previousLineCount && configState.soundEffectsEnabled) {
			playReturnSound();
		}
		previousLineCount = lines.length;
	});

	const soundEnabled = $derived.by(() => getConfig().soundEffectsEnabled);
	const onSoundToggle = () => {
		updateConfig({ soundEffectsEnabled: !soundEnabled });
		focusEditor(inputRef);
	};

	const onkeydownTypewriter = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			insertNewline(inputRef);

			setTypewriterInput(readEditorText(inputRef));
			return;
		}

		const prevent =
			configState.strictEditing &&
			(e.key === "Backspace" || e.key === "Delete");
		if (prevent) {
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

		if (configState.soundEffectsEnabled && !prevent) {
			playTypewriterSound();
		}
		focusEditor(inputRef);
	};

	const inputTypewriter = () => {
		setTypewriterInput(readEditorText(inputRef));
	};
</script>

<div
	class="fixed left-0 z-10 flex w-full items-center justify-center pt-14 pb-20"
	style="top: {viewportTop}px; height: {viewportHeight}px;"
>
	<div
		class="border-offwhite bg-background relative flex h-109 max-h-full w-[90vw] max-w-250 flex-col justify-end rounded-lg border-2 p-8 sm:h-80"
		onclick={() => inputRef?.focus()}
		onkeydown={() => {}}
		role="button"
		tabindex="0"
		aria-label="Typewriter input area, click to focus"
	>
		<h1
			class="bg-background absolute -top-6 right-8 z-8 px-2 text-[2rem] font-bold"
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

		<div bind:this={containerRef} class="absolute inset-8 overflow-hidden">
			<div
				contenteditable="true"
				role="textbox"
				tabindex="0"
				class="absolute right-0 bottom-0 left-0 block text-left wrap-break-word whitespace-pre-wrap text-transparent caret-transparent outline-none"
				spellcheck="false"
				bind:this={inputRef}
				onkeydown={onkeydownTypewriter}
				oninput={inputTypewriter}
				onpaste={(e) => e.preventDefault()}
			></div>

			<canvas
				bind:this={canvasRef}
				class="text-offwhite pointer-events-none absolute top-0 left-0 block leading-relaxed"
			></canvas>
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
</div>
