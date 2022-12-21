import { redirect } from '@sveltejs/kit';
import { credsStore } from '$lib/stores.js';

function getCreds() {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v));
	unsub();
	if (creds == null) {
		throw redirect(307, '/login?from=/members');
	}
	return creds;
}

export async function loadAll(fetch) {
	let creds = getCreds();
	const baseUrl = creds.url;

	const urlM = baseUrl + '/api/members?token=';
	const respM = await fetch(urlM + creds.token, {
		method: 'GET',
		headers: creds.hdrs
	});
	const members = await respM.json();
	for (let member of members) {
		for (let key of Object.keys(member)) {
			if (member[key] == null) {
				member[key] = '';
			}
		}
	}

	const urlT = baseUrl + '/api/project-teams?token=';
	const respT = await fetch(urlT + creds.token, {
		method: 'GET',
		headers: creds.hdrs
	});
	const teams = await respT.json();
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

	const resp = await fetch(url, {
		method: 'GET',
		headers: creds.hdrs
	});
	const member = await resp.json();
	for (let key of Object.keys(member)) {
		if (member[key] == null) {
			member[key] = '';
		}
	}
	return member;
}

export async function loadTeam(fetch, id) {
	let creds = getCreds();
	const baseUrl = creds.url;
	const url = baseUrl + '/api/project-team/' + id + '?token=' + creds.token;

	const resp = await fetch(url, {
		method: 'GET',
		headers: creds.hdrs
	});
	const team = await resp.json();
	for (let key of Object.keys(team)) {
		if (team[key] == null) {
			team[key] = '';
		}
	}
	return team;
}

const omitMemberFields = ['id', 'updated_at', 'user', 'with_details', 'with_detals'];
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
	for (let key of omitMemberFields) {
		delete m[key];
	}
	const resp = await fetch(url, {
		method: method,
		headers: creds.hdrs,
		body: JSON.stringify(m)
	});
	const res = await resp.json();
	return res.id;
}

export async function deleteMember(id) {
	let creds = getCreds();
	const baseUrl = creds.url;

	let url = baseUrl + '/api/member/' + id + '?token=' + creds.token;
	resp = await fetch(url, {
		method: 'DELETE',
		headers: creds.hdrs
	});
}

const omitTeamFields = ['id', 'updated_at', 'with_details', 'with_detals'];
export async function storeTeam(method, team) {
	let creds = getCreds();
	const baseUrl = creds.url;
	let t = { ...team };

	let url = baseUrl + '/api/project-team';
	if (method == 'PUT') {
		url += '/' + t.id;
	}
	url += '?token=' + creds.token;
	for (let key of Object.keys(team)) {
		if (t[key] == '') {
			t[key] = null;
		}
	}
	for (let key of omitTeamFields) {
		delete t[key];
	}
	const resp = await fetch(url, {
		method: method,
		headers: creds.hdrs,
		body: JSON.stringify(t)
	});
	const res = await resp.json();
	return res.id;
}

export async function deleteTeam(id) {
	let creds = getCreds();
	const baseUrl = creds.url;

	let url = baseUrl + '/api/project-team/' + id + '?token=' + creds.token;
	await fetch(url, {
		method: 'DELETE',
		headers: creds.hdrs
	});
}

export async function storeRelation(method, relation) {
	let creds = getCreds();
	const baseUrl = creds.url;

	let url = baseUrl + '/api/project-team-member';
	if (method == 'PUT') {
		url += '/' + relation.id;
	}
	url += '?token=' + creds.token;
	let roleId = 0;
	if (relation.role == 'Mitglied') roleId = 2;
	else if (relation.role == 'Vorsitz') roleId = 1;
	else if (relation.role == 'Formales Mitglied') roleId = 3;
	const r = {
		admin_comments: relation.desc,
		member_id: relation.memberId,
		member_role_id: roleId,
		member_role_title: relation.role,
		project_team_id: relation.teamId
	};
	const resp = await fetch(url, {
		method: method,
		headers: creds.hdrs,
		body: JSON.stringify(r)
	});
	const res = await resp.json();
	return res.id;
}

export async function deleteRelation(id) {
	let creds = getCreds();
	const baseUrl = creds.url;

	let url = baseUrl + '/api/project-team-member/' + id + '?token=' + creds.token;
	await fetch(url, {
		method: 'DELETE',
		headers: creds.hdrs
	});
}
