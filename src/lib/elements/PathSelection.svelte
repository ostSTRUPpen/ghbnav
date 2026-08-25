<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { buildingLocationsList } from '$lib/data/staticData';
	import { printMarkersList, printSettingsString } from '$lib/data/store.js';
	import type { IconDisplayNames, Location, LocationSelectOption } from '$lib/types/navigation';
	import Select from 'svelte-select';

	interface Props {
		locations: Location[];
		navFrom?: string;
		navTo?: string;
		showClearNavButton?: boolean;
		iconImageDisplayNames: IconDisplayNames;
		printQR?: boolean;
		onNavigate?: (from: string, to: string) => void;
		onClear?: () => void;
	}

	let {
		locations,
		navFrom,
		navTo,
		showClearNavButton = false,
		iconImageDisplayNames,
		printQR = false,
		onNavigate,
		onClear
	}: Props = $props();

	let selectedFrom = $state<LocationSelectOption | null>(null);
	let selectedTo = $state<LocationSelectOption | null>(null);

	let preparedLocations = $derived.by((): LocationSelectOption[] => {
		return locations
			.filter((location) => location.can_nav)
			.map((location) => {
				const buildingName =
					buildingLocationsList.find(
						(buildingLocation) => buildingLocation.name === location.building_location
					)?.displayName ?? 'Neznámé umístění';

				return {
					value: location.id,
					label: `${location.display_name} (Patro: ${location.floor}, ${buildingName})`,
					group: iconImageDisplayNames[location.icon] ?? 'Ostatní',
					selectable: true
				};
			});
	});

	let isDisabled = $derived(
		!selectedFrom || !selectedTo || selectedFrom.value === selectedTo.value
	);
	const groupLocations = (location: Record<string, unknown>): string | undefined =>
		typeof location.group === 'string' ? location.group : undefined;

	$effect(() => {
		selectedFrom = navFrom
			? (preparedLocations.find((location) => location.value === navFrom) ?? null)
			: null;
	});

	$effect(() => {
		selectedTo = navTo
			? (preparedLocations.find((location) => location.value === navTo) ?? null)
			: null;
	});

	function navigate(): void {
		if (!selectedFrom || !selectedTo || selectedFrom.value === selectedTo.value) return;

		if (printQR) {
			const startName = locations.find(
				(location) => location.id === selectedFrom?.value
			)?.display_name;
			const endName = locations.find((location) => location.id === selectedTo?.value)?.display_name;

			printMarkersList.set([
				[
					`${selectedFrom.value}/${selectedTo.value}`,
					`${startName ?? selectedFrom.label} → ${endName ?? selectedTo.label}`,
					''
				]
			]);
			printSettingsString.set('path');
			void goto(resolve('/sec/markers/print'), { replaceState: true });
			return;
		}

		if (onNavigate) {
			onNavigate(selectedFrom.value, selectedTo.value);
			return;
		}

		void goto(
			resolve('/map/[[from]]/[[to]]', {
				from: selectedFrom.value,
				to: selectedTo.value
			}),
			{ replaceState: true }
		);
	}

	function clearNavigation(): void {
		if (onClear) {
			onClear();
			return;
		}

		void goto(resolve('/map'), { replaceState: true });
	}
</script>

<div class="space-y-2 max-sm:min-w-80 sm:min-w-96 styled_select">
	<h2 class="text-xl">Navigace</h2>
	<label for="from" class="label">
		<span class="label-text">Odkud: </span>
	</label>
	<Select
		items={preparedLocations}
		placeholder="Prosím vyberte začátek cesty"
		id="from"
		name="from"
		bind:value={selectedFrom}
		groupBy={groupLocations}
		class="w-full max-w-md"
		clearable={false}
	/>
	<label for="to" class="label">
		<span class="label-text">Kam: </span>
	</label>
	<Select
		items={preparedLocations}
		placeholder="Prosím vyberte konec cesty"
		id="to"
		name="to"
		bind:value={selectedTo}
		groupBy={groupLocations}
		class="w-full max-w-md"
		clearable={false}
	/>
	<div class="navigation-actions flex flex-wrap items-center gap-2 pt-2">
		<button onclick={navigate} disabled={isDisabled} class="btn btn-secondary">
			{printQR ? 'Vytisknout QR kód' : 'Navigovat'}
		</button>
		{#if showClearNavButton}
			<button onclick={clearNavigation} class="btn btn-secondary">Vymazat navigaci</button>
		{/if}
	</div>
</div>

<style>
	.styled_select {
		--item-color: var(--color-base-content);
		--selected-item-color: var(--color-base-content);
		--item-hover-color: var(--color-base-content);
		--item-hover-bg: var(--color-base-200);
		--item-active-background: var(--color-base-300);
		--item-is-active-bg: var(--color-secondary);
		--item-is-active-color: var(--color-secondary-content);
		--item-placeholder-color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
		--item-is-not-selectable-color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
		--group-title-color: color-mix(in oklab, var(--color-base-content) 70%, transparent);
		--input-color: var(--color-base-content);
		--placeholder-color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
		--icons-color: var(--color-base-content);
		--background: var(--color-base-100);
		--list-background: var(--color-base-100);
		--border: 1px solid color-mix(in oklab, var(--color-base-content) 20%, transparent);
		--border-hover: 1px solid var(--color-base-content);
		--border-focused: 1px solid var(--color-base-content);
		--list-z-index: 50;
	}
</style>
