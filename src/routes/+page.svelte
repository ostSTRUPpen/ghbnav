<script lang="ts">
	import { staticSettings } from '$lib/data/staticData.js';
	import PathSelection from '$lib/elements/PathSelection.svelte';
	import PathsTable from '$lib/elements/PathsTable.svelte';

	let { data } = $props();
	let { locations, stored_paths, preset_paths, iconImageDisplayNames } = $derived(data);
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
	{#if stored_paths.length > 0 && staticSettings.storeDynamicPaths}
		<div class="flex justify-center">
			<PathsTable paths={stored_paths} tableName={'Časté cesty'} />
		</div>
	{/if}
</main>
