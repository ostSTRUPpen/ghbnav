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

	<div>Skenovat qr kod</div>

	<div>caste cesty</div>
</div>
