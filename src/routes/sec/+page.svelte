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

<!--TODO přidat pozdravení a možná nějaký basic návod-->
<!--TODO upravit zobrazení úspěchu při uložení, tak aby odpovídalo pravdě (v závislosti na zprávě, kterou vrátí DB) (Pokud ERROR, tak ho musím vypsat!)-->
<!--TODO U věcí, co se ukládají sami (např viditelnost cesty) přidat fajfku/loading/křížek podle toho, jestli je uložená/ukládá se/došlo k chybě (po najetí na křížek se zobrazí ERROR text)-->
