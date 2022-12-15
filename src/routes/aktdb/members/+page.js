// @ts-nocheck

/** @type {import('./$types').PageLoad} */
import { credsStore } from '$lib/stores.js';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch, params }) {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v));
	unsub();
	console.log('membersLoad', creds);
	if (creds == null) {
		throw redirect(307, '/aktdb/login?from=/members');
	}
	return null;
}
