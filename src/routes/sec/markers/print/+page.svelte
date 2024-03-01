<script lang="ts">
	import { goto } from '$app/navigation';
	import { printMarkersList, printSettingsString } from '$lib/data/store';
	import QrCodeMaker from '$lib/elements/QRCodeMaker.svelte';
	import { onMount } from 'svelte';

	let printData: Array<Array<string>> | Array<string> = [];
	let printSettings: string = '';
	printMarkersList.subscribe((value: string[] | string[][]) => (printData = value));
	printSettingsString.subscribe((value: string) => (printSettings = value));

	let dialog: any;

	onMount(() => {
		dialog = document.getElementById('error-dialog');
		if (printData.length <= 0) {
			dialog['showModal']();
		}
	});

	function startPrint() {
		const theme = document.querySelector('html')?.getAttribute('printData-theme');
		document.querySelector('html')?.setAttribute('printData-theme', 'ghb_light');
		window.print();
		if (typeof theme == 'string')
			document.querySelector('html')?.setAttribute('printData-theme', theme);
	}
</script>

<dialog id="error-dialog">
	<h1>Seznam QR kódů je příliš krátký</h1>
	<button
		on:click={() => {
			dialog.close();
			goto('/sec', { replaceState: true });
		}}>Ok</button
	>
</dialog>
<div class="px-5 print:hidden">
	<button class="btn btn-info" on:click={startPrint}>Tisk</button>
	<br />
	<a class="link-secondary link text-xl" href="/sec">Zpět</a>
</div>
<div>
	{#each printData as markerInfo}
		<QrCodeMaker
			id={markerInfo[0]}
			name={markerInfo[1]}
			floor={markerInfo[2]}
			settings={printSettings}
		/>
	{/each}
</div>
