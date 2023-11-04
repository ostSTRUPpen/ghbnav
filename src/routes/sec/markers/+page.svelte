<script lang="ts">
	import SecureAnchor from '$lib/elements/SecureAnchor.svelte';
	import { changeMarker } from '../../../lib/functions/markerManagementFunctions.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { iconImageList } from '$lib/data/markerIcons.js';
	import { base } from '$app/paths';
	import { printMarkersList } from '$lib/data/store.js';
	const iconList = iconImageList;
	// TODO - seřadit podle množství změn (nejvíc třídy a potom podle celkového počtu I guess)
	// TODO přidat všechny ikony (už chybí jen 2 X (1. PP a 1. NP))

	let localPrintMarkersList: Array<Array<string>> = [];

	export let data;
	let { markers } = data;
	$: ({ markers } = data);
	let endingPoints: Array<App.others['enlargedMarkerObject']> = [];

	// TODO seznam všech ikon a jejich displayname názvů

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
			dialog['showModal']();
		}
	}
	let dialog: any;
	onMount(() => {
		dialog = document.getElementById('deletion-dialog');
	});

	function cancelChanges() {
		goto(`${base}/sec`, { replaceState: true });
	}

	function addQRToPrint(id: string, name: string, floor: string, changeQR: boolean) {
		console.log(changeQR);
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
	let lastFloor: number = 0;
	function checkForFloorChange(markerFloor: number) {
		if (markerFloor === lastFloor) {
			return '';
		} else {
			lastFloor = markerFloor;
			return 'changed_floors';
		}
	}
</script>

<SecureAnchor page={''} text={'Zpět'} /> <br />

<dialog id="deletion-dialog">
	<h1>Značky úspěšně upraveny</h1>
	<button
		on:click={() => {
			dialog.close();
			goto(`${base}/sec`, { replaceState: true });
		}}>Ok</button
	>
</dialog>
<!-- TODO přidat ukázku všech dostupných ikon-->
<!-- TODO Víc graficky rozlišit patra a vylepšit grafiku tabulky-->
<button on:click={printQRs}>Tisk QR kódů</button>
<table>
	<thead>
		<tr>
			<th>Patro</th>
			<th>Název značky</th>
			<th>Ikona</th>
			<th>Navigovatelný</th>
			<th>Nový QR kód <br /> <button on:click={printAllQRs}>Vytisknout všechny QR kódy</button></th>
		</tr>
	</thead>
	<tbody>
		{#each endingPoints as endPoint}
			<tr class={checkForFloorChange(endPoint.floor)}>
				<td>{endPoint.floor}</td>
				<td
					><input
						type="text"
						maxlength="50"
						bind:value={endPoint.new_display_name}
						class="dark:bg-stone-400"
					/></td
				>
				<td>
					<select id="icon" bind:value={endPoint.new_icon} class="dark:bg-stone-400">
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
					<input type="checkbox" bind:checked={endPoint.new_can_nav} />
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
					/>
				</td>
			</tr>
		{/each}
	</tbody>
	<tfoot>
		<tr>
			<td colspan="2"><button on:click={() => saveChanges(true)}>Uložit změny</button> </td><td
				colspan="2"
				><button on:click={cancelChanges}>Zrušit změny</button>
			</td></tr
		>
	</tfoot>
</table>

<style>
	/* Table design */
	table {
		border-collapse: collapse;
	}
	.changed_floors {
		border-top: 1pt solid black;
	}
</style>
