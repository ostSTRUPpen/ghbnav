<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import {
		floor_0,
		floor_1,
		floor_2,
		floor_3,
		floor_4,
		getMarkerIcons
	} from '$lib/data/markerIcons.js';
	import MarkerPopup from '$lib/elements/MarkerPopup.svelte';
	import PathSelection from '$lib/elements/PathSelection.svelte';
	import Loading from '$lib/elements/Loading.svelte';
	import { savePath } from '$lib/functions/dynamicPathManagementFunctions.js';
	import { dijkstra } from '$lib/functions/findPath.js';
	import type {
		LocationMarker,
		MapPageData,
		NavigationMarker,
		NavigationState
	} from '$lib/types/navigation';
	import type {
		LatLngExpression,
		LatLngBoundsExpression,
		LayerGroup,
		Map as LeafletMap,
		Marker as LeafletMarker
	} from 'leaflet';
	import { mount, onDestroy, onMount, unmount } from 'svelte';

	interface Props {
		data: MapPageData;
	}

	interface FloorDefinition {
		name: string;
		imageUrl: string;
		bounds: LatLngBoundsExpression;
	}

	type PathSegment = LatLngExpression[];
	type MountedPopup = ReturnType<typeof mount>;

	let { data }: Props = $props();
	let { markers, nav_markers, iconImageDisplayNames, iconIdImage } = $derived(data);

	let mapElement: HTMLDivElement;
	let leafletMap: LeafletMap | undefined;
	let leafletApi: typeof import('leaflet') | undefined;
	let floorLayers: LayerGroup[] = [];
	let pathLayers: LayerGroup[] = [];
	let loading = $state(true);
	let mapReady = $state(false);
	let errorMessage = $state('');
	let lastRecordedPath = '';

	const mountedPopups = new Set<MountedPopup>();
	let markerById = $derived.by(
		() => new Map<string, LocationMarker>(markers.map((marker) => [marker.id, marker]))
	);
	let navigationMarkerById = $derived.by(
		() =>
			new Map<string, NavigationMarker>(nav_markers.map((marker) => [String(marker.id), marker]))
	);

	const floorDefinitions: FloorDefinition[] = [
		{
			name: '1. PP',
			imageUrl: floor_0,
			bounds: [
				[0, 0],
				[2651, 10000]
			]
		},
		{
			name: '1. NP',
			imageUrl: floor_1,
			bounds: [
				[0, 0],
				[3870, 10083]
			]
		},
		{
			name: '2. NP',
			imageUrl: floor_2,
			bounds: [
				[0, 0],
				[3815, 8995]
			]
		},
		{
			name: '3. NP',
			imageUrl: floor_3,
			bounds: [
				[0, 0],
				[2605, 8868]
			]
		},
		{
			name: '4. NP',
			imageUrl: floor_4,
			bounds: [
				[0, 0],
				[1915, 8868]
			]
		}
	];

	const pathStyle = {
		color: 'rgb(47, 60, 76)',
		text: '        ►        ',
		textColor: 'rgb(253, 133, 73)',
		textSize: '25px',
		textOffset: 8
	};

	let from = $derived(page.params.from);
	let to = $derived(page.params.to);
	let navigationState = $derived(getNavigationState(from, to));
	let endingFloor = $derived(
		navigationState === 'ready' && to ? markerById.get(to)?.floor : undefined
	);

	$effect(() => {
		const routeFrom = from;
		const routeTo = to;
		if (mapReady) updateNavigation(routeFrom, routeTo);
	});

	onMount(async () => {
		const L = await import('leaflet');
		await import('leaflet-textpath');
		leafletApi = L;

		const markerIcons = getMarkerIcons(L, iconIdImage);
		floorLayers = floorDefinitions.map((floor, floorIndex) => {
			const imageLayer = L.imageOverlay(floor.imageUrl, floor.bounds);
			const markerLayer = L.layerGroup(createFloorMarkers(L, floorIndex, markerIcons));
			const pathLayer = L.layerGroup();
			pathLayers[floorIndex] = pathLayer;
			return L.layerGroup([imageLayer, markerLayer, pathLayer]);
		});

		const initialFloor = getValidMarker(from)?.floor ?? 1;
		leafletMap = L.map(mapElement, {
			crs: L.CRS.Simple,
			minZoom: -4,
			maxZoom: 0,
			layers: [floorLayers[initialFloor] ?? floorLayers[1]],
			maxBounds: L.latLngBounds(L.latLng(-1000, 11000), L.latLng(5000, -1000)),
			maxBoundsViscosity: 1
		});

		leafletMap.fitBounds([
			[0, 0],
			[3000, 10000]
		]);

		const namedFloors = Object.fromEntries(
			floorDefinitions.map((floor, index) => [floor.name, floorLayers[index]])
		);
		L.control.layers(namedFloors).addTo(leafletMap);

		loading = false;
		mapReady = true;
		leafletMap.invalidateSize();
	});

	onDestroy(() => {
		leafletMap?.remove();
		leafletMap = undefined;
		for (const popup of mountedPopups) void unmount(popup);
		mountedPopups.clear();
	});

	function getValidMarker(id: string | undefined): LocationMarker | undefined {
		if (!id) return undefined;
		const marker = markerById.get(id);
		return marker?.can_nav ? marker : undefined;
	}

	function getNavigationState(
		startId: string | undefined,
		endId: string | undefined
	): NavigationState {
		if (!getValidMarker(startId)) return 'empty';
		if (!getValidMarker(endId)) return 'start-selected';
		return 'ready';
	}

	function createFloorMarkers(
		L: typeof import('leaflet'),
		floor: number,
		icons: Record<string, import('leaflet').Icon>
	): LeafletMarker[] {
		return markers
			.filter((marker) => marker.floor === floor)
			.map((marker) => {
				const leafletMarker = L.marker([marker.y, marker.x], {
					...(icons[marker.icon] ? { icon: icons[marker.icon] } : {})
				});
				let popupComponent: MountedPopup | undefined;

				leafletMarker.bindPopup(() => {
					if (popupComponent) {
						mountedPopups.delete(popupComponent);
						void unmount(popupComponent);
					}

					const container = L.DomUtil.create('div');
					popupComponent = mount(MarkerPopup, {
						target: container,
						props: {
							text: marker.display_name,
							canNav: marker.can_nav,
							markerIcon: marker.icon,
							navigationState,
							endingFloor,
							currentFloor: floor,
							onNavigate: () => selectMarker(marker.id),
							onChangeFloor: changeFloor
						}
					});
					mountedPopups.add(popupComponent);
					return container;
				});

				leafletMarker.on('popupclose', () => {
					if (!popupComponent) return;
					mountedPopups.delete(popupComponent);
					void unmount(popupComponent);
					popupComponent = undefined;
				});

				return leafletMarker;
			});
	}

	function updateNavigation(startId: string | undefined, endId: string | undefined): void {
		clearPathLayers();
		errorMessage = '';

		if (!startId) {
			lastRecordedPath = '';
			return;
		}

		const startMarker = getValidMarker(startId);
		if (!startMarker) {
			errorMessage = 'Počáteční bod zadaný v adrese neexistuje nebo jej nelze použít.';
			return;
		}

		changeFloor(startMarker.floor);
		if (!endId) {
			lastRecordedPath = '';
			return;
		}

		const endMarker = getValidMarker(endId);
		if (!endMarker) {
			errorMessage = 'Cílový bod zadaný v adrese neexistuje nebo jej nelze použít.';
			return;
		}

		if (startId === endId) {
			alert('Začátek a konec cesty nemůže být stejný');
			navigateToMap(startId);
			return;
		}

		const result = dijkstra(nav_markers, startId, endId, startMarker.floor);
		if (result.status !== 'OK') {
			errorMessage = 'Mezi vybranými body se nepodařilo najít cestu.';
			return;
		}

		drawPath(result.path);
		const pathKey = `${startId}/${endId}`;
		if (lastRecordedPath !== pathKey) {
			lastRecordedPath = pathKey;
			void savePath(startId, endId, result.path).catch((error: unknown) => {
				console.error('Cestu se nepodařilo uložit.', error);
			});
		}
	}

	function drawPath(path: string[]): void {
		if (!leafletApi) return;

		for (let floor = 0; floor < floorDefinitions.length; floor += 1) {
			const segments = getFloorSegments(path, floor);
			if (segments.length === 0) continue;

			const polyline = leafletApi.polyline(segments, { color: pathStyle.color });
			polyline.setText(pathStyle.text, {
				repeat: true,
				offset: pathStyle.textOffset,
				attributes: { fill: pathStyle.textColor, 'font-size': pathStyle.textSize }
			});
			pathLayers[floor]?.addLayer(polyline);
		}
	}

	function getFloorSegments(path: string[], floor: number): PathSegment[] {
		const segments: PathSegment[] = [];
		let currentSegment: PathSegment = [];
		let passedStairSplit = false;

		for (const pathPoint of path) {
			const locationMarker = markerById.get(pathPoint);
			if (locationMarker?.floor === floor) {
				currentSegment.push([locationMarker.y, locationMarker.x]);
				continue;
			}

			const navigationMarker = navigationMarkerById.get(pathPoint);
			if (navigationMarker?.floor !== floor) continue;

			currentSegment.push([navigationMarker.y, navigationMarker.x]);
			if (
				passedStairSplit &&
				(navigationMarker.special_type === 'stair_up' ||
					navigationMarker.special_type === 'stair_down')
			) {
				if (currentSegment.length > 0) segments.push(currentSegment);
				currentSegment = [];
			}
			passedStairSplit = navigationMarker.special_type === 'stair_split';
		}

		if (currentSegment.length > 0) segments.push(currentSegment);
		return segments;
	}

	function clearPathLayers(): void {
		for (const layer of pathLayers) layer?.clearLayers();
	}

	function changeFloor(floor: number): void {
		if (!leafletMap || !floorLayers[floor]) return;
		for (const layer of floorLayers) {
			if (leafletMap.hasLayer(layer)) leafletMap.removeLayer(layer);
		}
		floorLayers[floor].addTo(leafletMap);
	}

	function selectMarker(markerId: string): void {
		const startMarker = getValidMarker(from);
		if (!startMarker) {
			navigateToMap(markerId);
			return;
		}

		if (startMarker.id === markerId) {
			alert('Začátek a konec cesty nemůže být stejný');
			navigateToMap(startMarker.id);
			return;
		}

		navigateToMap(startMarker.id, markerId);
	}

	function navigateToMap(startId?: string, endId?: string): void {
		if (startId && endId) {
			void goto(resolve('/map/[[from]]/[[to]]', { from: startId, to: endId }), {
				replaceState: true,
				noScroll: true,
				keepFocus: true
			});
			return;
		}

		if (startId) {
			void goto(resolve('/map/[[from]]/[[to]]', { from: startId }), {
				replaceState: true,
				noScroll: true,
				keepFocus: true
			});
			return;
		}

		void goto(resolve('/map'), { replaceState: true, noScroll: true, keepFocus: true });
	}

	function resizeMap(): void {
		leafletMap?.invalidateSize();
	}
</script>

<svelte:window onresize={resizeMap} />

<main>
	<div>
		<div class="max-lg:flex max-lg:justify-center lg:px-5 pb-2">
			<PathSelection
				locations={markers}
				navFrom={from}
				navTo={to}
				showClearNavButton={true}
				{iconImageDisplayNames}
				onNavigate={(startId, endId) => navigateToMap(startId, endId)}
				onClear={() => navigateToMap()}
			/>
		</div>
		{#if loading}
			<Loading />
		{/if}
		{#if errorMessage}
			<p class="text-error text-center pb-2" role="alert">{errorMessage}</p>
		{/if}
		<div id="map" class="max-sm:h-96 sm:h-[30rem] z-0" bind:this={mapElement}></div>
	</div>
</main>
