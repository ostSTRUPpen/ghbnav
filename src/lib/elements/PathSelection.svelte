<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { foundPath } from '$lib/data/store.js';

	let preparedLocations: Array<any> = [];

	export let locations: Array<any>,
		navFrom: string = '',
		navTo: string = '',
		showClearNavButton: boolean = false,
		iconImageDisplayNames: object;

	let isDisabled: boolean = true;

	function navFromTo() {
		goto(`${base}/loading`).then(() => goto(`${base}/map/${navFrom}/${navTo}`));
	}
	function clearNav() {
		foundPath.update((n) => (n = ['']));
		goto(`${base}/loading`).then(() => {
			goto(`${base}/map`);
		});
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
				name: `${location.display_name} (Patro: ${location.floor})`,
				can_nav: location.can_nav,
				disabled: false
			});
		}
	}

	$: {
		if (navFrom === '0' || navTo === '0' || navFrom === navTo) {
			isDisabled = true;
		} else {
			isDisabled = false;
		}
	}
</script>

<div>
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
	<button on:click={navFromTo} disabled={isDisabled} class="btn btn-secondary">Navigovat</button>
	{#if showClearNavButton}
		<button on:click={clearNav} class="btn btn-secondary">Vymazat navigaci</button>
	{/if}
</div>
