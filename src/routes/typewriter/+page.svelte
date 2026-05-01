<script lang="ts">
	import {
		config,
		updateConfig,
		getTypewriterInput,
		setTypewriterInput,
	} from "../state.svelte";
	import { onDestroy, onMount } from "svelte";
	import {
		STORAGE_KEY,
		type TypewriterConfig,
		DISAPPEARANCE_CONFIG,
	} from "$lib/TypewriterConfig";
	import { resolve } from "$app/paths";
	import { playTypewriterSound, playReturnSound } from "./audio.svelte";
	import { goto } from "$app/navigation";
	import SoundOn from "./SoundOn.svelte";
	import SoundOff from "./SoundOff.svelte";
	import Typewriter from "$lib/Typewriter.svelte";

	type ParsedChunk = {
		text: string;
		opacity: number;
	};

	let configState = $derived.by(() => config());
	let typewriterInput = $derived.by(() => getTypewriterInput());

	let inputRef: HTMLSpanElement | null = null;
	let lineRef: HTMLDivElement | null = null;

	const focusTypewriter = () => {
		inputRef?.focus();
		const sel = window.getSelection();
		if (inputRef && sel) {
			const range = document.createRange();
			range.selectNodeContents(inputRef);
			range.collapse(false);
			sel.removeAllRanges();
			sel.addRange(range);
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

			focusTypewriter();
		} catch {
			localStorage.removeItem(STORAGE_KEY);
			goto(resolve("/"));
		}
	});

	const soundEnabled = $derived.by(() => config().soundEffectsEnabled);
	const onSoundToggle = () => {
		updateConfig({ soundEffectsEnabled: !soundEnabled });
		focusTypewriter();
	};

	let timer = -1;
	let timeoutStart = $state(Date.now());
	let timeRemaining = $state(30000);
	const initiateTimeout = () => {
		if (timer !== -1) {
			clearInterval(timer);
			timeoutStart = Date.now();
			timeRemaining = 30000;
		}
		timer = setInterval(() => {
			timeRemaining = Math.max(0, 30000 - (Date.now() - timeoutStart));
			if (timeRemaining <= 0) {
				goto(resolve("/share"));
			}
		}, 500);
	};

	onDestroy(() => {
		if (timer !== -1) {
			clearInterval(timer);
		}
	});

	const onkeydownTypewriter = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const sel = window.getSelection();
			if (sel && sel.rangeCount > 0) {
				const range = sel.getRangeAt(0);
				range.deleteContents();

				const newline = document.createTextNode("\n");
				range.insertNode(newline);
				range.setStartAfter(newline);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
			}

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
		focusTypewriter();
	};

	const onkeyupTypewriter = () => {
		if (configState.soundEffectsEnabled) {
			playTypewriterSound();
		}
	};

	const inputTypewriter = (
		e: Event & { currentTarget: EventTarget & HTMLSpanElement },
	) => {
		const cleaned = e.currentTarget.innerText
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
		setTypewriterInput(cleaned);
	};

	const parsedChunks = $derived.by((): ParsedChunk[] => {
		let input = typewriterInput;
		if (!configState.disappearanceMode) {
			return [{ text: input, opacity: 100 }];
		}

		const { disappearanceMode } = configState;
		const regexes: Record<string, RegExp> = {
			sentence: /[^.!?]*[.!?]*/g,
			word: /\S+\s*/g,
		};
		const { show, fade } = DISAPPEARANCE_CONFIG[disappearanceMode];
		let matchArray = [];
		if (disappearanceMode === "line") {
			if (!lineRef) {
				return [{ text: input, opacity: 100 }];
			}

			// Build measurement spans from the current input value.
			lineRef.innerHTML = input.replace(
				/\S+\s*/g,
				(match) => `<span>${match}</span>`,
			);

			let spans = Array.from(lineRef.querySelectorAll("span"));

			if (spans.length === 0) {
				return [{ text: input, opacity: 100 }];
			}

			// Loop through words and start a new chunk when the rendered line changes.
			let top: number | null = null;
			for (let i = 0; i < spans.length; i++) {
				const rect = spans[i].getBoundingClientRect();
				const roundedTop = Math.round(rect.top);
				if (top === null || roundedTop > top) {
					matchArray.push("");
					top = roundedTop;
				}
				matchArray[matchArray.length - 1] += spans[i].textContent;
			}
		} else {
			const regex = regexes[disappearanceMode] || regexes["word"];
			matchArray = input.match(regex)?.filter(Boolean) || [];
		}

		const matchArrayLn = matchArray.length;
		const hideUntil = matchArrayLn - (show + fade);
		const fadeUntil = matchArrayLn - show;
		let fadeCount = 0;

		return matchArray.flatMap((item, index) => {
			if (hideUntil && index < hideUntil) {
				return { text: item, opacity: 0 };
			}

			if (fadeUntil && index < fadeUntil) {
				if (fade > 1) {
					fadeCount += 1;
					const opacity = Math.max(
						0,
						Math.min(100, Math.round((100 / (fade + 1)) * fadeCount)),
					);
					return { text: item, opacity };
				}
				return { text: item, opacity: 50 };
			}

			return { text: item, opacity: 100 };
		});
	});
</script>

<div
	class="border-offwhite bg-background relative flex h-72 w-[90vw] max-w-250 flex-col justify-end rounded-lg border-2 p-4 sm:h-96 sm:p-8 md:h-120 lg:h-144"
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

	<div
		class="after:bg-background absolute inset-0 overflow-hidden after:absolute after:top-0 after:right-0 after:left-0 after:h-8 after:rounded-t-lg after:opacity-50 after:content-['']"
	>
		<div
			contenteditable="true"
			role="textbox"
			tabindex="0"
			class="absolute right-8 bottom-1/4 left-8 block text-left wrap-break-word whitespace-pre-wrap text-transparent outline-none sm:bottom-1/4 md:bottom-1/3"
			spellcheck="false"
			bind:this={inputRef}
			onkeydown={onkeydownTypewriter}
			onkeyup={onkeyupTypewriter}
			oninput={inputTypewriter}
			onpaste={(e) => e.preventDefault()}
		></div>

		<div
			class="pointer-events-none absolute right-8 bottom-4 left-8 block text-left wrap-break-word whitespace-pre-wrap sm:bottom-1/4 md:bottom-1/3"
		>
			{#each parsedChunks as chunk}
				{@render Chunk(chunk.text, chunk.opacity)}
			{/each}<span
				class="animate-blink ml-1 inline-block h-[1.1em] w-1 bg-current align-middle"
			></span>
		</div>
		<div
			bind:this={lineRef}
			class="pointer-events-none invisible absolute right-8 bottom-4 left-8 text-left wrap-break-word whitespace-pre-wrap sm:bottom-1/4 md:bottom-1/3"
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
		class="border-offwhite absolute right-1 -bottom-17 flex w-fit items-baseline gap-2 rounded-lg border-2 p-2 text-3xl font-bold"
		>Done!</a
	>
</div>

{#snippet Chunk(text: string, opacity: number)}
	<span style="opacity:{opacity}%">{text}</span>
{/snippet}

<span class="hidden">{typewriterInput}</span>
