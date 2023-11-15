<script lang="ts">
	import { base } from '$app/paths';
	import SecureAnchor from '$lib/elements/SecureAnchor.svelte';
</script>

<div class="px-5">
	<SecureAnchor page={`${base}/markers`} text={'Značky'} />
	<br />
	<br />
	<SecureAnchor page={`${base}/paths`} text={'Cesty'} />
</div>
<!--TODO Přidat návod, jak aplikaci používat (aby to pochopil i blbec) 
	Vítejte
	...
-->
<!--TODO 
	Přidat tabulku ikon (id, display_name, image_id, position), která umožní úpravu pořadí skupin v seznamu a umožní skupiny přejmenovat. 
	Upravit tabulku markeru, aby se vázala na ikony.
	Upravit zobrazování a načítání ikon a markerů v seznamech, aby odpovídalo údajům z tabulky 
	Přidat další skupiny a (ikony)
-->
