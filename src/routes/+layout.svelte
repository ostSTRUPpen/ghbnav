<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	//import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { base } from '$app/paths';

	export let data: LayoutData;

	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl">Navigace Gymnázium Havlíčkův Brod</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm variant-ghost-surface" href="{base}/" target="_self" rel="prev">
					Domů
				</a>
				<a class="btn btn-sm variant-ghost-surface" href="{base}/map" target="_self" rel="next">
					Mapa
				</a>
				{#if session}
					<a
						class="btn btn-sm variant-ghost-surface"
						href="{base}/sec"
						target="_self"
						rel="nofollow"
					>
						Zabezpečená část
					</a>
				{:else}
					<a
						class="btn btn-sm variant-ghost-surface"
						href="{base}/auth"
						target="_self"
						rel="nofollow"
					>
						Správce
					</a>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
