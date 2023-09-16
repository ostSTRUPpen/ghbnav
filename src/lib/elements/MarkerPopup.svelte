<script lang="ts">
	import { goto } from '$app/navigation';
	import { foundpath } from '$lib/data/store';
	import { redirect } from '@sveltejs/kit';

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
			//FIX?ME Určitě musí existovat lepší způsob
			foundpath.update((n) => (n = ['']));
			goto('/loading').then(() => goto(`/map/${id}`));
		} else if (buttonType === 'no_to') {
			goto('/loading').then(() => goto(`/map/${fromNodeId}/${id}`));
		} else if (buttonType === 'ready') {
			goto('/loading').then(() => {
				goto(`/map/${fromNodeId}/${id}`);
			});
		} else if (canNav === false) {
		} else {
			goto('/loading');
		}
	}
</script>

<div>
	<!---->
	<p class="marker-paragraph">{text + ' (' + id + ')'}</p>
	{#if canNav}
		<button class="navigate-button" on:click={navTo}>{buttonText}</button>
	{/if}
</div>

<style>
	button {
		text-decoration: underline;
		color: blue;
	}
</style>
