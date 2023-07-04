<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;
	let { endingPoints, session } = data;
	$: ({ endingPoints, session } = data);

	let navFrom: string;
	let navTo: string;
	let isDisabled: boolean = true;

	function navFromTo() {
		console.log(navFrom + ' -> ' + navTo);
		goto(`/map/${navFrom}/${navTo}`, { replaceState: false });
	}

	$: {
		if (navFrom === '0' || navTo === '0' || navFrom === navTo) {
			isDisabled = true;
		} else {
			isDisabled = false;
		}
	}
</script>

<!-- 
	TODO Přidat návod, jak aplikaci používat (aby to pochopil i blbec) 
	Vítejte
	...
-->

<header>
	<a href="/map">Mapa</a>
	{#if session}
		<a href="/sec">Zabezpečená část</a>
	{/if}
</header>
<main>
	<div>
		<!-- TODO víc graficky odlišit jednotlivé placeholdery-->
		<div>
			<!-- TODO možná to nějak jinak seřaďit, aby to dávalo smysl 
			
				Např:
					Služby
						toalety, bufet, skříňkové šatny, knihovna, čítárna, psycholožka
					administrace
						ředitel, zástupce ředitele, kancelář, archiv, sborovna, školník
					výuka
						třída, posluchárna, laboratoř, kabinet, tělocvična, ateliér, badatelna
					Pohyb
						schodiště, vstupní prostor
					Ostatní
						... ostatní
					


			
			-->
			<label for="from">Odkud:</label>
			<select id="from" name="from" bind:value={navFrom}>
				<option value="0">--Prosím vyberte začátek cesty--</option>
				{#each endingPoints as endPoint}
					<option value={endPoint.id}>{endPoint.display_name} (Patro: {endPoint.floor})</option>
				{/each}
			</select>
			<label for="to">Kam:</label>
			<select id="to" name="to" bind:value={navTo}>
				<option value="0">--Prosím vyberte konec cesty--</option>
				{#each endingPoints as endPoint}
					<option value={endPoint.id}>{endPoint.display_name} (Patro: {endPoint.floor})</option>
				{/each}
			</select>
			<button on:click={navFromTo} disabled={isDisabled}>Navigovat</button>
		</div>

		<!-- TODO zprovoznit a otestovat -->
		<!-- TODO automatický generátor QR kódů (https://davidshimjs.github.io/qrcodejs/)-->
		<div>Skenovat qr kod</div>

		<!-- TODOD předefinovat -->
		<div>caste cesty</div>
	</div>
</main>
<footer>
	<a href="/auth">Přihlásit se</a>
</footer>
