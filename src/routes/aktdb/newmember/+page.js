// @ts-nocheck

/** @type {import('./$types').PageLoad} */
import { redirect } from '@sveltejs/kit';
import { credsStore } from '../../../lib/stores.js';

export async function load({ fetch, params }) {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v));
	unsub();
	console.log('1nmld', creds);
	if (creds == null) {
		throw redirect(307, '/aktdb/login?from=/members');
	}
	let member = { id: null, isNew: true, gender: "", active:true, with_details: true };
	return { member: member, fetch: fetch, params: params };
}