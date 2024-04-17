<script lang="ts">
	import { goto } from '$app/navigation';
	import { printMarkersList, printSettingsString } from '$lib/data/store';
	import QrCodeMaker from '$lib/elements/QRCodeMaker.svelte';
	import { onMount } from 'svelte';

	let printData: Array<Array<string>> | Array<string> = [];
	let printSettings: string = '';
	printMarkersList.subscribe((value: string[] | string[][]) => (printData = value));
	printSettingsString.subscribe((value: string) => (printSettings = value));

	let errorDialog: any;

	onMount(() => {
		errorDialog = document.getElementById('error-dialog');
		if (printData.length <= 0) {
			errorDialog['showModal']();
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

<dialog id="error-dialog" class="modal">
	<div class="modal-box">
		<p class="font-bold text-lg text-error">Došlo k chybě!</p>
		<ul>
			<li class="text-error">
				<span class="font-bold">400</span> -
				<span>Seznam QR kódů pro tisk je příliš krátký!</span>
			</li>
		</ul>
		<button
			on:click={() => {
				errorDialog.close();
				goto(`/sec`, { replaceState: true });
			}}
			class="modal-action btn btn-info">Ok</button
		>
	</div>
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
