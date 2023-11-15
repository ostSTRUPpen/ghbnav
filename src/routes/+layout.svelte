<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { base } from '$app/paths';
	import '../app.postcss';

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

		if (typeof window !== 'undefined') {
			//https://www.scottspence.com/posts/cookie-based-theme-selection-in-sveltekit-with-daisyui
			const theme = window.localStorage.getItem('theme');
			if (theme) {
				document.documentElement.setAttribute('data-theme', theme);
				//condition ? true_expression : false_expression
				theme === 'ghb_dark' ? (darkMode = true) : (darkMode = false);
			}
		}

		return () => subscription.unsubscribe();
	});

	function set_theme(event: Event) {
		//https://www.scottspence.com/posts/cookie-based-theme-selection-in-sveltekit-with-daisyui
		const checkbox = event.target as HTMLInputElement;
		const checked = checkbox.checked;
		let theme;

		if (checked) {
			theme = 'ghb_dark';
		} else {
			theme = 'ghb_light';
		}
		const one_year = 60 * 60 * 24 * 365;
		window.localStorage.setItem('theme', theme);
		document.cookie = `theme=${theme}; max-age=${one_year}; path=/; SameSite=Strict;`;
		document.documentElement.setAttribute('data-theme', theme);
		//condition ? true_expression : false_expression
		theme === 'ghb_dark' ? (darkMode = true) : (darkMode = false);
	}
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
							class="btn-ghost hover:text-primary hover:no-animation hover:bg-base-100 text-md sm:text-xl"
							href="{base}/auth"
							target="_self"
							rel="nofollow"
						>
							Správce
						</a>
					</li>
				{/if}
				<li>
					<label class="swap swap-rotate">
						<!-- this hidden checkbox controls the state -->
						<input type="checkbox" on:change={set_theme} bind:checked={darkMode} />

						<!-- sun icon -->
						<svg
							class="swap-on fill-current w-10 h-10"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							><path
								d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
							/></svg
						>

						<!-- moon icon -->
						<svg
							class="swap-off fill-current w-10 h-10"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							><path
								d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
							/></svg
						>
					</label>
				</li>
			</ul>
		</div>
	</nav>
</header>

<main>
	<slot />
</main>
