<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { buildingLocationsList } from '$lib/data/staticData';
	import { foundPath, printMarkersList, printSettingsString } from '$lib/data/store.js';

	let preparedLocations: Array<any> = $state([]);

	interface Props {
		locations: Array<any>;
		navFrom?: string;
		navTo?: string;
		showClearNavButton?: boolean;
		iconImageDisplayNames: object;
		printQR?: boolean;
	}

	let {
		locations,
		navFrom = $bindable(''),
		navTo = $bindable(''),
		showClearNavButton = false,
		iconImageDisplayNames,
		printQR = false
	}: Props = $props();

	//$effect(() => {console.log(preparedLocations)});

	let isDisabled: boolean = $state	(true);

	function navFromTo() {
		if (printQR) {
			printMarkersList.update(
				(n) =>
					(n = [
						[
							`${navFrom}/${navTo}`,
							`${locations.find((obj) => obj.id === navFrom)?.display_name} → ${
								locations.find((obj) => obj.id === navTo)?.display_name
							}`,
							''
						]
					])
			);
			printSettingsString.update((n) => (n = 'path'));
			goto(`${base}/sec/markers/print`, { replaceState: true });
		} else {
			goto(`${base}/loading`).then(() =>
				goto(`${base}/map/${navFrom}/${navTo}`, { replaceState: true })
			);
		}
	}
	function clearNav() {
		foundPath.update((n) => (n = ['']));
		goto(`${base}/loading`).then(() => {
			goto(`${base}/map`, { replaceState: true });
		});
	}

	$effect(() => {
		let lastLocation: string = '';
		let tempPreparedLocations = [];
		for (let location of locations) {
			if (location.icon !== lastLocation) {
				lastLocation = location.icon;
				tempPreparedLocations.push({
					id: 0,
					name: `--${iconImageDisplayNames[lastLocation as keyof typeof iconImageDisplayNames]}--`,
					can_nav: true,
					disabled: true
				});
			}
			tempPreparedLocations.push({
				id: location.id,
				name: `${location.display_name} (Patro: ${location.floor}, ${
					buildingLocationsList.filter(
						(buildingLocation) => buildingLocation.name === location.building_location
					)[0].displayName
				})`,
				can_nav: location.can_nav,
				disabled: false
			});
		}
		preparedLocations = tempPreparedLocations;
	});


	$effect(() => {
		if (navFrom !== '' && navFrom !== navTo) {
			isDisabled = false;
		} else {
			isDisabled = true;
		}
	});
</script>

<div class="space-y-2">
	<h2 class="text-xl">Navigace</h2>
	<label for="from" class="label">
		<span class="label-text">Odkud: </span>
	</label>
	<select id="from" name="from" bind:value={navFrom} class="select select-bordered w-full max-w-xs">
		<option value="0" disabled selected>--Prosím vyberte začátek cesty--</option>
		{#each preparedLocations as location}
			{#if location.can_nav !== false}
				<option disabled={location.disabled} value={location.id}>{location.name}</option>
			{/if}
		{/each}
	</select>
	<label for="to" class="label">
		<span class="label-text">Kam: </span>
	</label>
	<select id="to" name="to" bind:value={navTo} class="select select-bordered w-full max-w-xs">
		<option value="0" disabled selected>--Prosím vyberte konec cesty--</option>
		{#each preparedLocations as location}
			{#if location.can_nav !== false}
				<option disabled={location.disabled} value={location.id}>{location.name}</option>
			{/if}
		{/each}
	</select>
	<br />
	<button onclick={navFromTo} disabled={isDisabled} class="btn btn-secondary"
		>{printQR ? 'Vytisknout QR kód' : 'Navigovat'}</button
	>
	{#if showClearNavButton}
		<button onclick={clearNav} class="btn btn-secondary">Vymazat navigaci</button>
	{/if}
</div>
