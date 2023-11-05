<script lang="ts">
	import { base } from '$app/paths';
	import SecureAnchor from '$lib/elements/SecureAnchor.svelte';
</script>

<SecureAnchor page={`${base}/markers`} text={'Značky'} />

<SecureAnchor page={`${base}/paths`} text={'Cesty'} />
<!--TODO Přidat návod, jak aplikaci používat (aby to pochopil i blbec) 
	Vítejte
	...
-->
