<script lang="ts">
	import { goto } from '$app/navigation';
	import { printMarkersList, printSettingsString } from '$lib/data/store';
	import QrCodeMaker from '$lib/elements/QRCodeMaker.svelte';
	import { onMount } from 'svelte';

	let printData: string[][] = $state([]);
	let printSettings = $state('');
	printMarkersList.subscribe((value) => (printData = value));
	printSettingsString.subscribe((value) => (printSettings = value));

	let errorDialog: HTMLDialogElement;

	onMount(() => {
		if (printData.length <= 0) {
			errorDialog.showModal();
		}
	});

	function startPrint() {
		const theme = document.querySelector('html')?.getAttribute('printData-theme');
		document.querySelector('html')?.setAttribute('printData-theme', 'ghb_light');
		window.print();
		if (typeof theme === 'string')
			document.querySelector('html')?.setAttribute('printData-theme', theme);
	}
</script>

<dialog bind:this={errorDialog} id="error-dialog" class="modal">
	<div class="modal-box">
		<p class="font-bold text-lg text-error">Došlo k chybě!</p>
		<ul>
			<li class="text-error">
				<span class="font-bold">400</span> -
				<span>Seznam QR kódů pro tisk je příliš krátký!</span>
			</li>
		</ul>
		<button
			onclick={() => {
				errorDialog.close();
				goto(`/sec`, { replaceState: true });
			}}
			class="modal-action btn btn-info">Ok</button
		>
	</div>
</dialog>
<div class="px-5 print:hidden">
	<button class="btn btn-info" onclick={startPrint}>Tisk</button>
	<br />
	<a class="link-secondary link text-xl" href="/sec">Zpět</a>
</div>
<div>
	{#each printData as markerInfo}
		<div class="max-h-1 qrPrintDiv">
			<QrCodeMaker
				id={markerInfo[0]}
				name={markerInfo[1]}
				floor={markerInfo[2]}
				settings={printSettings}
			/>
		</div>
	{/each}
</div>

<style>
	@media print {
		.qrPrintDiv {
			break-inside: avoid-page;
		}
		@page {
			size: landscape;
		}
	}
</style>
