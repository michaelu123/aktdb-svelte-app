<script>
	import { goto } from '$app/navigation';
	import { credsStore, membersState, teamsState } from '$lib/stores.js';
	export let data;
	let memberChanges = 0;
	console.log('membersState', $membersState);
	let member = $membersState.member;
	let team = $teamsState.team;
	let table = data.table;
	let id = data.id;
	let historyArr = data.history;
	let beginn = data.beginn;
	let ende = data.ende;
	console.log('table', table, 'id', id, 'history', historyArr, 'beginn', beginn, 'ende', ende);

	function back() {
		window.history.back();
	}
</script>

{#if beginn}
	<h2 class="text-center p-2">Änderungsgeschichte von {beginn} bis {ende}</h2>
{:else if table == 'members'}
	<h2 class="text-center p-2">Änderungsgeschichte {member.first_name} {member.last_name}</h2>
{:else}
	<h2 class="text-center p-2">Änderungsgeschichte {team.name}</h2>
{/if}
<div class="card p-1">
	<div class="flex my-10">
		<button class="btn btn-filled-surface mr-8" on:click={back}>Zurück</button>
	</div>
</div>
