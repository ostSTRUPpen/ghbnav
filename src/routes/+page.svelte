<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { iconImageDisplayNames } from '$lib/data/markerIcons.js';
	//import QrCodeMaker from '$lib/elements/QRCodeMaker.svelte';
	//import QrCodeScanner from '$lib/elements/QRCodeScanner.svelte';
	//import StoreTest from '$lib/elements/StoreTest.svelte';

	/* TODO
		Roztřídit seznam cest pomocí ikon
		Zobrazit cestu vestibul->kancelář, ředitelna ....
		Zobrazit prvních 5 nejčastějších cest
		Odstranit skeleton... radši to udělám nějak ručně (nebo musím udělat design, co sedí na stránky GHB)
		DESIGN :(
		Upravit pro docker
		Až to bude připravené na publikaci, tak vymazat všechny uložené cesty
		Rozdat všude QR kódy
	*/

	export let data;
	let preparedLocations: Array<any> = [];
	let { locations, stored_paths, session } = data;
	$: ({ locations, stored_paths, session } = data);

	let navFrom: string;
	let navTo: string;
	let isDisabled: boolean = true;

	function navFromTo() {
		//console.log(navFrom + ' -> ' + navTo);
		goto(`${base}/map/${navFrom}/${navTo}`, { replaceState: false });
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

<!---<svelte:head>
	<script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
</svelte:head>-->
<!--TODO využít skeleton ke zkrášlení stránky-->
<!-- 
	TODO Přidat návod, jak aplikaci používat (aby to pochopil i blbec) 
	Vítejte
	...
-->

<!--TODO zkusit navrhnout rozložení mapové stránky ve figma-->

<main>
	<div class="w-screen flex justify-center">
		<!-- TODO víc graficky odlišit jednotlivé placeholder-->
		<div class="">
			<label for="from" class="label">
				<span class="label-text">Odkud: </span>
			</label>
			<select
				id="from"
				name="from"
				bind:value={navFrom}
				class="select select-bordered w-full max-w-xs"
			>
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
			<button on:click={navFromTo} disabled={isDisabled} class="btn-secondary rounded-md"
				>Navigovat</button
			>
		</div>

		<!-- TODO zprovoznit a otestovat -->

		<!-- TODO předefinovat -->
	</div>
	<div>caste cesty</div>
	<div>
		<table>
			<tr>
				<!--TODO přidat možnost vymazat tabulku cest do admin panelu-->
				<!-- TODO přidat ještě přednastavené cesty-->
				<th>Začátek cesty</th>
				<th>Konec cesty</th>
				<th>Něco jako počet</th>
			</tr>
			{#each stored_paths as path}
				<tr>
					<td>{path.start_name}</td>
					<td>{path.end_name}</td>
					<td>{path.end_name}</td>
					<td>{path.count}</td>
					<!--TODO dodělat link na navigovat-->
					<td
						><a href="#" class="btn-ghost text-secondary hover:text-primary hover:bg-base-100"
							>Navigovat</a
						></td
					>
				</tr>
			{/each}
		</table>
	</div>
</main>
