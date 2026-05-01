<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import "../app.css";

	import { getConfig } from "$lib/state/config.svelte";

	const animationEnabled = $derived.by(() => getConfig().animationsEnabled);

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Mystic Type-Writer</title>
</svelte:head>

<div
	class="bg-background text-offwhite flex min-h-screen w-screen flex-col items-center justify-center gap-4 p-4"
>
	<div
		class="{animationEnabled
			? 'fall-lines'
			: ''} pointer-events-none absolute inset-0 bg-[url($lib/assets/lines.png)] bg-auto bg-center bg-repeat duration-[10s]"
	></div>
	<div
		class="{animationEnabled
			? 'fall-lines -top-32 right-4 bottom-0 -left-4'
			: '-top-124 right-4 bottom-0 -left-4'} pointer-events-none absolute bg-[url($lib/assets/lines.png)] bg-auto bg-center bg-repeat opacity-25 duration-[20s]"
	></div>
	{@render children()}
</div>
