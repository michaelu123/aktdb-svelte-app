<script>
	/** @type {import('./$types').PageData} */
	export let data;
	console.log("login data", data);
	let fetch = data.fetch;
	import { navigating } from '$app/stores';
	import { ProgressBar } from '@brainandbones/skeleton';
	import { credsStore, membersState, teamsState } from '../../../lib/stores.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { loadAll } from '$lib/load.js';

	const url = 'https://aktivendb.adfc-muenchen.de';
	const urlLogin = url + '/auth/login';
	const hdrs = {
		'Content-Type': 'application/json',
		Accept: 'application/json, text/plain, */*',
		Authorization: 'Bearer undefined'
	};
	let email;
	let password;
	let error;

	async function login() {
		let from = $page.url.search || ''; // from where we redirected to login

		console.log('lg1 from', from);
		let body = JSON.stringify({ email: email, password: password });
		console.log('lg1A login', email, password, body);

		const resp1 = await fetch(urlLogin, {
			method: 'POST',
			headers: hdrs,
			body: body
		});
		console.log('lg2 resp', resp1);
		const res1 = await resp1.json();
		console.log('afterX4', res1);
		if (!resp1.ok) {
			error = res1.error;
			return;
		}
		error = null;
		console.log('lg3 token', res1.token);
		console.log('lg4 isadmin', res1.user.is_admin);

		credsStore.set({
			token: res1.token,
			is_admin: res1.user.is_admin,
			email: email,
			url: url,
			hdrs: hdrs
		});
		let nextPage = '/aktdb/members';
		if (from.startsWith('?from=')) {
			nextPage = '/aktdb' + from.substring(6);
		}
		const res2 = await loadAll();
		$membersState.members = res2.members;
		$teamsState.teams = res2.teams;
		await goto(nextPage, { replaceState: true });
	}
</script>

<main class="debug-screens">
	{#if $navigating}
		<ProgressBar />
	{:else}
		<h1>Login</h1>
		<form on:submit|preventDefault>
			<label for="email" class="my-5">
				<span>Email</span>
				<input type="email" id="email" bind:value={email} />
			</label>
			<label for="password">
				<span>Passwort</span>
				<input type="password" id="password" bind:value={password} />
			</label>
			{#if error}
				<p class="bg-red-200 mt-8">{error}</p>
			{/if}
			<button type="submit" class="btn bg-gray-300 mt-8 hover:bg-gray-400" on:click={login}
				>Einloggen</button
			>
		</form>
	{/if}
</main>

<!--

export async function loadAll({ fetch }) {
	let creds;
	let unsub = credsStore.subscribe((v) => (creds = v));
	unsub();
	console.log('1loadAll', creds);
	if (creds == null) {
		throw redirect(307, '/aktdb/login?from=/members');
	}
	let state;
	unsub = membersState.subscribe((v) => (state = v));
	unsub();
	let members = state.members;
	if (members) {
		console.log('2ld use state', { ...state });
		let member = state.member;
		if (member) {
			// saved member from MemberForm
			console.log('3ld use state member', member.isNew);
			if (member.isNew) {
				members.push(member);
				member.isNew = false;
			} else {
				let i = members.findIndex((m) => m.id == member.id);
				members[i] = member;
			}
			state.member = null;
		}
		return { members: state.members };
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
-->
