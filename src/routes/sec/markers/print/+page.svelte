<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { printMarkersList } from '$lib/data/store';
	import QrCodeMaker from '$lib/elements/QRCodeMaker.svelte';
	import SecureAnchor from '$lib/elements/SecureAnchor.svelte';
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
		const theme = document.querySelector('html')?.getAttribute('data-theme');
		document.querySelector('html')?.setAttribute('data-theme', 'ghb_light');
		window.print();
		if (typeof theme == 'string') document.querySelector('html')?.setAttribute('data-theme', theme);
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
<div class="px-5 print:hidden">
	<button class="btn btn-info" on:click={startPrint}>Tisk</button>
	<br />
	<SecureAnchor page={'/markers'} text={'Zpět'} /> <br />
</div>
<div>
	{#each data as markerInfo}
		<QrCodeMaker id={markerInfo[0]} name={markerInfo[1]} floor={markerInfo[2]} />
	{/each}
</div>
