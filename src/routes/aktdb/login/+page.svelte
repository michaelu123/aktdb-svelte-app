<script>
	import { navigating } from '$app/stores';
	import { ProgressBar } from '@brainandbones/skeleton';
	import { credsStore } from '../stores.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

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
		let nextPage = '/aktdb/member/20';
		if (from.startsWith('?from=')) {
			nextPage = '/aktdb' + from.substring(6);
		}
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
