// @ts-nocheck

/** @type {import('./$types').PageLoad} */
import { redirect } from '@sveltejs/kit';
import { credsStore, membersState } from '../stores.js';

export async function load({ fetch, params }) {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v));
	unsub();
	console.log('1ld', creds);
	if (creds == null) {
		throw redirect(307, '/aktdb/login?from=/members');
	}
	let state;
	unsub = membersState.subscribe((v) => (state = v));
	unsub();
	let members = state.members;
	if (members) {
		console.log('2ld use state', state);
		let member = state.member;
		if (member) {
			// saved member from MemberForm
			console.log('3ld use state member');
			let i = members.findIndex((m) => m.id == member.id);
			members[i] = member;
			state.member = null;
		}
		return { members: state.members };
	}
	const url = creds.url;
	const urlReadMembers = url + '/api/members?token=';
	console.log('4ld');
	const resp = await fetch(urlReadMembers + creds.token, {
		method: 'GET',
		headers: creds.hdrs
	});
	const res = await resp.json();
	console.log('5ld res', res);
	for (let row of res) {
		for (let key of Object.keys(row)) {
			if (row[key] == null) {
				row[key] = '';
			}
		}
	}

	return {
		members: res
	};
}
