<script lang="ts">
	import PathSelection from '$lib/elements/PathSelection.svelte';
	import PathsTable from '$lib/elements/PathsTable.svelte';

	/* TODO
		Zkusit caching
		Nějak upravit display uložených cest (pokud skryje 1. pět, tak nemůže už skrýt další 
		(protože on je neuvidí (myslím - možná je stejná úprava potřeba i u zobrazení public)))
		-Asi u něj nějaký přepínač pro zobrazení skrytých a public prostě už netahání skrytých z db

		Až to bude připravené na publikaci, tak vymazat všechny uložené cesty
		
		Napsat článek
		Rozdat všude QR kódy
	*/

	export let data;
	let { locations, stored_paths, preset_paths, iconImageDisplayNames } = data;
	$: ({ locations, stored_paths, preset_paths, iconImageDisplayNames } = data);
</script>

<main class="max-lg:space-y-14 lg:grid md:max-2xl:grid-cols-2 2xl:grid-cols-3 2xl:gap-4">
	<div class="flex justify-center max-2xl:col-span-2">
		<PathSelection {locations} {iconImageDisplayNames} />
	</div>
	{#if preset_paths.length > 0}
		<div class="flex justify-center">
			<PathsTable paths={preset_paths} tableName={'Přednastavené cesty'} showCount={false} />
		</div>
	{/if}
	{#if stored_paths.length > 0}
		<div class="flex justify-center">
			<PathsTable paths={stored_paths} tableName={'Časté cesty'} />
		</div>
	{/if}
</main>
