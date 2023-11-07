<script lang="ts">
	import SecureAnchor from '$lib/elements/SecureAnchor.svelte';
	import { changeMarker } from '../../../lib/functions/markerManagementFunctions.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { iconImageList } from '$lib/data/markerIcons.js';
	import { base } from '$app/paths';
	import { printMarkersList } from '$lib/data/store.js';
	const iconList = iconImageList;

	let localPrintMarkersList: Array<Array<string>> = [];

	export let data;
	let { markers } = data;
	$: ({ markers } = data);
	let endingPoints: Array<App.others['enlargedMarkerObject']> = [];

	for (let marker of markers) {
		endingPoints.push({
			id: marker.id,
			display_name: marker.display_name,
			floor: marker.floor,
			icon: marker.icon,
			can_nav: marker.can_nav,
			new_display_name: marker.display_name,
			new_icon: marker.icon,
			new_can_nav: marker.can_nav,
			genQR: false
		});
	}

	async function saveChanges(show: boolean = true) {
		loadingDialog['showModal']();
		let changedEndingPoints = [];
		for (let endingPoint of endingPoints) {
			if (
				endingPoint.new_display_name !== '' ||
				endingPoint.new_icon !== endingPoint.icon ||
				endingPoint.new_can_nav !== endingPoint.can_nav
			) {
				changedEndingPoints.push({
					id: endingPoint.id,
					display_name: endingPoint.new_display_name,
					icon: endingPoint.new_icon,
					can_nav: endingPoint.new_can_nav
				});
			}
		}
		if (changedEndingPoints.length > 0 && show) {
			await changeMarker(changedEndingPoints);
			loadingDialog.close();
			savingDialog['showModal']();
		}
	}
	let savingDialog: any;
	let loadingDialog: any;
	onMount(() => {
		savingDialog = document.getElementById('printing-dialog');
		loadingDialog = document.getElementById('loading-dialog');
	});

	function cancelChanges() {
		goto(`${base}/sec`, { replaceState: true });
	}

	function addQRToPrint(id: string, name: string, floor: string, changeQR: boolean) {
		if (!changeQR) {
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
		saveChanges(false);
		goto(`${base}/sec/markers/print`, { replaceState: true });
	}

	//Table design functions and variables
	/*let lastFloor: number = 0;
	function checkForFloorChange(markerFloor: number) {
		if (markerFloor === lastFloor) {
			return '';
		} else {
			lastFloor = markerFloor;
			return 'changed_floors';
		}
	}*/
</script>

<dialog id="loading-dialog" class="modal">
	<div class="modal-box flex justify-center">
		<span class="loading loading-dots loading-lg text-info" />
	</div>
</dialog>

<dialog id="printing-dialog" class="modal">
	<div class="modal-box">
		<p class="font-bold text-lg text-success">Hotovo!</p>
		<p class="text-lg py-4">Značky úspěšně upraveny.</p>
		<button
			on:click={() => {
				savingDialog.close();
				goto(`${base}/sec`, { replaceState: true });
			}}
			class="modal-action btn btn-info">Ok</button
		>
	</div>
</dialog>
<!-- TODO přidat ukázku všech dostupných ikon-->

<div class="px-5 space-y-5">
	<SecureAnchor page={''} text={'Zpět'} /> <br />
	<button on:click={printQRs} class="btn btn-secondary">Tisk QR kódů</button>
	<div class="divider" />
</div>
<table class="table table-pin-rows">
	<thead>
		<tr class="text-lg">
			<th>Patro</th>
			<th>Název značky</th>
			<th>Ikona</th>
			<th>Navigovatelný</th>
			<th
				>Nový QR kód <br />
				<button on:click={printAllQRs} class="btn btn-secondary">Vytisknout všechny QR kódy</button
				></th
			>
		</tr>
	</thead>
	<tbody>
		{#each endingPoints as endPoint}
			<!--<tr class={checkForFloorChange(endPoint.floor) + 'hover'}>-->
			<tr class="hover">
				<td class="text-xl text-primary">{endPoint.floor}</td>
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
						on:change={() =>
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
				><button on:click={() => saveChanges(true)} class="btn btn-success">Uložit změny</button>
			</td><td colspan="2"
				><button on:click={cancelChanges} class="btn btn-error">Zrušit změny</button>
			</td></tr
		>
	</tfoot>
</table>
