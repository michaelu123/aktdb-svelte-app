// @ts-nocheck

/** @type {import('./$types').PageLoad} */
import { redirect } from '@sveltejs/kit';
import { credsStore, membersState } from '../stores.js';

export async function load({ fetch, params }) {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v));
	unsub();
	console.log('1nmld', creds);
	if (creds == null) {
		throw redirect(307, '/aktdb/login?from=/members');
	}
	return {};
}
