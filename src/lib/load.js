import { redirect } from '@sveltejs/kit';
import { credsStore } from '$lib/stores.js';

export async function loadAll() {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v));
	unsub();
	console.log('1loadAll', creds);
	if (creds == null) {
		throw redirect(307, '/aktdb/login?from=/members');
	}

	const url = creds.url;

	const urlReadMembers = url + '/api/members?token=';
	console.log('4ld');
	const respM = await fetch(urlReadMembers + creds.token, {
		method: 'GET',
		headers: creds.hdrs
	});
	const resM = await respM.json();
	console.log('5ld res', resM);
	for (let row of resM) {
		for (let key of Object.keys(row)) {
			if (row[key] == null) {
				row[key] = '';
			}
		}
	}

    const urlReadTeams = url + '/api/project-teams?token=';
    console.log('6ld');
    const respT = await fetch(urlReadTeams + creds.token, {
        method: 'GET',
        headers: creds.hdrs
    });
    const resT = await respT.json();
    console.log('7ld res', resT);
    for (let row of resT) {
        for (let key of Object.keys(row)) {
            if (row[key] == null) {
                row[key] = '';
            }
        }
    }

	return {
		members: resM,
        teams: resT
	};
}
