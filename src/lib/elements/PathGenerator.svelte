<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { buildingLocationsList } from '$lib/data/staticData';
	import { printMarkersList, printSettingsString } from '$lib/data/store.js';

	let preparedLocations: Array<any> = $state([]);
	let preparedGroups: Array<any> = $state([]);
	let navFrom: string = $state('0');
	let navTo: string = $state('0');

	interface Props {
		locations: Array<any>;
		iconImageDisplayNames: object;
		settings: string;
	}

	let { locations, iconImageDisplayNames, settings }: Props = $props();

	let isDisabled: boolean = $state(true);

	function navFromTo() {
		let pathsForGeneration: Array<Array<string>> = [];
		if (settings === 'bod_skupina') {
			for (let location of locations.filter((obj) => obj.icon === navTo)) {
				pathsForGeneration.push([
					`${navFrom}/${location.id}`,
					`${locations.find((obj) => obj.id === navFrom)?.display_name} → ${location.display_name}`,
					location.display_name
				]);
			}
		} else {
			for (let location of locations.filter((obj) => obj.icon === navFrom)) {
				pathsForGeneration.push([
					`${location.id}/${navTo}`,
					`${location.display_name} → ${locations.find((obj) => obj.id === navTo)?.display_name}`,
					location.display_name
				]);
			}
		}
		//Zajišťuje seřazení Qr kódů pro jednotlivé třídy do formátu -> 1.A, 2.A. 3.A, 4.A  5.A, 6.A, 7.A, 8.A  1.C, 1.D., 2.C, 2.D 3.C, 3.D, 4.C, 4.D
		// Z důvodu lehčí přehlednosti při tisku (4 QR kódy na A4)
		if (navTo === 'kmenove_ucebny' || navFrom === 'kmenove_ucebny') {
			pathsForGeneration.sort((a, b) => {
				// Vybere jenom písmena (mělo by být jen jedno)
				let classLetterA = a[2].replace(/[^a-dA-D]+/g, '').toLocaleLowerCase();
				// Vybere jenom čísla (mělo by být jen jedno)
				let classNumberA = Number(a[2].replace(/\D+/g, ''));
				let classLetterB = b[2].replace(/[^a-dA-D]+/g, '').toLocaleLowerCase();
				let classNumberB = Number(b[2].replace(/\D+/g, ''));
				// Pokud jsou stejná písmena, tak je potřeba utvořit řadu podle čísel
				if (classLetterA === classLetterB) {
					return classNumberA - classNumberB;
				} else {
					// Jinak jsou hlavní písmena
					return classLetterA.localeCompare(classLetterB);
				}
			});
		}
		printMarkersList.update((n) => (n = pathsForGeneration));
		printSettingsString.update((n) => (n = 'path'));
		goto(resolve('/sec/markers/print', {}), { replaceState: true });
	}

	$effect(() => {
		let lastLocation: string = '';
		let tempPreparedLocations = [];
		let tempPreparedGroups = [];
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
				nav_group: location.icon,
				disabled: false
			});
		}
		for (let group of Object.entries(iconImageDisplayNames)) {
			tempPreparedGroups.push({
				id: group[0],
				name: group[1]
			});
		}
		preparedLocations = tempPreparedLocations;
		preparedGroups = tempPreparedGroups;
	});

	$effect(() => {
		if (
			navFrom === '0' ||
			navTo === '0' ||
			navFrom === navTo ||
			locations.find((obj) => obj.id === navFrom)?.icon === navTo ||
			locations.find((obj) => obj.id === navTo)?.icon === navFrom
		) {
			isDisabled = true;
		} else {
			isDisabled = false;
		}
	});
</script>

<div>
	{#if settings === 'bod_skupina'}
		<div>
			<h2 class="text-xl">Generování cest z bodu do skupiny</h2>
			<label for="from" class="label">
				<span class="label-text">Odkud: </span>
			</label>
			<select
				id="from"
				name="from"
				bind:value={navFrom}
				class="select select-bordered w-full max-w-xs"
			>
				<option value="0" disabled selected>--Prosím vyberte počáteční bod cesty--</option>
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
				<option value="0" disabled selected>--Prosím vyberte cílovou skupinu cesty--</option>
				{#each preparedGroups as group}
					<option value={group.id}>{group.name}</option>
				{/each}
			</select>
			<br />
			<button onclick={navFromTo} disabled={isDisabled} class="btn btn-secondary"
				>Vytisknout QR kódy</button
			>
		</div>
	{:else}
		<div>
			<h2 class="text-xl">Generování cest ze skupiny do bodu</h2>
			<label for="from" class="label">
				<span class="label-text">Odkud: </span>
			</label>
			<select
				id="from"
				name="from"
				bind:value={navFrom}
				class="select select-bordered w-full max-w-xs"
			>
				<option value="0" disabled selected>--Prosím vyberte startovací skupinu cesty--</option>
				{#each preparedGroups as group}
					<option value={group.id}>{group.name}</option>
				{/each}
			</select>
			<label for="to" class="label">
				<span class="label-text">Kam: </span>
			</label>
			<select id="to" name="to" bind:value={navTo} class="select select-bordered w-full max-w-xs">
				<option value="0" disabled selected>--Prosím vyberte konečný bod cesty--</option>
				{#each preparedLocations as location}
					{#if location.can_nav !== false}
						<option disabled={location.disabled} value={location.id}>{location.name}</option>
					{/if}
				{/each}
			</select>
			<br />
			<button onclick={navFromTo} disabled={isDisabled} class="btn btn-secondary"
				>Vytisknout QR kódy</button
			>
		</div>
	{/if}
</div>
