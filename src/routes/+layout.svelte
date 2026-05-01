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
	class="bg-background text-offwhite before:contents-[''] flex min-h-screen w-screen flex-col items-center justify-center gap-4 p-4 before:pointer-events-none before:absolute before:inset-0 before:bg-[url($lib/assets/lines.png)] before:bg-auto before:bg-center before:bg-repeat {animationEnabled
		? 'before:animate-fall'
		: ''}"
>
	{@render children()}
</div>
