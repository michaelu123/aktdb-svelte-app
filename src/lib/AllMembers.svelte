<script>
	import { writable } from 'svelte/store';
	import { credsStore, membersState } from './stores.js';
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

	let is_admin = $credsStore.is_admin;
	let members = $membersState.members;
	let search = $membersState.search || '';
	let mustBeActive = $membersState.mustBeActive;
	if (mustBeActive == null) mustBeActive = true;
	let withDetails = $membersState.withDetails;
	if (withDetails == null) withDetails = true;
	let offset = $membersState.offset || 0;
	let limit = $membersState.limit || 10;

	const dataTableModel = writable({
		source: members,
		filtered: members,
		selection: [],
		search: search,
		mustBeActive: mustBeActive,
		withDetails: withDetails,
		sort: 'last_name',
		filter: dataFilter,
		pagination: { offset: offset, limit: limit, size: 0, amounts: [10, 20, 50, 100, 500] }
	});
	const unsubscribe = dataTableModel.subscribe((v) => dataTableHandler(v));
	onDestroy(unsubscribe);

	// Manual Selection
	dataTableSelect(dataTableModel, 'id', [1]);

	async function selectRow(row) {
		let member = { ...row };
		if (!member.with_details) return;
		membersState.set({
			search: $dataTableModel.search,
			mustBeActive: $dataTableModel.mustBeActive,
			withDetails: $dataTableModel.withDetails,
			members: $dataTableModel.source,
			member: member,
			offset: $dataTableModel.pagination.offset,
			limit: $dataTableModel.pagination.limit
		});
		await goto('/aktdb/member/' + member.id + '?from=/aktdb/members');
	}

	async function newMember() {
		membersState.set({
			search: $dataTableModel.search,
			mustBeActive: $dataTableModel.mustBeActive,
			withDetails: $dataTableModel.withDetails,
			members: $dataTableModel.source,
			member: null,
			offset: $dataTableModel.pagination.offset,
			limit: $dataTableModel.pagination.limit
		});
		await goto('/aktdb/newmember?from=/aktdb/members');
	}

	function dataFilter(store) {
		const formattedSearchTerm = store.search?.toLowerCase() || '';
		return store.source.filter((rowObj) => {
			if (store.mustBeActive && +rowObj.active == 0) {
				return false;
			}
			if (store.withDetails && !rowObj.with_details) {
				return false;
			}
			if (rowObj.last_name.toLowerCase().includes(formattedSearchTerm)) return true;
			if (rowObj.first_name.toLowerCase().includes(formattedSearchTerm)) return true;
			return false;
		});
	}
</script>

<div class="px-6 py-8 bg-gray-100">
	<section class="card !bg-accent-500/5">
		<!-- Search Input -->
		<div class="card-header flex">
			<SlideToggle bind:checked={$dataTableModel.mustBeActive}>Nur Aktive</SlideToggle>
			{#if !is_admin}
				<SlideToggle bind:checked={$dataTableModel.withDetails}>Nur Teammitglieder</SlideToggle>
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
								<th data-sort="last_name">Nachname</th>
								<th data-sort="first_name">Vorname</th>
								<th data-sort="active">Aktiv</th>
								<th data-sort="address">PLZ</th>
								<th data-sort="birthday">Geburtsjahr</th>
								<th data-sort="gender">Geschlecht</th>
								<th data-sort="latest_first_aid_training">Letzter EHK</th>
								<th data-sort="next_first_aid_training">Nächster EHK</th>
								<th data-sort="responded_to_questionaire_at">Fragebogen</th>
							</tr>
						</thead>
						<tbody>
							{#each $dataTableModel.filtered as row, rowIndex}
								<tr class:table-row-checked={row.dataTableChecked} aria-rowindex={rowIndex + 1} on:click={() => {selectRow(row)}}>
									<td role="gridcell" aria-colindex={3} tabindex="0">
										{row.last_name}
									</td>
									<td role="gridcell" aria-colindex={4} tabindex="0">
										{row.first_name}
									</td>
									<td role="gridcell" aria-colindex={5} tabindex="0">
										<!--input type="checkbox" disabled checked={+row.active} /-->
										{+row.active? "Ja": "Nein"}
									</td>
									<td role="gridcell" aria-colindex={6} tabindex="0">
										{row.address || ""}
									</td>
									<td role="gridcell" aria-colindex={7} tabindex="0">
										{row.birthday || ""}
									</td>
									<td role="gridcell" aria-colindex={7} tabindex="0">
										{row.gender || ""}
									</td>
									<td role="gridcell" aria-colindex={8} tabindex="0">
										{row.latest_first_aid_training || ""}
									</td>
									<td role="gridcell" aria-colindex={9} tabindex="0">
										{row.next_first_aid_training || ""}
									</td>
									<td role="gridcell" aria-colindex={9} tabindex="0">
										{row.responded_to_questionaire_at || ""}
									</td>
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
	<button class="btn bg-gray-400 mt-4" on:click={newMember}>Neuer Eintrag</button>
</div>
