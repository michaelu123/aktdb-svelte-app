// @ts-nocheck

/** @type {import('./$types').PageLoad} */
import { loadMember } from '$lib/load.js';
import { redirect } from '@sveltejs/kit';
import { credsStore } from '../../../../lib/stores.js';

export async function load({ fetch, params }) {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v));
	unsub();
	console.log('memberSlugLoad', creds);
	if (creds == null) {
		throw redirect(307, '/aktdb/login?from=/members');
	}

	const id = +params.slug;
	const member = await loadMember(fetch, id);
	return { member: member, fetch: fetch, params: params };
}
