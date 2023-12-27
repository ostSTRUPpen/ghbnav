<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { base } from '$app/paths';
	import '../app.postcss';
	import CookieAccept from '$lib/elements/CookieAccept.svelte';
	import ColorMode from '$lib/elements/ColorMode.svelte';
	import AboutMe from '$lib/elements/AboutMe.svelte';

	export let data: LayoutData;

	let darkMode: boolean;

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

<header class="print:hidden pb-10">
	<!--<div
		class="max-sm:bg-red-300 sm:bg-green-300 md:bg-blue-300 lg:bg-black xl:bg-orange-500 2xl:bg-yellow-300"
	>
		Size test
	</div>-->
	<nav class="navbar bg-base-100">
		<div class="flex-1">
			<a
				class="btn text-primary btn-ghost no-animation hover:bg-base-100 normal-case text-4xl sm:text-5xl"
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
						class="btn-ghost hover:text-primary px-3 hover:bg-base-100 text-md sm:text-xl"
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
							class="btn-ghost hover:text-primary px-3 hover:bg-base-100 text-md sm:text-xl"
							href="{base}/sec"
							target="_self"
							rel="nofollow"
						>
							Zabezpečená část
						</a>
					</li>
					<li>
						<form
							class="btn-ghost hover:text-primary hover:bg-base-100 text-md sm:text-xl"
							method="POST"
							action="/auth?/logout"
						>
							<input type="submit" class="cursor-pointer" value="Odhlásit se" />
						</form>
					</li>
				{:else}
					<li>
						<a
							class="btn-ghost hover:text-primary hover:no-animation hover:bg-base-100 text-md sm:text-xl max-sm:hidden"
							href="{base}/auth"
							target="_self"
							rel="nofollow"
						>
							Správce
						</a>
					</li>
				{/if}
				<li>
					<ColorMode />
				</li>
			</ul>
		</div>
	</nav>
</header>

<main>
	<slot />
</main>

<footer>
	<CookieAccept />
	<AboutMe />
</footer>
