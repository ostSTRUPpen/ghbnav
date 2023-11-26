<script lang="ts">
	import { base } from '$app/paths';
	import SecureAnchor from '$lib/elements/SecureAnchor.svelte';
</script>

<div class="text-center">
	<h2 class="text-3xl py-5 text-primary">Dobrý den!</h2>
	<SecureAnchor page={`${base}/markers`} text={'Značky'} />
	<br />
	<br />
	<SecureAnchor page={`${base}/paths`} text={'Cesty'} />
	<br />
	<br />
	<SecureAnchor page={`${base}/groups`} text={'Skupiny'} />
</div>
