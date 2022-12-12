import { writable } from 'svelte/store';

export let credsStore = writable(null);
export let membersState = writable({
	mustBeActive: true,
	search: '',
	members: null,
	member: null,
	offset: 0,
    limit: 10
});
