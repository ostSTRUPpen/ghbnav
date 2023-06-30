<script lang="ts">
	export let data;
	$: ({ session } = data);
</script>

<header>
	<a href="/">Domů</a>
	{#if session}
		<a href="/sec">Zabezpečená část</a>
	{/if}
</header>

<main>
	<slot />
</main>
<footer>
	<a href="/auth">Přihlásit se</a>
</footer>
