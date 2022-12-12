<script>
	import { goto } from '$app/navigation';
	import { credsStore, membersState } from '../routes/aktdb/stores.js';
	export let member;
	let is_admin = $credsStore.is_admin;
	let changes = 0;
	$: if (member) {
		changes++;
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
	let newId = 1000;
	function isChecked(k, m) {
		// console.log('isChecked m', {...m});
		// console.log('isChecked k', k);
		let v = m[k];
		let b = !(v == null || v === false || v == '' || v == '0');
		// console.log('isChecked', v, b);
		return b;
	}
	function save() {
		// TODO DB update
		if (member.id == null) {
			console.log('post DB', member);
			member.id = newId++;
		} else {
			console.log('push DB', member);
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
</script>

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
	<div class="flex mt-10">
		<button
			class="btn bg-gray-400 mr-8"
			on:click={() => {
				$membersState.member = null;
				goto('/aktdb/members?from=/member/' + member.id);
			}}>{changes <= 1 ? 'Zurück' : 'Nicht Speichern'}</button
		>
		<button disabled={changes <= 1} class="btn bg-gray-400 mr-8" on:click={() => save(member)}
			>Speichern</button
		>
		{#if is_admin}
			<button
				class="btn bg-gray-400 mr-8"
				on:click={() => {
					remove(member);
				}}>Löschen</button
			>
		{/if}
	</div>
</div>

<!-- /*
	active
	address 
	adfc_id
	admin_comments
	birthday
	email_adfc
	email_private
	first_name
gender
id
	interests
	last_name
	latest_contact
	latest_first_aid_training
	next_first_aid_training
	phone_primary
	phone_secondary
reference
	registered_for_first_aid_training
	responded_to_questionaire
	responded_to_questionaire_at
	status
	user
	with_details

*/ -->
