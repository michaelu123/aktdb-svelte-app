<script> 
	/** @type {import('./$types').PageData} */
	export let data;
	import AllMembers from "$lib/AllMembers.svelte";
	import { navigating } from '$app/stores';
	import { ProgressBar } from '@brainandbones/skeleton';

	function save(m) {
		let mx = data.members.findIndex((dm) => dm.id == m.id);
		data.members[mx] = m;
	}
</script>

<main class="debug-screens">
	{#if $navigating}
		<ProgressBar/>
	{:else}
		<AllMembers members={data.members}></AllMembers>
	{/if}
</main>

<style>
</style>
