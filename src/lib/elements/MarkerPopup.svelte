<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { foundPath } from '$lib/data/store';
	import type { LayerGroup, Map } from 'leaflet';

	export let text: string;
	export let id: string;
	export let buttonType: string;
	export let fromNodeId: string;
	export let canNav: boolean;
	export let markerIcon: string;
	export let moveToFloor: number;
	export let map: Map;
	export let floors: Record<string, LayerGroup>;

	let buttonText = '';
	let bonusText: string = '';
	const floorNames = ['1. PP', '1. NP', '2. NP', '3. NP', '4. NP'];

	if (buttonType === 'no_from-to') {
		buttonText = 'Zde stojím';
	} else if (buttonType === 'no_to') {
		buttonText = 'Navigovat';
	} else if (buttonType === 'ready' && markerIcon !== 'schody') {
		buttonText = 'Změnit cíl navigace';
	} else if (buttonType === 'ready' && markerIcon === 'schody') {
		if (moveToFloor !== -5) {
			bonusText = `Přesuňte se do ${floorNames[moveToFloor]}.`;
			buttonText = `Změnit patro na ${floorNames[moveToFloor]}`;
		}
	} else if (canNav === false) {
		buttonText = 'Nelze navigovat';
	} else {
		buttonText = 'Došlo k chybě';
	}

	function changeLayer(newLayer: number) {
		map.eachLayer((layer) => {
			map.removeLayer(layer);
		});
		Object.values(floors)[newLayer].addTo(map);
	}

	function navTo() {
		if (buttonType === 'ready' && markerIcon === 'schody' && moveToFloor !== -5) {
			changeLayer(moveToFloor);
		} else {
			if (buttonType === 'no_from-to') {
				foundPath.update((n) => (n = ['']));
				goto(`${base}/loading`).then(() => goto(`${base}/map/${id}`, { replaceState: true }));
			} else if (buttonType === 'no_to') {
				goto(`${base}/loading`).then(() =>
					goto(`${base}/map/${fromNodeId}/${id}`, { replaceState: true })
				);
			} else if (buttonType === 'ready') {
				goto(`${base}/loading`).then(() => {
					goto(`${base}/map/${fromNodeId}/${id}`, { replaceState: true });
				});
			} else if (canNav === false) {
			} else {
				goto(`${base}/loading`);
			}
		}
	}
</script>

<div>
	<p class="text-lg font-bold text-center">{text}</p>
	{#if bonusText !== ''}
		<p class="text-lg text-center">{bonusText}</p>
	{/if}
	{#if canNav}
		<button class="btn btn-secondary w-full max-w-xs" on:click={navTo}>{buttonText}</button>
	{/if}
</div>
