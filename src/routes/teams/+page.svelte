<script>
	import AllTeams from '$lib/AllTeams.svelte';
	import { navigating } from '$app/stores';
	import { ProgressBar } from '@brainandbones/skeleton';
</script>

<main class="debug-screens">
	{#if $navigating}
		<ProgressBar />
	{:else}
		<AllTeams />
	{/if}
</main>

<style>
</style>
