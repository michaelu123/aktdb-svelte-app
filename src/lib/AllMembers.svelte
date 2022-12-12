<script>
	export let members;
	let mustBeActive = true;
	let search;
	let offset;
	let limit;
	import { writable } from 'svelte/store';
	import { membersState } from '../routes/aktdb/stores.js';
	import { onDestroy } from 'svelte';
	// Components
	import Paginator from '@brainandbones/skeleton/components/Paginator/Paginator.svelte';
	import SlideToggle from '@brainandbones/skeleton/components/SlideToggle/SlideToggle.svelte';
	import { goto } from '$app/navigation';
	import {
		dataTableHandler,
		dataTableSelect,
		dataTableSelectAll,
		dataTableSort,
		tableInteraction,
		tableA11y
	} from '@brainandbones/skeleton/utilities/DataTable/DataTable';

	console.log("am1", $membersState);
	search= $membersState.search;
	mustBeActive  = $membersState.mustBeActive;
	offset = $membersState.offset;
	limit = $membersState.limit;

	const dataTableModel = writable({
		source: members,
		filtered: members,
		selection: [],
		search: search,
		mustBeActive: mustBeActive,
		sort: '',
		filter: dataFilter,
		pagination: { offset: offset, limit: limit, size: 0, amounts: [10, 20, 50, 100, 500] }
	});
	const unsubscribe = dataTableModel.subscribe((v) => dataTableHandler(v));
	onDestroy(unsubscribe);

	// Manual Selection
	dataTableSelect(dataTableModel, 'id', [1]);

	async function selectRow(row) {
		console.log('am2 selrow', row);
		let member = { ...row };
		membersState.set({
			search: $dataTableModel.search,
			mustBeActive: $dataTableModel.mustBeActive,
			members: $dataTableModel.source,
			member: member,
			offset: $dataTableModel.pagination.offset,
			limit: $dataTableModel.pagination.limit
		});
		console.log("am3 save", $membersState);
		await goto('/aktdb/member/' + member.id + "?from=/aktdb/members");
	}

	function dataFilter(store) {
		const formattedSearchTerm = store.search?.toLowerCase() || '';
		return store.source.filter((rowObj) => {
			if (store.mustBeActive && +rowObj.active == 0) {
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
								<th><input type="checkbox" on:click={(e) => { dataTableSelectAll(e, dataTableModel) }} /></th>
								<th data-sort="id">ID</th>
								<th data-sort="last_name">Nachname</th>
								<th data-sort="first_name">Vorname</th>
								<th data-sort="active">Aktiv</th>
								<th data-sort="address">PLZ</th>
								<th data-sort="birthday">Geburtsjahr</th>
								<th data-sort="latest_first_aid_training">Letzter EHK</th>
								<th data-sort="next_first_aid_training">Nächster EHK</th>
								<th data-sort="responded_to_questionaire_at">Fragebogen</th>
								<th>Logging</th>
							</tr>
						</thead>
						<tbody>
							{#each $dataTableModel.filtered as row, rowIndex}
								<tr class:table-row-checked={row.dataTableChecked} aria-rowindex={rowIndex + 1} on:click={(e) => {selectRow(row)}}>
									<td role="gridcell" aria-colindex={1} tabindex="0">
										<input type="checkbox" bind:checked={row.dataTableChecked} />
									</td>
									<td role="gridcell" aria-colindex={2} tabindex="0">
										<em class="opacity-50">{row.id}</em>
									</td>
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
									<td role="gridcell" aria-colindex={8} tabindex="0">
										{row.latest_first_aid_training || ""}
									</td>
									<td role="gridcell" aria-colindex={9} tabindex="0">
										{row.next_first_aid_training || ""}
									</td>
									<td role="gridcell" aria-colindex={9} tabindex="0">
										{row.responded_to_questionaire_at || ""}
									</td>
									<td role="gridcell" aria-colindex={10} tabindex="0" class="table-cell-fit">
										<button class="btn btn-ghost-surface btn-sm" on:click={()=>{console.log(row,rowIndex)}}>Console Log</button>
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