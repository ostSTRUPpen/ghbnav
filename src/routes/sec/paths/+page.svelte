<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import SecureAnchor from '$lib/elements/SecureAnchor.svelte';
	import {
		deletePath,
		updatePathVisibility
	} from '$lib/functions/dynamicPathManagementFunctions.js';
	import { updatePath } from '$lib/functions/presetPathManagementFunctions.js';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	export let data;
	let { locations, stored_paths, preset_paths, iconImageDisplayNames } = data;
	$: ({ locations, stored_paths, preset_paths, iconImageDisplayNames } = data);

	let successDialog: any;
	let loadingDialog: any;
	let errorDialog: any;
	let errors: SerializedServerResponse[] = [];

	onMount(() => {
		successDialog = document.getElementById('success-dialog');
		loadingDialog = document.getElementById('loading-dialog');
		errorDialog = document.getElementById('error-dialog');
	});

	function cancelChanges() {
		goto(`${base}/sec`, { replaceState: true });
	}

	let preparedLocations: Array<any> = [];
	$: {
		let lastLocation: string = '';
		for (let location of locations) {
			if (location.icon !== lastLocation) {
				lastLocation = location.icon;
				preparedLocations.push({
					id: 0,
					name: `--${iconImageDisplayNames[lastLocation as keyof typeof iconImageDisplayNames]}--`,
					can_nav: true,
					disabled: true
				});
			}
			preparedLocations.push({
				id: location.id,
				name: `${location.display_name} (Patro: ${location.floor})`,
				can_nav: location.can_nav,
				disabled: false
			});
		}
	}
	async function savePresetPathsChanges() {
		loadingDialog['showModal']();
		for (let preset_path of preset_paths) {
			const response: SerializedServerResponse = await updatePath(
				preset_path.id,
				preset_path.start_node,
				preset_path.end_node,
				preset_path.hidden
			);

			if (response.code !== '200' && response.code !== '201') {
				errors.push(response);
			}
		}
		errors = errors;
		loadingDialog.close();
		if (errors.length > 0) {
			errorDialog['showModal']();
		} else {
			successDialog['showModal']();
		}
	}

	async function deleteStoredPath(id: string) {
		await deletePath(id);
		invalidateAll();
	}
</script>

<dialog id="loading-dialog" class="modal">
	<div class="modal-box flex justify-center">
		<span class="loading loading-dots loading-lg text-info" />
	</div>
</dialog>

<dialog id="success-dialog" class="modal">
	<div class="modal-box">
		<p class="font-bold text-lg text-success">Hotovo!</p>
		<p class="text-lg py-4">Cesty úspěšně upraveny.</p>
		<button
			on:click={() => {
				successDialog.close();
				goto(`${base}/sec`, { replaceState: true });
			}}
			class="modal-action btn btn-info">Ok</button
		>
	</div>
</dialog>

<dialog id="error-dialog" class="modal">
	<div class="modal-box">
		<p class="font-bold text-lg text-error">Došlo k chybě!</p>
		<ul>
			{#each errors as error}
				<li class="text-error">
					<span class="font-bold">{error.code}</span> - <span>{error.message}</span>
				</li>
			{/each}
		</ul>
		<button
			on:click={() => {
				errorDialog.close();
				goto(`${base}/sec`, { replaceState: true });
			}}
			class="modal-action btn btn-info">Ok</button
		>
	</div>
</dialog>

<div class="space-y-5">
	<div class="px-5">
		<SecureAnchor page={''} text={'Zpět'} /> <br />
	</div>
	<div class="divider" />
	<div class="overflow-x-auto px-5">
		<h2 class="text-xl">Přednastavené cesty</h2>
		<table class="table table-sm md:table-md">
			<thead>
				<tr class="text-md md:text-xl">
					<th>Začátek cesty</th>
					<th>Konec cesty</th>
					<th>Pozice v seznamu</th>
					<th>Skrýt</th>
				</tr>
			</thead>
			<tbody>
				{#each preset_paths as path}
					<tr class="hover text-md md:text-xl">
						<td>
							<select bind:value={path.start_node} class="select select-bordered w-full max-w-xs">
								{#each preparedLocations as location}
									{#if location.can_nav !== false}
										<option disabled={location.disabled} value={location.id}>{location.name}</option
										>
									{/if}
								{/each}
							</select>
						</td>
						<td>
							<select bind:value={path.end_node} class="select select-bordered w-full max-w-xs">
								{#each preparedLocations as location}
									{#if location.can_nav !== false}
										<option disabled={location.disabled} value={location.id}>{location.name}</option
										>
									{/if}
								{/each}
							</select>
						</td>
						<td>
							<p class="text-md">{path.position}</p>
						</td>
						<td
							><input
								type="checkbox"
								class="checkbox checked:checkbox-error"
								bind:checked={path.hidden}
							/></td
						>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan="2"
						><button on:click={() => savePresetPathsChanges()} class="btn btn-success"
							>Uložit změny</button
						>
					</td><td colspan="2"
						><button on:click={cancelChanges} class="btn btn-error">Zrušit změny</button>
					</td></tr
				>
			</tfoot>
		</table>
	</div>

	<div class="divider">Uložené často používané cesty</div>
	<div class="overflow-x-auto px-5">
		<h2 class="text-3xl">Uložené často používané cesty</h2>
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
								on:click={() => updatePathVisibility(path.id, !path.hidden)}
							/></td
						>
						<td
							><button
								class="btn btn-error"
								on:click={() => {
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
