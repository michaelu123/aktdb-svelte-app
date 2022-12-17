// @ts-nocheck

/** @type {import('./$types').PageLoad} */
import { loadTeam } from '$lib/load.js';
import { redirect } from '@sveltejs/kit';
import { credsStore } from '../../../../lib/stores.js';

export async function load({ fetch, params }) {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v));
	unsub();
	if (creds == null) {
		throw redirect(307, '/aktdb/login?from=/teams');
	}

	const id = +params.slug;
	const team = await loadTeam(fetch, id);
	return { team: team, fetch: fetch, params: params };
}
