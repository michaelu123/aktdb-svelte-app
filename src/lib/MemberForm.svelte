<script>
	import { goto } from '$app/navigation';
	import { membersState } from '../routes/aktdb/stores.js';
	export let member;
	let changes = 0;
	$: if (member) { changes++ }
</script>

<div>
	<form on:submit|preventDefault class="mt-8">
		<label for="last_name">
			<span>Nachname</span>
			<input type="text" id="last_name" bind:value={member.last_name} minlength="2" required />
		</label>
		<label for="first_name">
			<span>Vorname</span>
			<input type="text" id="first_name" bind:value={member.first_name} minlength="2" required />
		</label>
		<label for="active">
			<span>Aktiv</span>
			<input
				type="checkbox"
				checked={+member.active}
				on:click={(e) => (member.active = e.target.checked ? '1' : '0')}
			/>
		</label>
	</form>
	<div class="flex mt-10">
		<button
			class="btn bg-gray-400 mr-8"
			on:click={() => {
				$membersState.member = null; 
				goto('/aktdb/members?from=/member');
			}}>{changes <= 1 ? "Zurück" : "Nicht Speichern"}</button
		>
		<button disabled = {changes <= 1}
			class="btn bg-gray-400"
			on:click={() => {
				$membersState.member = member; 
				goto('/aktdb/members?from=/member');
			}}>Speichern</button
		>
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
<style>
</style>
