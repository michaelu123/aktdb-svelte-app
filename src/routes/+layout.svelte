<script>
	import '@brainandbones/skeleton/themes/theme-skeleton.css';
	import '@brainandbones/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell, AppBar, LightSwitch } from '@brainandbones/skeleton';
	/** @type {import('./$types').PageLoad} */
	import { credsStore } from '$lib/stores.js';
	import { goto } from '$app/navigation';

	function logout() {
		credsStore.set(null);
		goto('/', { invalidateAll: true });
	}
	function login() {
		credsStore.set(null);
		goto('/login', { invalidateAll: true });
	}
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<!-- Header -->
	<svelte:fragment slot="header">
		<!-- Insert the App Bar: -->
		<AppBar>
			<svelte:fragment slot="lead">
				<h1>AktivenDB</h1>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<ul class="flex">
					{#if $credsStore && $credsStore.token}
						<li><a class="btn  btn-filled-surface mx-2 text-2xl" href="/members">Mitglieder</a></li>
						<li><a class="btn  btn-filled-surface mx-2 text-2xl" href="/teams">Teams</a></li>
						{#if $credsStore.is_admin}
							<li>
								<a class="btn  btn-filled-surface mx-2 text-2xl" href="/history">Geschichte</a>
							</li>
						{/if}
					{/if}
					<li>
						{#if !$credsStore || !$credsStore.token}
							<button class="btn  btn-filled-surface mx-2 text-2xl" on:click={login}>Login</button>
						{:else}
							<button class="btn  btn-filled-surface mx-2 text-2xl" on:click={logout}>Logout</button
							>
						{/if}
					</li>
					<li><LightSwitch class="mt-3" /></li>
				</ul>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Content Slot -->
	<slot />
</AppShell>
