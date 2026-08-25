<script lang="ts">
	import { onMount } from 'svelte';

	let acceptedCookies: boolean = $state(true);

	onMount(() => {
		if (typeof window !== 'undefined') {
			//https://www.scottspence.com/posts/cookie-based-theme-selection-in-sveltekit-with-daisyui
			const cookieAccepted = window.localStorage.getItem('cookieAccepted');
			if (cookieAccepted !== null) {
				acceptedCookies = cookieAccepted === 'true';
			} else {
				acceptedCookies = false;
			}
		}
	});

	function saveCookieAccept() {
		window.localStorage.setItem('cookieAccepted', 'true');
		acceptedCookies = true;
	}
</script>

{#if !acceptedCookies}
	<div class="toast toast-center">
		<div class="alert alert-info">
			<p class="text-ellipsis text-sm md:text-lg lg:text-xl">
				Tato stránka využívá soubory cookies <br class="sm:hidden" /> pro zajištění správné funkcionality.
			</p>
			<button class="btn btn-success" onclick={saveCookieAccept}>Rozumím</button>
		</div>
	</div>
{/if}
