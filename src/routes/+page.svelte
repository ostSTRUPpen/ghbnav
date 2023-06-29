<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;
	let { endingPoints } = data;
	$: ({ endingPoints } = data);

	let navFrom: string;
	let navTo: string;

	function navFromTo() {
		console.log(navFrom + ' -> ' + navTo);
		goto(`/map/${navFrom}/${navTo}`, { replaceState: false });
	}
</script>

<div>
	<!-- TODO víc graficky odlišit jednotlivé placeholdery-->
	<div>
		<!--<label for="from">Odkud:</label>
		<input list="ending_points" id="from" name="from" bind:value={navFrom} />
		<br />
		<label for="to">Kam:</label>
		<input list="ending_points" id="to" name="to" bind:value={navTo} />
		<datalist id="ending_points">
			{#each endingPoints as endPoint}
				<option value={endPoint.display_name}/>
			{/each}
		</datalist>-->
		<!-- TODO zobrazovat patra -->
		<!-- TODO přidat placehodler (se kterým nepůjde dát navigovat)-->
		<!-- TODO Přidat kontrolu, zda from a to nejsou stejné -->
		<!-- TODO Přidat výpis patra -->
		<label for="from">Odkud:</label>
		<select id="from" name="from" bind:value={navFrom}>
			{#each endingPoints as endPoint}
				<option value={endPoint.id}>{endPoint.display_name}</option>
			{/each}
		</select>
		<label for="to">Kam:</label>
		<select id="to" name="to" bind:value={navTo}>
			{#each endingPoints as endPoint}
				<option value={endPoint.id}>{endPoint.display_name}</option>
			{/each}
		</select>
		<button on:click={navFromTo}>Navigovat</button>
	</div>

	<!-- TODO zprovoznit a otestovat -->
	<!-- TODO automatický generátor QR kódů (https://davidshimjs.github.io/qrcodejs/)-->
	<div>Skenovat qr kod</div>

	<!-- TODOD předefinovat -->
	<div>caste cesty</div>
</div>
