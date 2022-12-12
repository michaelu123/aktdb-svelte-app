<script>
	import MemberForm from '$lib/MemberForm.svelte';
	import { navigating } from '$app/stores';
	import { ProgressBar } from '@brainandbones/skeleton';
	let member = {id:null, isNew: true, with_details: true};
</script>

<main class="debug-screens">
	{#if $navigating}
		<ProgressBar/>
	{:else}
		<MemberForm member={member} />
	{/if}
</main>

<style>
</style>
