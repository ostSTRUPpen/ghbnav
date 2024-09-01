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
	export let endingFloor: number;
	export let map: Map;
	export let floors: Record<string, LayerGroup>;
	export let currentFloor: number;

	let floorToMoveTo: number;
	let shouldChangeFloors: boolean = false;
	let buttonText = '';
	let bonusText: string = '';
	const floorNames = ['1. PP', '1. NP', '2. NP', '3. NP', '4. NP'];

	if (buttonType === 'no_from-to') {
		buttonText = 'Zde stojím';
		shouldChangeFloors = false;
	} else if (buttonType === 'no_to') {
		buttonText = 'Navigovat';
		shouldChangeFloors = false;
	} else if (buttonType === 'ready' && markerIcon !== 'schody') {
		buttonText = 'Změnit cíl navigace';
		shouldChangeFloors = false;
	} else if (buttonType === 'ready' && markerIcon === 'schody' && endingFloor !== -5) {
		if (endingFloor > currentFloor && currentFloor < 4) {
			floorToMoveTo = currentFloor + 1;
			shouldChangeFloors = true;
			bonusText = `Přesuňte se do ${floorNames[floorToMoveTo]}.`;
			buttonText = `Změnit patro na ${floorNames[floorToMoveTo]}`;
		} else if (endingFloor < currentFloor && currentFloor > 0) {
			floorToMoveTo = currentFloor - 1;
			shouldChangeFloors = true;
			bonusText = `Přesuňte se do ${floorNames[floorToMoveTo]}.`;
			buttonText = `Změnit patro na ${floorNames[floorToMoveTo]}`;
		} else {
			if (currentFloor === 0) {
				floorToMoveTo = 1;
				shouldChangeFloors = true;
				bonusText = `Změna patra nemusí být nutná. Prosím následujte pokyny v mapě.`;
				buttonText = `Změnit patro na ${floorNames[1]}`;
			} else if (currentFloor === 4) {
				floorToMoveTo = 3;
				shouldChangeFloors = true;
				//`Jste na správném patře, ale ${floorNames[4]} není plně průchozí. Možná bude nutné přejít na patro ${floorNames[3]}, prosím následujte pokyny v mapě..`
				bonusText = `Změna patra nemusí být nutná. Prosím následujte pokyny v mapě.`;
				buttonText = `Změnit patro na ${floorNames[3]}`;
			} else {
				buttonText = 'Změnit cíl navigace';
				shouldChangeFloors = false;
			}
		}
	} else if (canNav === false) {
		buttonText = 'Nelze navigovat';
		shouldChangeFloors = false;
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
		if (
			buttonType === 'ready' &&
			markerIcon === 'schody' &&
			endingFloor !== -5 &&
			shouldChangeFloors
		) {
			changeLayer(floorToMoveTo);
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
