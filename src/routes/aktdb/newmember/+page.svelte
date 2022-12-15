<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import MemberForm from '$lib/MemberForm.svelte';
	import { navigating } from '$app/stores';
	import { ProgressBar } from '@brainandbones/skeleton';

</script>

<main class="debug-screens">
	{#if $navigating}
		<ProgressBar/>
	{:else}
		<MemberForm data={data} />
	{/if}
</main>

<style>
</style>
