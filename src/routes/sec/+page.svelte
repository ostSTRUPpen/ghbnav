<script lang="ts">
	import { base } from '$app/paths';
	import SecureAnchor from '$lib/elements/SecureAnchor.svelte';
</script>

<div class="px-5">
	<SecureAnchor page={`${base}/markers`} text={'Značky'} />
	<br />
	<br />
	<SecureAnchor page={`${base}/paths`} text={'Cesty'} />
	<br />
	<br />
	<SecureAnchor page={`${base}/groups`} text={'Skupiny'} />
</div>
<!--TODO Přidat návod, jak aplikaci používat (aby to pochopil i blbec) 
	Vítejte
	...
-->
