<script lang="ts">
	import type { NavigationState } from '$lib/types/navigation';

	interface Props {
		text: string;
		canNav: boolean;
		markerIcon: string;
		navigationState: NavigationState;
		endingFloor?: number;
		currentFloor: number;
		onNavigate: () => void;
		onChangeFloor: (floor: number) => void;
	}

	interface PopupAction {
		buttonText: string;
		bonusText: string;
		floorToMoveTo?: number;
	}

	let {
		text,
		canNav,
		markerIcon,
		navigationState,
		endingFloor,
		currentFloor,
		onNavigate,
		onChangeFloor
	}: Props = $props();

	const floorNames = ['1. PP', '1. NP', '2. NP', '3. NP', '4. NP'];

	let action = $derived.by((): PopupAction => {
		if (!canNav) return { buttonText: 'Nelze navigovat', bonusText: '' };
		if (navigationState === 'empty') return { buttonText: 'Zde stojím', bonusText: '' };
		if (navigationState === 'start-selected') {
			return { buttonText: 'Navigovat', bonusText: '' };
		}

		if (markerIcon !== 'schody' || endingFloor === undefined) {
			return { buttonText: 'Změnit cíl navigace', bonusText: '' };
		}

		if (endingFloor > currentFloor && currentFloor < floorNames.length - 1) {
			const floorToMoveTo = currentFloor + 1;
			return {
				buttonText: `Změnit patro na ${floorNames[floorToMoveTo]}`,
				bonusText: `Přesuňte se do ${floorNames[floorToMoveTo]}.`,
				floorToMoveTo
			};
		}

		if (endingFloor < currentFloor && currentFloor > 0) {
			const floorToMoveTo = currentFloor - 1;
			return {
				buttonText: `Změnit patro na ${floorNames[floorToMoveTo]}`,
				bonusText: `Přesuňte se do ${floorNames[floorToMoveTo]}.`,
				floorToMoveTo
			};
		}

		if (currentFloor === 0 || currentFloor === floorNames.length - 1) {
			const floorToMoveTo = currentFloor === 0 ? 1 : currentFloor - 1;
			return {
				buttonText: `Změnit patro na ${floorNames[floorToMoveTo]}`,
				bonusText: 'Změna patra nemusí být nutná. Prosím následujte pokyny v mapě.',
				floorToMoveTo
			};
		}

		return { buttonText: 'Změnit cíl navigace', bonusText: '' };
	});

	function runAction(): void {
		if (action.floorToMoveTo !== undefined) {
			onChangeFloor(action.floorToMoveTo);
			return;
		}

		onNavigate();
	}
</script>

<div>
	<p class="text-lg font-bold text-center">{text}</p>
	{#if action.bonusText}
		<p class="text-lg text-center">{action.bonusText}</p>
	{/if}
	{#if canNav}
		<button class="btn btn-secondary w-full max-w-xs" onclick={runAction}>
			{action.buttonText}
		</button>
	{/if}
</div>
