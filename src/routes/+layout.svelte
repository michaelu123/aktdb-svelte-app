<script>
	import '@brainandbones/skeleton/themes/theme-skeleton.css';
	import '@brainandbones/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell, AppBar } from '@brainandbones/skeleton';
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<!-- Header -->
	<svelte:fragment slot="header">
		<!-- Insert the App Bar: -->
		<AppBar>
			<svelte:fragment slot="lead">
				<h1>MyApp</h1>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm" href="https://github.com/michaelu123" target="_blank" rel="noreferrer"
					>GitHub</a
				>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Sidebar -->
	<svelte:fragment slot="sidebarLeft">
		<!-- Insert the list: -->
		<nav class="list-nav">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/tom">Tom</a></li>
				<li><a href="/posts/xxx">Posts</a></li>
				<li><a href="/aktdb/members">Mitglieder</a></li>
				<li><a href="/aktdb/teams">Teams</a></li>
				<li><a href="/aktdb/member/20">X20</a></li>
				<li><a href="/aktdb/member/25">X25</a></li>
			</ul>
		</nav></svelte:fragment
	>
	<!-- Page Content Slot -->
	<slot />
</AppShell>
