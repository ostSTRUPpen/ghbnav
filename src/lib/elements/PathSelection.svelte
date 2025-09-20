<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { buildingLocationsList } from '$lib/data/staticData';
	import { foundPath, printMarkersList, printSettingsString } from '$lib/data/store.js';
	import Select from 'svelte-select';

	let preparedLocations: Array<any> = $state([]);

	interface Props {
		locations: Array<any>;
		navFrom?: any;
		navTo?: any;
		showClearNavButton?: boolean;
		iconImageDisplayNames: object;
		printQR?: boolean;
	}

	let {
		locations,
		navFrom = $bindable(null),
		navTo = $bindable(null),
		showClearNavButton = false,
		iconImageDisplayNames,
		printQR = false
	}: Props = $props();

	let isDisabled: boolean = $state(true);

	function navFromTo() {
		if (printQR) {
			printMarkersList.update(
				(n) =>
					(n = [
						[
							`${navFrom.value}/${navTo.value}`,
							`${locations.find((obj) => obj.id === navFrom.value)?.display_name} → ${
								locations.find((obj) => obj.id === navTo.value)?.display_name
							}`,
							''
						]
					])
			);
			printSettingsString.update((n) => (n = 'path'));
			goto(resolve('/sec/markers/print', {}), { replaceState: true });
		} else {
			goto(resolve('/loading', {})).then(() =>
				goto(resolve('/map/[navFrom]/[navTo]', { navFrom: navFrom.value, navTo: navTo.value }), {
					replaceState: true
				})
			);
		}
	}
	function clearNav() {
		foundPath.update((n) => (n = ['']));
		goto(resolve('/loading', {})).then(() => {
			goto(resolve('/map', {}), { replaceState: true });
		});
	}

	$effect(() => {
		let tempPreparedLocations = [];
		for (let location of locations) {
			if(location.can_nav === false) {
				continue;
			}
			tempPreparedLocations.push({
				value: location.id,
				label: `${location.display_name} (Patro: ${location.floor}, ${
					buildingLocationsList.filter(
						(buildingLocation) => buildingLocation.name === location.building_location
					)[0].displayName
				})`,
				group: `${iconImageDisplayNames[location.icon as keyof typeof iconImageDisplayNames]}`,
				selectable: location.can_nav
			});
		}
		preparedLocations = tempPreparedLocations;
	});

	$effect(() => {
		if (navFrom && navFrom.value !== '' && navFrom.value !== navTo?.value) {
			isDisabled = false;
		} else {
			isDisabled = true;
		}
	});
</script>

<div class="space-y-2 max-sm:min-w-80 sm:min-w-96">
	<h2 class="text-xl">Navigace</h2>
	<label for="from" class="label">
		<span class="label-text">Odkud: </span>
	</label>
	<Select
		items={preparedLocations}
		placeholder="Prosím vyberte začátek cesty"
		id="from"
		name="from"
		bind:value={navFrom}
		class="select select-bordered w-full max-w-md"
		clearable={false}
	/>
	<label for="to" class="label">
		<span class="label-text">Kam: </span>
	</label>
	<Select
		items={preparedLocations}
		placeholder="Prosím vyberte konec cesty"
		id="to"
		name="to"
		bind:value={navTo}
		class="select select-bordered w-ful max-w-md"
		clearable={false}
	/>
	<br />
	<button onclick={navFromTo} disabled={isDisabled} class="btn btn-secondary"
		>{printQR ? 'Vytisknout QR kód' : 'Navigovat'}</button
	>
	{#if showClearNavButton}
		<button onclick={clearNav} class="btn btn-secondary">Vymazat navigaci</button>
	{/if}
</div>
