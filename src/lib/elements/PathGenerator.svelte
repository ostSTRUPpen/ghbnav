<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { foundPath, printMarkersList, printSettingsString } from '$lib/data/store.js';

	let preparedLocations: Array<any> = [];
	let preparedGroups: Array<any> = [];
	let navFrom: string;
	let navTo: string;

	export let locations: Array<any>, iconImageDisplayNames: object, settings: string;

	let isDisabled: boolean = true;

	function navFromTo() {
		let pathsForGeneration: Array<Array<string>> = [];
		if (settings === 'bod_skupina') {
			for (let location of locations.filter((obj) => obj.icon === navTo)) {
				pathsForGeneration.push([
					`${navFrom}/${location.id}`,
					`${locations.find((obj) => obj.id === navFrom)?.display_name} → ${location.display_name}`
				]);
			}
		} else {
			for (let location of locations.filter((obj) => obj.icon === navFrom)) {
				pathsForGeneration.push([
					`${location.id}/${navTo}`,
					`${location.display_name} → ${locations.find((obj) => obj.id === navTo)?.display_name}`
				]);
			}
		}
		printMarkersList.update((n) => (n = pathsForGeneration));
		printSettingsString.update((n) => (n = 'path'));
		goto(`${base}/sec/markers/print`, { replaceState: true });
	}

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
				name: `${location.display_name} (Patro: ${location.floor}, ${location.building_location})`,
				can_nav: location.can_nav,
				nav_group: location.icon,
				disabled: false
			});
		}
		for (let group of Object.entries(iconImageDisplayNames)) {
			preparedGroups.push({
				id: group[0],
				name: group[1]
			});
		}
	}

	$: {
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
	}
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
			<button on:click={navFromTo} disabled={isDisabled} class="btn btn-secondary"
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
			<button on:click={navFromTo} disabled={isDisabled} class="btn btn-secondary"
				>Vytisknout QR kódy</button
			>
		</div>
	{/if}
</div>
