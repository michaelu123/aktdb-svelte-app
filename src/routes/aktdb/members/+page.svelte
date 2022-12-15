<script>
	import AllMembers from '$lib/AllMembers.svelte';
	import { navigating } from '$app/stores';
	import { ProgressBar } from '@brainandbones/skeleton';
</script>

<main class="debug-screens">
	{#if $navigating}
		<ProgressBar />
	{:else}
		<AllMembers />
	{/if}
</main>

<style>
</style>
