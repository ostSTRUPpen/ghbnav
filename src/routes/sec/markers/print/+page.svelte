<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { printMarkersList } from '$lib/data/store';
	import QrCodeMaker from '$lib/elements/QRCodeMaker.svelte';
	import { onMount } from 'svelte';

	let data: Array<Array<string>> | Array<string> = [];
	printMarkersList.subscribe((value) => (data = value));
	let dialog: any;

	onMount(() => {
		dialog = document.getElementById('error-dialog');
		if (data.length <= 0) {
			dialog['showModal']();
		}
	});

	function startPrint() {
		window.print();
	}
</script>

<dialog id="error-dialog">
	<h1>Seznam QR kódů je příliš krátký</h1>
	<button
		on:click={() => {
			dialog.close();
			goto(`${base}/sec`, { replaceState: true });
		}}>Ok</button
	>
</dialog>
<div class="px-5">
	<button class="print:hidden btn btn-info" on:click={startPrint}>Tisk</button>
</div>
<div id="printElement">
	{#each data as markerInfo}
		<QrCodeMaker id={markerInfo[0]} name={markerInfo[1]} floor={markerInfo[2]} />
	{/each}
</div>
