// @ts-nocheck

/** @type {import('./$types').PageLoad} */
import { redirect } from '@sveltejs/kit';
import { credsStore } from '$lib/stores.js';

export async function load({ fetch, params }) {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v));
	unsub();
	if (creds == null) {
		throw redirect(307, '/login?from=/members');
	}
	let team = { id: null, with_details: true };
	return { team: team, fetch: fetch, params: params };
}
