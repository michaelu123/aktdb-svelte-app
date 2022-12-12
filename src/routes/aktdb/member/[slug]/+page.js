// @ts-nocheck

/** @type {import('./$types').PageLoad} */
import { redirect } from '@sveltejs/kit';
import { credsStore } from '../../stores.js';

export async function load({ fetch, params }) {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v)); // can't use $credsStore!?
	unsub();
	console.log('1ld', creds);
	if (creds == null) {
		throw redirect(307, '/aktdb/login?from=/member/' + params.slug);
	}
	const url = creds.url;
	const urlReadMember = url + "/api/member/" + params.slug + "?token=" + creds.token;

	console.log('2ld url', urlReadMember);
	const resp = await fetch(urlReadMember, {
		method: 'GET',
		headers: creds.hdrs
	});
	const res = await resp.json();
	console.log('3ld res', res);
	for (let key of Object.keys(res)) {
		if (res[key] == null) {
			res[key] = '';
		}
	}
	return {
		member: res
	};
}
