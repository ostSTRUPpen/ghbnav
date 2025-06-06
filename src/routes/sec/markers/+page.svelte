<script lang="ts">
	import { changeMarker } from '../../../lib/functions/markerManagementFunctions.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { printMarkersList, printSettingsString } from '$lib/data/store.js';
	import { iconImages } from '$lib/data/markerIcons.js';
	import { buildingLocationsList } from '$lib/data/staticData.js';

	let { data } = $props();
	let { markers, iconList } = $derived(data);

	let localPrintMarkersList: Array<Array<string>> = [];
	let savingError: SerializedServerResponse = $state({ message: '', code: '' });
	let endingPoints: Array<enlargedMarkerObject> = $state([]);
	$effect(() => {
		let tempEndingPoints = [];
		for (let marker of markers) {
			tempEndingPoints.push({
				id: marker.id,
				display_name: marker.display_name,
				floor: marker.floor,
				building_location: marker.building_location,
				icon: marker.icon,
				can_nav: marker.can_nav,
				new_display_name: marker.display_name,
				new_icon: marker.icon,
				new_can_nav: marker.can_nav,
				new_building_location: marker.building_location,
				genQR: false
			});
		}
		endingPoints = tempEndingPoints;
	});

	let successDialog: any = $state();
	let loadingDialog: any;
	let errorDialog: any = $state();
	onMount(() => {
		successDialog = document.getElementById('success-dialog');
		loadingDialog = document.getElementById('loading-dialog');
		errorDialog = document.getElementById('error-dialog');
	});

	async function saveChanges(show: boolean = true) {
		loadingDialog['showModal']();
		let changedEndingPoints = [];
		for (let endingPoint of endingPoints) {
			if (
				endingPoint.new_display_name !== '' ||
				endingPoint.new_icon !== endingPoint.icon ||
				endingPoint.new_can_nav !== endingPoint.can_nav ||
				endingPoint.new_building_location !== endingPoint.building_location
			) {
				changedEndingPoints.push({
					id: endingPoint.id,
					display_name: endingPoint.new_display_name,
					icon: endingPoint.new_icon,
					can_nav: endingPoint.new_can_nav,
					building_location: endingPoint.new_building_location
				});
			}
		}
		if (changedEndingPoints.length > 0 && show) {
			const response = await changeMarker(changedEndingPoints);
			loadingDialog.close();
			if (response.code !== '200' && response.code !== '201') {
				savingError = response;
				errorDialog['showModal']();
			} else {
				successDialog['showModal']();
			}
		}
	}

	function cancelChanges() {
		goto(`/sec`, { replaceState: true });
	}

	function addQRToPrint(id: string, name: string, floor: string, changeQR: boolean) {
		if (changeQR) {
			localPrintMarkersList.push([id, name, floor]);
		}
	}
	function printAllQRs() {
		for (let endingPoint of endingPoints) {
			localPrintMarkersList.push([
				endingPoint.id,
				endingPoint.new_display_name,
				endingPoint.floor.toString()
			]);
		}
		printQRs();
	}

	function printQRs() {
		printMarkersList.update((n) => (n = localPrintMarkersList));
		printSettingsString.update((n) => (n = 'marker'));
		saveChanges(false);
		goto(`/sec/markers/print`, { replaceState: true });
	}
</script>

<dialog id="loading-dialog" class="modal">
	<div class="modal-box flex justify-center">
		<span class="loading loading-dots loading-lg text-info"></span>
	</div>
</dialog>

<dialog id="success-dialog" class="modal">
	<div class="modal-box">
		<p class="font-bold text-lg text-success">Hotovo!</p>
		<p class="text-lg py-4">Značky úspěšně upraveny.</p>
		<p class="font-bold text-lg text-warning">Změny se projeví až po pěti minutách!</p>
		<button
			onclick={() => {
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
			<li class="text-error">
				<span class="font-bold">{savingError.code}</span> - <span>{savingError.message}</span>
			</li>
		</ul>
		<button
			onclick={() => {
				errorDialog.close();
				goto(`${base}/sec`, { replaceState: true });
			}}
			class="modal-action btn btn-info">Ok</button
		>
	</div>
</dialog>

<div class="px-5 space-y-5">
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div tabindex="0" class="collapse collapse-arrow border border-secondary bg-base-100">
		<div class="collapse-title text-xl font-medium text-primary">Ikony</div>
		<div class="collapse-content bg-white">
			{#each iconList as icon}
				<div class="float-left px-5">
					<label for="img_icon" class="label">
						<span class="label-text text-black text-lg">{icon.displayname}</span>
					</label>
					<img
						id="img_icon"
						src={iconImages[icon.image]}
						alt={icon.displayname}
						class="flex justify-center"
					/>
				</div>
			{/each}
		</div>
	</div>
	<a class="link-secondary link text-xl" href="/sec">Zpět</a> <br />
	<button onclick={printQRs} class="btn btn-secondary">Tisk QR kódů</button>
	<button onclick={printAllQRs} class="btn btn-secondary">Vytisknout všechny QR kódy</button>
	<div class="divider"></div>
</div>
<table class="table table-pin-rows">
	<thead>
		<tr class="text-lg">
			<th>Patro</th>
			<th>Budova</th>
			<th>Název značky</th>
			<th>Ikona</th>
			<th>Navigovatelný</th>
			<th>Nový QR kód <br /> </th>
		</tr>
	</thead>
	<tbody>
		{#each endingPoints as endPoint}
			<!--<tr class={checkForFloorChange(endPoint.floor) + 'hover'}>-->
			<tr class="hover">
				<td class="text-xl text-primary">{endPoint.floor}</td>
				<td class=""
					><select
						id="icon"
						bind:value={endPoint.new_building_location}
						class="select select-bordered w-full max-w-xs"
					>
						{#each buildingLocationsList as buildingLocation}
							{#if endPoint.icon === buildingLocation.name}
								<option value={buildingLocation.name} selected
									>{buildingLocation.displayName}</option
								>
							{:else}
								<option value={buildingLocation.name}>{buildingLocation.displayName}</option>
							{/if}
						{/each}
					</select></td
				>
				<td
					><input
						type="text"
						maxlength="50"
						bind:value={endPoint.new_display_name}
						class="input input-bordered"
					/></td
				>
				<td>
					<select
						id="icon"
						bind:value={endPoint.new_icon}
						class="select select-bordered w-full max-w-xs"
					>
						{#each iconList as icon}
							{#if endPoint.icon === icon['name']}
								<option value={icon['name']} selected>{icon.displayname}</option>
							{:else}
								<option value={icon['name']}>{icon.displayname}</option>
							{/if}
						{/each}
					</select>
				</td>
				<td>
					<input
						type="checkbox"
						bind:checked={endPoint.new_can_nav}
						class="checkbox checkbox-success"
					/>
				</td>
				<td>
					<input
						type="checkbox"
						onchange={() =>
							addQRToPrint(
								endPoint.id,
								endPoint.new_display_name,
								endPoint.floor.toString(),
								endPoint.genQR
							)}
						bind:checked={endPoint.genQR}
						class="checkbox checkbox-secondary"
					/>
				</td>
			</tr>
		{/each}
	</tbody>
	<tfoot>
		<tr>
			<td colspan="2"
				><button onclick={() => saveChanges(true)} class="btn btn-success">Uložit změny</button>
			</td><td colspan="2"
				><button onclick={cancelChanges} class="btn btn-error">Zrušit změny</button>
			</td></tr
		>
	</tfoot>
</table>
