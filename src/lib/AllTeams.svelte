<script>
	let teams;
	let withDetails = true;
	let search;
	let offset;
	let limit;
	import { writable } from 'svelte/store';
	import { credsStore, teamsState } from './stores.js';
	import { onDestroy } from 'svelte';
	// Components
	import Paginator from '@brainandbones/skeleton/components/Paginator/Paginator.svelte';
	import SlideToggle from '@brainandbones/skeleton/components/SlideToggle/SlideToggle.svelte';
	import { goto } from '$app/navigation';
	import {
		dataTableHandler,
		dataTableSelect,
		dataTableSort,
		tableInteraction,
		tableA11y
	} from '@brainandbones/skeleton/utilities/DataTable/DataTable';

	console.log('at1', $teamsState);
	teams = $teamsState.teams;

	let is_admin = $credsStore.is_admin;
	let team = $teamsState.team;
	if (team) {
		// saved team from TeamForm
		console.log('at2 use state team', team.isNew);
		if (team.isNew) {
			teams.push(team);
			team.isNew = false;
		} else {
			let i = teams.findIndex((t) => t.id == team.id);
			teams[i] = team;
		}
		$teamsState.team = null;
	}

	search = $teamsState.search || '';
	withDetails = $teamsState.withDetails;
	if (withDetails == null) withDetails = true;
	offset = $teamsState.offset || 0;
	limit = $teamsState.limit || 10;
	const dataTableModel = writable({
		source: teams,
		filtered: teams,
		selection: [],
		search: search,
		withDetails: withDetails,
		sort: 'name',
		filter: dataFilter,
		pagination: { offset: offset, limit: limit, size: 0, amounts: [10, 20, 50, 100, 500] }
	});
	const unsubscribe = dataTableModel.subscribe((v) => dataTableHandler(v));
	onDestroy(unsubscribe);

	// Manual Selection
	dataTableSelect(dataTableModel, 'id', [1]);

	async function selectRow(row) {
		console.log('at2 selrow', row);
		let team = { ...row };
		// if (!team.with_details) return;
		teamsState.set({
			search: $dataTableModel.search,
			withDetails: $dataTableModel.withDetails,
			teams: $dataTableModel.source,
			team: team,
			offset: $dataTableModel.pagination.offset,
			limit: $dataTableModel.pagination.limit
		});
		console.log('at3 save', $teamsState);
		await goto('/aktdb/team/' + team.id + '?from=/aktdb/teams');
	}

	async function newTeam() {
		console.log('at4 newteam');
		teamsState.set({
			search: $dataTableModel.search,
			withDetails: $dataTableModel.withDetails,
			teams: $dataTableModel.source,
			team: null,
			offset: $dataTableModel.pagination.offset,
			limit: $dataTableModel.pagination.limit
		});
		console.log('at5 save', $teamsState);
		await goto('/aktdb/newteam?from=/aktdb/teams');
	}

	function dataFilter(store) {
		const formattedSearchTerm = store.search?.toLowerCase() || '';
		return store.source.filter((rowObj) => {
			if (store.withDetails && !rowObj.with_details) {
				return false;
			}
			if (rowObj.name.toLowerCase().includes(formattedSearchTerm)) return true;
			return false;
		});
	}
</script>

<div class="px-6 py-8 bg-gray-100">
	<section class="card !bg-accent-500/5">
		<!-- Search Input -->
		<div class="card-header flex">
			{#if !is_admin}
				<SlideToggle bind:checked={$dataTableModel.withDetails}>Nur sichtbare</SlideToggle>
			{/if}
			<input
				bind:value={$dataTableModel.search}
				type="search"
				placeholder="Search Table..."
				class="p-2"
			/>
		</div>
		<!-- Table -->
		<div class="card-body">
			<div class="table-container">
				<!-- prettier-ignore -->
				<table class="table table-hover" role="grid" use:tableInteraction use:tableA11y>
						<thead on:click={(e) => { dataTableSort(e, dataTableModel) }} on:keypress>
							<tr>
								<!--
								<th><input type="checkbox" on:click={(e) => { dataTableSelectAll(e, dataTableModel) }} /></th>
								<th data-sort="id">ID</th>
								-->
								<th data-sort="name">Name</th>
								<th data-sort="email">Email</th>
								<th data-sort="needs_first_aid_training">EHK</th>
								<!-- <th>Logging</th> -->
							</tr>
						</thead>
						<tbody>
							{#each $dataTableModel.filtered as row, rowIndex}
								<tr class:table-row-checked={row.dataTableChecked} aria-rowindex={rowIndex + 1} on:click={() => {selectRow(row)}}>
								<!--
									<td role="gridcell" aria-colindex={1} tabindex="0">
										<input type="checkbox" bind:checked={row.dataTableChecked} />
									</td>
									<td role="gridcell" aria-colindex={2} tabindex="0">
										<em class="opacity-50">{row.id}</em>
									</td>
								-->
									<td role="gridcell" aria-colindex={1} tabindex="0">
										{row.name}
									</td>
									<td role="gridcell" aria-colindex={2} tabindex="0">
										{row.email}
									</td>
									<td role="gridcell" aria-colindex={3} tabindex="0">
										<!--input type="checkbox" disabled checked={+row.active} /-->
										{+row.needs_first_aid_training? "Ja": "Nein"}
									</td>
								<!--
									<td role="gridcell" aria-colindex={10} tabindex="0" class="table-cell-fit">
										<button class="btn btn-ghost-surface btn-sm" on:click={()=>{console.log(row,rowIndex)}}>Console Log</button>
									</td>
								-->
								</tr>
							{/each}
						</tbody>
					</table>
			</div>
		</div>
		<div class="card-footer">
			<Paginator bind:settings={$dataTableModel.pagination} />
		</div>
	</section>
</div>
<div>
	<button class="btn bg-gray-400 mt-4" on:click={newTeam}>Neuer Eintrag</button>
</div>
