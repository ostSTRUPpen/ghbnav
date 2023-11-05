<script lang="ts">
	import PathSelection from '$lib/elements/PathSelection.svelte';
	import PathsTable from '$lib/elements/PathsTable.svelte';
	//import QrCodeMaker from '$lib/elements/QRCodeMaker.svelte';
	//import QrCodeScanner from '$lib/elements/QRCodeScanner.svelte';
	//import StoreTest from '$lib/elements/StoreTest.svelte';

	/* TODO
		Roztřídit seznam cest pomocí ikon
		Zobrazit cestu vestibul->kancelář, ředitelna ....
		Zobrazit prvních 5 nejčastějších cest
		Odstranit skeleton... radši to udělám nějak ručně (nebo musím udělat design, co sedí na stránky GHB)
		DESIGN :(
		Upravit pro docker
		Až to bude připravené na publikaci, tak vymazat všechny uložené cesty
		Rozdat všude QR kódy
	*/

	export let data;
	let { locations, stored_paths } = data;
	$: ({ locations, stored_paths } = data);
</script>

<main class="space-y-14">
	<div class="w-screen flex justify-center">
		<PathSelection {locations} />
	</div>
	<!-- TODO přidat přednastavené cesty-->
	<div class="w-screen flex justify-center">
		<PathsTable {stored_paths} tableName={'Přednastavené cesty'} showCount={false} />
	</div>
	<div class="w-screen flex justify-center">
		<PathsTable {stored_paths} tableName={'Časté cesty'} />
	</div>
</main>
