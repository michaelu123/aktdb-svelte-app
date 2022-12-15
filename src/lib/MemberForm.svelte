<script>
	import { goto } from '$app/navigation';
	import { credsStore, membersState, teamsState } from './stores.js';
	import { writable } from 'svelte/store';
	import { onDestroy, tick } from 'svelte';
	import {
		dataTableHandler,
		tableInteraction,
		tableA11y
	} from '@brainandbones/skeleton/utilities/DataTable/DataTable';
	import { eyeIcon, deleteIcon, editIcon } from '$lib/icons.js';
	import { storeMember } from './load.js';

	export let data;
	let is_admin = $credsStore.is_admin;
	let member = data.member;
	let i = -1;
	let members = $membersState.members;
	if (members) {
		i = members.findIndex((m) => m.id == member.id);
		if (i >= 0) {
			members[i] = member;
		}
		$membersState.member = member;
	}

	let withDetails = member.with_details;
	let memberChanges = 0;
	$: if (member) {
		memberChanges++;
	}
	let textFields = {
		last_name: 'Nachname',
		first_name: 'Vorname',
		address: 'PLZ',
		adfc_id: 'Mitgliedsnr.',
		birthday: 'Geburtsjahr',
		email_adfc: 'Email (ADFC)',
		email_private: 'Email (Privat)',
		phone_primary: 'Telefon',
		phone_secondary: 'Telefon (alternativ)',
		status: 'Status'
	};
	let areaFields = {
		interests: 'Interessen',
		admin_comments: 'Kommentar'
	};
	let dateFields = {
		latest_contact: 'Letzter Kontakt',
		latest_first_aid_training: 'Letzter EHK',
		next_first_aid_training: 'Nächster EHK',
		responded_to_questionaire_at: 'Datum Fragebogen'
	};
	let boolFields = {
		active: 'Aktiv',
		registered_for_first_aid_training: 'Registriert für EHK',
		responded_to_questionaire: 'Fragebogen ausgefüllt',
		user: 'DB User'
	};
	let readOnlyFields = {
		responded_to_questionaire_at: true,
		responded_to_questionaire: true,
		user: true
	};
	function isChecked(k, m) {
		// console.log('isChecked m', {...m});
		// console.log('isChecked k', k);
		let v = m[k];
		let b = !(v == null || v === false || v == '' || v == '0');
		// console.log('isChecked', v, b);
		return b;
	}
	async function saveMember() {
		if (member.first_name.length < 2 || member.last_name.length < 2) {
			window.alert('Bitte Vor- und Nachname eintragen!');
			return;
		}
		if (member.id == null) {
			console.log('post DB', member);
			member.id = await storeMember('POST', member);
		} else {
			console.log('push DB', member);
			await storeMember('PUT', member);
		}
		$membersState.member = member;
		goto('/aktdb/members?from=/member/' + member.id);
	}
	function remove() {
		// TODO DB update
		console.log('delete DB', member);
		$membersState.member = null;
		$membersState.members = $membersState.members.filter((m) => m.id != member.id);
		goto('/aktdb/members');
	}

	// now for the project_teams
	let teams = [];
	let team = null;
	let teamChanges = 0;
	$: if (team) {
		teamChanges++;
	}
	const projectTeams = member.project_teams || [];
	for (let team of projectTeams) {
		let name = team.name;
		let link = '/aktdb/team/' + team.id;
		let role = team.project_team_member.member_role_title;
		let desc = team.project_team_member.admin_comments;
		teams.push({ name: name, link: link, role: role, desc: desc, dataTableChecked: false });
	}
	teams = teams.sort((a, b) => (a.name < b.name ? -1 : 1));

	const dataTableModel = writable({
		source: teams,
		filtered: teams,
		selection: [],
		search: '',
		sort: 'name',
		filter: () => {
			return teams;
		},
		pagination: null
	});
	const unsubscribe = dataTableModel.subscribe((v) => dataTableHandler(v));
	onDestroy(unsubscribe);

	function filtered(allTeams) {
		let oldTeams = [];
		for (let team of teams) {
			oldTeams.push(team.name);
		}
		let possibleTeams = []; // teams of which member is not a member
		for (let team of allTeams) {
			if (!oldTeams.includes(team.name)) {
				possibleTeams.push(team);
			}
		}
		return possibleTeams.sort((a, b) => (a.name < b.name ? -1 : 1));
	}

	let action;
	async function addTeam() {
		team = { name: '-' };
		action = 'adding';
		await tick();
		teamChanges = 0;
	}
	async function showTeam(t) {
		console.log('showTeam', t);
		team = { ...t };
		action = 'showing';
		await tick();
		teamChanges = 0;
	}
	async function changeTeam(t) {
		team = { ...t };
		action = 'changing';
		await tick();
		teamChanges = 0;
	}
	async function deleteTeam(name) {
		// TODO DB update
		teams = teams.filter((t) => t.name != name);
		$dataTableModel.source = teams;
		await tick();
		teamChanges = 0;
	}
	async function saveTeam() {
		console.log('saveTeam', team);
		if (team.name.length < 2 || team.role.length < 2) {
			window.alert('Formular unvollständig!');
			return;
		}
		if (action == 'changing') {
			let i = teams.findIndex((m) => m.name == team.name);
			teams[i] = team;
			$dataTableModel.teams = teams;
			console.log('DB put', team);
		} else if (action == 'adding') {
			teams.push(team);
			teams = teams.sort((a, b) => (a.name < b.name ? -1 : 1));
			$dataTableModel.teams = teams;
			console.log('DB post', team);
		}
		team = null;
		action = null;
		teamChanges = 0;
		if (!withDetails) {
			goto('/aktdb/member/' + member.id + '?from=/member/' + member.id, { invalidateAll: true });
		}
	}
</script>

{#if withDetails}
	<div>
		<form on:submit|preventDefault class="mt-8">
			{#each Object.keys(textFields) as key (key)}
				<label class="grid grid-cols-6 items-center m-2">
					<span class="col-span-2">{textFields[key]}</span>
					<input
						class="col-span-4 form-input"
						type="text"
						bind:value={member[key]}
						minlength="2"
						required
					/>
				</label>
			{/each}
			<label class="grid grid-cols-6 items-center m-2">
				<span class="col-span-2">Geschlecht</span>
				<select class="col-span-4 form-select" bind:value={member.gender}>
					<option value="M">M</option>
					<option value="W">W</option>
					<option value="">-</option>
				</select>
			</label>
			{#each Object.keys(areaFields) as key (key)}
				<label class="grid grid-cols-6 items-center m-2">
					<span class="col-span-2">{areaFields[key]}</span>
					<textarea class="col-span-4 form-input" rows="2" bind:value={member[key]} />
				</label>
			{/each}
			{#each Object.keys(dateFields) as key (key)}
				<label class="grid grid-cols-6 items-center m-2">
					<span class="col-span-2">{dateFields[key]}</span>
					<input
						type="date"
						class="col-span-4 form-input"
						disabled={readOnlyFields[key]}
						value={member[key]}
						on:change={(e) => (member[key] = e.target.value)}
					/>
				</label>
			{/each}
			{#each Object.keys(boolFields) as key (key)}
				<label class="grid grid-cols-6 items-center m-2">
					<span class="col-span-2">{boolFields[key]}</span>
					<input
						type="checkbox"
						class="form-input"
						checked={isChecked(key, member)}
						disabled={readOnlyFields[key]}
						on:click={(e) => {
							member[key] = e.target.checked ? '1' : '0';
							member = member;
						}}
					/>
				</label>
			{/each}
		</form>
		<div class="flex my-10">
			<button
				class="btn bg-gray-400 mr-8"
				on:click={() => {
					$membersState.member = null;
					goto('/aktdb/members?from=/member/' + member.id);
				}}>{memberChanges <= 1 ? 'Zurück' : 'Nicht Speichern'}</button
			>
			<button
				disabled={memberChanges <= 1}
				class="btn bg-gray-400 mr-8"
				on:click={() => saveMember(member)}>Speichern</button
			>
			{#if is_admin}
				<button
					class="btn bg-gray-400 mr-8"
					on:click={() => {
						remove(member);
					}}>Mitglied löschen</button
				>
				<button class="btn bg-gray-400 mr-8" on:click={addTeam}>Mitgliedschaft hinzufügen</button>
			{/if}
		</div>
	</div>
{:else}
	<div class="flex my-10">
		<button
			class="btn bg-gray-400 mr-8"
			on:click={() => {
				$membersState.member = null;
				goto('/aktdb/members?from=/member/' + member.id);
			}}>Zurück</button
		>
		<button class="btn bg-gray-400" on:click={addTeam}>Mitgliedschaft hinzufügen</button>
	</div>
{/if}
<div>
	<section class="card !bg-accent-500/5">
		<h2 class="py-5">Mitgliedschaften</h2>
		<div class="">
			{#if action == 'changing'}
				<h4>Mitgliedschaft ändern</h4>
			{:else if action == 'adding'}
				<h4>Mitgliedschaft hinzufügen</h4>
			{:else if action == 'showing'}
				<h4>Mitgliedschaft Info</h4>
			{/if}

			{#if action}
				<div class="card">
					<form on:submit|preventDefault class="mx-8 p-8">
						<label class="grid grid-cols-6 items-center m-2">
							<span class="col-span-2">AG/OG</span>
							{#if action == 'showing' || action == 'changing'}
								<input disabled class="col-span-4 form-input" type="text" value={team.name} />
							{:else}
								<select class="col-span-4 form-select" bind:value={team.name}>
									<option value="-">-</option>
									{#each filtered($teamsState.teams) as team}
										{#if team.with_details}
											<option value={team.name}>{team.name}</option>
										{/if}
									{/each}
								</select>
							{/if}
						</label>
						<label class="grid grid-cols-6 items-center m-2">
							<span class="col-span-2">Funktion</span>
							{#if action == 'showing'}
								<input disabled class="col-span-4 form-input" type="text" value={team.role} />
							{:else}
								<select class="col-span-4 form-select" bind:value={team.role}>
									{#if action == 'adding'}
										<option value="-">-</option>
									{/if}
									<option value="Mitglied">Mitglied</option>
									<option value="Formales Mitglied">Formales Mitglied</option>
									<option value="Vorsitz">Vorsitz</option>
								</select>
							{/if}
						</label>
						<label class="grid grid-cols-6 items-center m-2">
							<span class="col-span-2">Kommentar</span>
							{#if action == 'showing'}
								<textarea disabled class="col-span-4 form-input" rows="2" bind:value={team.desc} />
							{:else}
								<textarea class="col-span-4 form-input" rows="2" bind:value={team.desc} />
							{/if}
						</label>
					</form>
				</div>
			{/if}
		</div>
		{#if teamChanges > 1}
			<button on:click={saveTeam} class="btn bg-gray-400"
				>{action == 'adding' ? 'Jetzt hinzufügen' : 'Jetzt ändern'}</button
			>
		{/if}
	</section>
	<section class="card !bg-accent-500/5">
		<!-- Table -->
		<div class="card-body">
			<div class="table-container">
				<!-- prettier-ignore -->
				<table class="table table-hover" role="grid" use:tableInteraction use:tableA11y>
					<thead>
						<tr>
							<!--
							<th><input type="checkbox" on:click={(e) => { dataTableSelectAll(e, dataTableModel) }} /></th>
							<th data-sort="id">ID</th>
							-->
							<th>AG/OG</th>
							<th>Funktion</th>
							<th>Aktion</th>
						</tr>
					</thead>
					<tbody>
						{#each $dataTableModel.filtered as row, rowIndex}
							<tr class:table-row-checked={row.dataTableChecked} aria-rowindex={rowIndex + 1}>
								<td role="gridcell" aria-colindex={0} tabindex="0">
									<a href={row.link}>{row.name}</a>
								</td>
								<td role="gridcell" aria-colindex={1} tabindex="0">
									{row.role}
								</td>
								<td role="gridcell">
									<button class="btn" on:click={()=> {showTeam(row)}}>{@html eyeIcon}</button>
									<button class="btn" on:click={()=> {deleteTeam(row.name)}}>{@html deleteIcon}</button>
									<button class="btn" on:click={()=> {changeTeam(row)}}>{@html editIcon}</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>
</div>
