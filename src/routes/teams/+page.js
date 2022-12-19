// @ts-nocheck

/** @type {import('./$types').PageLoad} */
import { credsStore } from '$lib/stores.js';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch, params }) {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v));
	unsub();
	if (creds == null) {
		throw redirect(307, '/login?from=/teams');
	}
	return null;
}
