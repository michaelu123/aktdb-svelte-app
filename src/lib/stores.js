import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';

export let credsStore = persisted('creds', null);
export let membersState = writable({
	mustBeActive: true,
	withDetails: true,
	search: '',
	members: null,
	member: null,
	offset: 0,
	limit: 10
});
export let teamsState = writable({
	withDetails: true,
	search: '',
	teams: null,
	team: null,
	offset: 0,
	limit: 10
});
