import { redirect } from '@sveltejs/kit';
import { credsStore } from '$lib/stores.js';

function getCreds() {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v));
	unsub();
	console.log('getCreds', creds);
	if (creds == null) {
		throw redirect(307, '/aktdb/login?from=/members');
	}
	return creds;
}

export async function loadAll(fetch) {
	let creds = getCreds();
	const baseUrl = creds.url;

	const urlM = baseUrl + '/api/members?token=';
	console.log('1loadAll', urlM);
	const respM = await fetch(urlM + creds.token, {
		method: 'GET',
		headers: creds.hdrs
	});
	const members = await respM.json();
	console.log('2loadAll res', members);
	for (let member of members) {
		for (let key of Object.keys(member)) {
			if (member[key] == null) {
				member[key] = '';
			}
		}
	}

	const urlT = baseUrl + '/api/project-teams?token=';
	console.log('3loadAll', urlT);
	const respT = await fetch(urlT + creds.token, {
		method: 'GET',
		headers: creds.hdrs
	});
	const teams = await respT.json();
	console.log('4loadAll res', teams);
	for (let team of teams) {
		for (let key of Object.keys(team)) {
			if (team[key] == null) {
				team[key] = '';
			}
		}
	}

	return {
		members: members,
		teams: teams
	};
}

export async function loadMember(fetch, id) {
	let creds = getCreds();
	const baseUrl = creds.url;
	const url = baseUrl + '/api/member/' + id + '?token=' + creds.token;

	console.log('1loadMember url', url);
	const resp = await fetch(url, {
		method: 'GET',
		headers: creds.hdrs
	});
	const member = await resp.json();
	console.log('2loadMember res', member);
	for (let key of Object.keys(member)) {
		if (member[key] == null) {
			member[key] = '';
		}
	}
	return member;
}

const omitFields = ['id', 'updated_at', 'user', 'with_details', 'with_detals'];
export async function storeMember(method, member) {
	let creds = getCreds();
	const baseUrl = creds.url;
	let m = { ...member };

	let url = baseUrl + '/api/member';
	if (method == 'PUT') {
		url += '/' + m.id;
	}
	url += '?token=' + creds.token;
	for (let key of Object.keys(member)) {
		if (m[key] == '') {
			m[key] = null;
		}
	}
	m['name'] = m.last_name + ', ' + m.first_name;
	for (let key of omitFields) {
		delete m[key];
	}
	console.log('1storeMember', url, method, m);
	const resp = await fetch(url, {
		method: method,
		headers: creds.hdrs,
		body: JSON.stringify(m)
	});
	const res = await resp.json();
	console.log('2storeMember res', res);
	return res.id;
}

export async function deleteMember(id) {
	let creds = getCreds();
	const baseUrl = creds.url;

	let url = baseUrl + '/api/member/' + id + '?token=' + creds.token;
	console.log('1deleteMember', url, id);
	const resp = await fetch(url, {
		method: "DELETE",
		headers: creds.hdrs
	});
	console.log('2deleteMember resp', resp);
}

export async function storeTeam(method, t) {}

export async function storeRelation(method, memberId, relation) {
	let creds = getCreds();
	const baseUrl = creds.url;

	let url = baseUrl + '/api/project-team-member';
	if (method == 'PUT') {
		url += '/' + relation.id;
	}
	url += '?token=' + creds.token;
	let roleId = 0; 
	if (relation.role == "Mitglied") roleId = 2;
	else if (relation.role == 'Vorsitz') roleId = 1;
	else if (relation.role == 'Formales Mitglied') roleId = 3;
	const r = {
		admin_comments: relation.desc,
		member_id: memberId,
		member_role_id: roleId,
		member_role_title: relation.role,
		project_team_id: relation.teamId
	};
	console.log('1storeRelation', url, method, r);
	const resp = await fetch(url, {
		method: method,
		headers: creds.hdrs,
		body: JSON.stringify(r)
	});
	const res = await resp.json();
	console.log('2storeRelation res', res);
	return res.id;
}

export async function deleteRelation(id) {
	let creds = getCreds();
	const baseUrl = creds.url;

	let url = baseUrl + '/api/project-team-member/' + id + '?token=' + creds.token;
	console.log('1deleteRelation', url, id);
	const resp = await fetch(url, {
		method: 'DELETE',
		headers: creds.hdrs
	});
	console.log('2deleteRelation resp', resp);
}
