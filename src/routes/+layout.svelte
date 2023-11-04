<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { base } from '$app/paths';
	import '../app.css';

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

<header class="noPrintPdf">
	<nav class="navbar bg-base-100">
		<div class="flex-1">
			<a
				class="btn btn-wide text-primary btn-ghost no-animation hover:bg-base-100 normal-case text-4xl"
				href="{base}/"
				target="_self"
				rel="prev"
			>
				GHB nav
			</a>
		</div>
		<div class="flex-none">
			<ul class="menu menu-horizontal space-x-1">
				<li>
					<a
						class="btn-ghost hover:text-primary px-3 hover:bg-base-100"
						href="{base}/map"
						target="_self"
						rel="next"
					>
						Mapa
					</a>
				</li>
				{#if session}
					<li>
						<a
							class="btn-ghost hover:text-primary px-3 hover:bg-base-100"
							href="{base}/sec"
							target="_self"
							rel="nofollow"
						>
							Zabezpečená část
						</a>
					</li>
					<li>
						<form
							class="btn-ghost hover:text-primary hover:bg-base-100"
							method="POST"
							action="/auth?/logout"
						>
							<input type="submit" class="cursor-pointer" value="Odhlásit se" />
						</form>
					</li>
				{:else}
					<li>
						<a
							class="btn btn-ghost hover:text-primary hover:no-animation"
							href="{base}/auth"
							target="_self"
							rel="nofollow"
						>
							Správce
						</a>
					</li>
				{/if}
			</ul>
		</div>
	</nav>
</header>

<main>
	<slot class="print:bg-white" />
</main>

<style>
	@media print {
		.noPrintPdf {
			display: none !important;
		}
	}
</style>
