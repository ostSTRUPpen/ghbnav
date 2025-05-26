<script lang="ts">
	import {
		deletePath,
		updatePathVisibility
	} from '$lib/functions/dynamicPathManagementFunctions.js';
	import { invalidateAll } from '$app/navigation';
	import { staticSettings } from '$lib/data/staticData.js';

	let { data } = $props();
	let { stored_paths } = $derived(data);

	let uniquePathsTaken: number = $state(0);
	let allPathsTaken: number = $state(0);

	async function deleteStoredPath(id: string) {
		await deletePath(id);
		invalidateAll();
	}

	$effect(() => {
		uniquePathsTaken = 0;
		allPathsTaken = 0;
		stored_paths.forEach((path) => {
			uniquePathsTaken++;
			allPathsTaken += path.count;
		});
	});
</script>

<div class="space-y-5">
	<div class="px-5">
		<a class="link-secondary link text-xl" href="/sec/paths">Zpět</a> <br />
	</div>
	{#if !staticSettings.storeDynamicPaths}
		<p class="text-3xl text-error px-5">Ukládání dalších cest bylo zakázáno.</p>
	{/if}
	<div class="px-5">
		<h2 class="text-3xl">Všechny uložené cesty</h2>
		<table class="table table-md md:table-lg">
			<thead>
				<tr class="text-md md:text-xl">
					<th> Unikátní cesty: </th>
					<th>Celkem vygenerováno cest:</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="text-xl md:text-2xl text-primary">
						{uniquePathsTaken}
					</td>
					<td class="text-xl md:text-2xl text-primary">
						{allPathsTaken}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="divider"></div>
	<div class="overflow-x-auto px-5">
		<h2 class="text-3xl">Všechny uložené cesty</h2>
		<table class="table table-sm md:table-md">
			<thead>
				<tr class="text-md md:text-xl">
					<th>Začátek cesty</th>
					<th>Konec cesty</th>
					<th>Použití</th>
					<th>Skrýt</th>
					<th>Správa</th>
					<th>Stav</th>
				</tr>
			</thead>
			<tbody>
				{#each stored_paths as path}
					<tr class="hover text-md md:text-xl">
						<td>{path.start_name}</td>
						<td>{path.end_name}</td>
						<td>{path.count}</td>
						<td
							><input
								type="checkbox"
								class="checkbox checked:checkbox-error"
								bind:checked={path.hidden}
								onclick={() => updatePathVisibility(path.id, !path.hidden)}
							/></td
						>
						<td
							><button
								class="btn btn-error"
								onclick={() => {
									deleteStoredPath(path.id);
								}}>Vymazat</button
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
