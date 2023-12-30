<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { foundPath } from '$lib/data/store';

	export let text: string;
	export let id: string;
	export let buttonType: string;
	export let fromNodeId: string;
	export let canNav: boolean;

	let buttonText = '';
	if (buttonType === 'no_from-to') {
		buttonText = 'Zde stojím';
	} else if (buttonType === 'no_to') {
		buttonText = 'Navigovat';
	} else if (buttonType === 'ready') {
		buttonText = 'Změnit cíl navigace';
	} else if (canNav === false) {
		buttonText = 'Nelze navigovat';
	} else {
		buttonText = 'Došlo k chybě';
	}
	function navTo() {
		if (buttonType === 'no_from-to') {
			foundPath.update((n) => (n = ['']));
			goto(`${base}/loading`).then(() => goto(`${base}/map/${id}`));
		} else if (buttonType === 'no_to') {
			goto(`${base}/loading`).then(() => goto(`${base}/map/${fromNodeId}/${id}`));
		} else if (buttonType === 'ready') {
			goto(`${base}/loading`).then(() => {
				goto(`${base}/map/${fromNodeId}/${id}`);
			});
		} else if (canNav === false) {
		} else {
			goto(`${base}/loading`);
		}
	}
</script>

<div>
	<p class="text-lg text-center">{text}</p>
	{#if canNav}
		<button class="btn btn-secondary" on:click={navTo}>{buttonText}</button>
	{/if}
</div>
