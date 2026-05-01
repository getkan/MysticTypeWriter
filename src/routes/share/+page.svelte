<script lang="ts">
	import { onMount } from "svelte";
	import { resolve } from "$app/paths";
	import { getTypewriterInput } from "$lib/state/typewriter.svelte";
	import Typewriter from "$lib/components/icons/Typewriter.svelte";
	import Download from "../../lib/components/icons/Download.svelte";
	let typewriterInput = $derived.by(() => getTypewriterInput());
	let showTooltip = $state(false);

	let isShareSupported = $state(false);

	onMount(() => {
		isShareSupported = !!navigator.share;
	});

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(typewriterInput);
			showTooltip = true;
			setTimeout(() => {
				showTooltip = false;
			}, 2000);
		} catch (err) {
			alert("Failed to copy story: " + err);
		}
	};
	const downloadStory = () => {
		const blob = new Blob([typewriterInput], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "mystic-typewriter-story.txt";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};
</script>

<div
	class="border-offwhite bg-background relative flex w-[90vw] max-w-250 rounded-lg border-2 p-4 text-xl font-bold"
>
	<h1
		class="bg-background absolute -top-8 hidden items-center gap-2 px-4 text-[2rem] font-bold md:flex"
	>
		<Typewriter />
		<span class="whitespace-nowrap">Mystic Type-Writer</span>
	</h1>

	Nothing is saved, once you leave this page the story will disappear. Copy it
	by clicking the box below and paste it somewhere else, or use the button{isShareSupported
		? "s to share it directly or"
		: ""} to download it as a text file. Or let it disappear.
</div>
<button
	onclick={copyToClipboard}
	tabindex="0"
	aria-label="Copy story to clipboard"
	class="border-offwhite bg-background relative flex h-[75vh] max-h-100 w-[90vw] max-w-250 cursor-pointer flex-col gap-8 rounded-lg border-2 p-8"
>
	<div
		class="absolute top-0 right-4 bottom-0 left-4 flex overflow-hidden text-left text-xl"
	>
		{typewriterInput}
	</div>

	{#if showTooltip}
		<div
			class="absolute top-2 right-2 rounded-lg bg-gray-800 px-3 py-2 text-sm whitespace-nowrap text-white"
		>
			Copied to clipboard!
		</div>
	{/if}
</button>
<div class="z-2 flex w-[90vw] max-w-250 justify-between gap-4">
	<a
		href={resolve("/")}
		class="hover:bg-highlight-dark focus:bg-highlight-dark border-offwhiteflex bg-background flex w-fit items-center gap-2 rounded-lg border-2 p-2 font-bold sm:items-baseline"
		><span class="text-[2rem] leading-4">←</span>Start New Session</a
	>
	<div class="flex justify-between gap-2">
		<button
			class="hover:bg-highlight-dark focus:bg-highlight-dark border-offwhiteflex bg-background flex w-fit items-center gap-2 rounded-lg border-2 p-2 font-bold"
			onclick={downloadStory}
		>
			<Download class="fill-offwhite h-6 w-6" />
			Download
		</button>

		{#if isShareSupported}
			<button
				class="border-offwhiteflex bg-background hover:bg-highlight-dark focus:bg-highlight-dark flex w-fit cursor-pointer items-center gap-2 rounded-lg border-2 p-2 font-bold"
				onclick={() =>
					navigator.share({
						title: "Mystic Type-Writer",
						text: typewriterInput,
					})}
			>
				Share
			</button>
		{/if}
	</div>
</div>
