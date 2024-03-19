<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { foundPath } from '$lib/data/store';

	export let text: string;
	export let id: string;
	export let buttonType: string;
	export let fromNodeId: string;
	export let canNav: boolean;
    export let markerIcon: string;
    export let moveToFloor: number;

	let buttonText = '';
    let bonusText: string = "";
    const floors = ['1. PP','1. NP','2. NP','3. NP','4. NP']

	if (buttonType === 'no_from-to') {
		buttonText = 'Zde stojím';
	} else if (buttonType === 'no_to') {
		buttonText = 'Navigovat';
	} else if (buttonType === 'ready' && markerIcon !== "schodiste") {
		buttonText = 'Změnit cíl navigace';
	} else if (buttonType === 'ready' && markerIcon === "schodiste") {
        if(moveToFloor !== -5) {
            bonusText = `Přesuňte se do ${floors[moveToFloor]}.`
        }
        //TODO přidat automatickou změnu patra
		buttonText = 'Změnit cíl navigace';
	} else if (canNav === false) {
		buttonText = 'Nelze navigovat';
	} else {
		buttonText = 'Došlo k chybě';
	}
	function navTo() {
		if (buttonType === 'no_from-to') {
			foundPath.update((n) => (n = ['']));
			goto(`${base}/loading`).then(() => goto(`${base}/map/${id}`, { replaceState: true }));
		} else if (buttonType === 'no_to') {
			goto(`${base}/loading`).then(() => goto(`${base}/map/${fromNodeId}/${id}`, { replaceState: true }));
		} else if (buttonType === 'ready') {
			goto(`${base}/loading`).then(() => {
				goto(`${base}/map/${fromNodeId}/${id}`, { replaceState: true });
			});
		} else if (canNav === false) {
		} else {
			goto(`${base}/loading`);
		}
	}
</script>

<div>
	<p class="text-lg text-center">{text}</p>
    {#if bonusText !== ""}
        <p class="text-md text-center">{bonusText}</p>
	{/if}
	{#if canNav}
		<button class="btn btn-secondary" on:click={navTo}>{buttonText}</button>
	{/if}
</div>
