// @ts-nocheck

/** @type {import('./$types').PageLoad} */
import { redirect } from '@sveltejs/kit';
import { credsStore, membersState } from '../../../../lib/stores.js';

export async function load({ fetch, params }) {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v)); // can't use $credsStore!?
	unsub();
	console.log('1ld', creds);
	if (creds == null) {
		throw redirect(307, '/aktdb/login?from=/member/' + params.slug);
	}
	const url = creds.url;
	const id = +params.slug;
	const urlReadMember = url + '/api/member/' + params.slug + '?token=' + creds.token;

	let state; 
	unsub = membersState.subscribe((v) => (state = v));
	unsub();
	let i = -1;
	let members = state.members;
	if (members) {
		i = members.findIndex((m) => m.id == id);
	}

	console.log('2ld url', urlReadMember);
	const resp = await fetch(urlReadMember, {
		method: 'GET',
		headers: creds.hdrs
	});
	const member = await resp.json();
	console.log('3ld res', member);
	for (let key of Object.keys(member)) {
		if (member[key] == null) {
			member[key] = '';
		}
	}
	if (i >= 0) {
		members[i] = member;
	}
	state.member = member;
	return null;
}
