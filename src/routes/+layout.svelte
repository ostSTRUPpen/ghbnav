<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import '../app.postcss';
	import CookieAccept from '$lib/elements/CookieAccept.svelte';
	import ColorMode from '$lib/elements/ColorMode.svelte';
	import AboutMe from '$lib/elements/AboutMe.svelte';
	import { staticSettings } from '$lib/data/staticData';

	export let data: LayoutData;

	let { loggedIn } = data;
	$: ({ loggedIn } = data);
</script>

<header class="print:hidden sm:pb-5 md:pb-10">
	<!--<div
		class="max-sm:bg-red-300 sm:bg-green-300 md:bg-blue-300 lg:bg-black xl:bg-orange-500 2xl:bg-yellow-300"
	>
		Size test
	</div>-->
	<nav class="navbar bg-base-100">
		<div class="flex-1">
			<a
				class="btn text-primary btn-ghost no-animation hover:bg-base-100 normal-case text-4xl sm:text-5xl"
				href="/"
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
						class="btn-ghost hover:text-primary px-3 hover:bg-base-100 text-xl"
						href="/map"
						target="_self"
						rel="next"
					>
						Mapa
					</a>
				</li>
				{#if loggedIn}
					<li>
						<a
							class="btn-ghost hover:text-primary px-3 hover:bg-base-100 text-xl"
							href="/sec"
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
							href="/auth"
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
    <noscript>
        <h2 class="text-error text-5xl px-5 py-3">Prosím povolte javascript pro správné fungování stránky!</h2>
    </noscript>
	<slot />
</main>

<footer>
	{#if !(/\/map/.test($page.url.pathname) || /\/loading/.test($page.url.pathname) || /\/sec/.test($page.url.pathname))}
		<CookieAccept />
	{/if}
	{#if staticSettings.displayAboutMe}
		<AboutMe />
	{/if}
</footer>
