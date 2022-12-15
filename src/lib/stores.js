import { writable } from 'svelte/store';

export let credsStore = writable(null);
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
