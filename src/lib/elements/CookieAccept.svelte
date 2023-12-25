<script lang="ts">
	import { onMount } from 'svelte';

	let acceptedCookies: boolean = true;

	onMount(() => {
		if (typeof window !== 'undefined') {
			//https://www.scottspence.com/posts/cookie-based-theme-selection-in-sveltekit-with-daisyui
			const cookieAccepted = window.localStorage.getItem('cookieAccepted');
			if (cookieAccepted !== null) {
				//condition ? true_expression : false_expression
				cookieAccepted === 'true' ? (acceptedCookies = true) : (acceptedCookies = false);
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
			<p class="text-sm sm:text-sm md:text-lg lg:text-xl">
				Tato stránka využívá soubory cookies pro zajištění správné funkcionality.
			</p>
			<button class="btn btn-success" on:click={saveCookieAccept}>Rozumím</button>
		</div>
	</div>
{/if}
