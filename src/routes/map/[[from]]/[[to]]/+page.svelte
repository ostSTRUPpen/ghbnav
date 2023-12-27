<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import MarkerPopup from '$lib/elements/MarkerPopup.svelte';
	import { page } from '$app/stores';
	import {
		floor_0,
		floor_1,
		floor_2,
		floor_3,
		floor_4,
		getMarkerIcons
	} from '$lib/data/markerIcons.js';
	import { goto } from '$app/navigation';
	import { dijkstra } from '$lib/functions/findPath.js';
	import { foundPath } from '$lib/data/store.js';
	import { savePath } from '$lib/functions/dynamicPathManagementFunctions.js';
	import { base } from '$app/paths';
	import PathSelection from '$lib/elements/PathSelection.svelte';
	export let data;

	let { markers, nav_markers, iconImageDisplayNames, iconIdImage } = data;
	$: ({ markers, nav_markers, iconImageDisplayNames, iconIdImage } = data);

	let from: string = '',
		to: string = '',
		fromMarkerFloor: number = 1;

	from = $page.params.from;
	to = $page.params.to;

	let currentFoundPath = [''];
	foundPath.subscribe((value) => {
		currentFoundPath = value;
	});

	let state = 'no_from-to';
	if (from !== undefined && to !== undefined && from.length > 5 && to.length > 5) {
		state = 'ready';
	} else if (from !== undefined && from.length > 5) {
		state = 'no_to';
	}
	$: {
		if (from !== undefined && to !== undefined) {
			state = 'ready';
		} else if (from !== undefined) {
			state = 'no_to';
		}
	}

	let error = false;
	let errMsg: string = '';

	let map: any;
	let popup: any;

	function createMarkers(
		L: any,
		markers: any,
		floor: number,
		iconList: any,
		mainButtonType: string,
		fromNodeId: string
	) {
		let tempButtonType = mainButtonType;
		let markerList = [];
		for (let marker of markers) {
			tempButtonType = mainButtonType;
			if (marker.floor === floor) {
				// If this if statement fails, the whole page fails to load - so I double check it
				if (marker.icon !== '' && marker.icon in iconList) {
					if (marker.can_nav === false) {
						tempButtonType = 'do_not_nav';
					}

					markerList.push(
						// All cords are YX... its not my fault
						L.marker([marker.y, marker.x], { icon: iconList[marker.icon] })
							.bindPopup(() => {
								let container = L.DomUtil.create('div');
								let c = new MarkerPopup({
									target: container,
									props: {
										text: `${marker.display_name}`,
										id: marker.id,
										buttonType: tempButtonType,
										fromNodeId,
										canNav: marker.can_nav
									}
								});
								return container;
							})
							.openPopup()
					);
				} else {
					if (marker.can_nav === false) {
						tempButtonType = 'do_not_nav';
					}
					markerList.push(
						// All cords are YX... its not my fault
						L.marker([marker.y, marker.x])
							.bindPopup(() => {
								let container = L.DomUtil.create('div');
								let c = new MarkerPopup({
									target: container,
									props: {
										text: marker.display_name,
										id: marker.id,
										buttonType: tempButtonType,
										fromNodeId,
										canNav: marker.can_nav
									}
								});
								return container;
							})
							.openPopup()
					);
				}
			}
		}
		return markerList;
	}

	/*function createNavMarkers(markers: any, navMarkers: any, floor: number) {
		markers = markers.reverse();
		navMarkers = navMarkers.reverse();
		let lineList = [];
		for (let navMarker of navMarkers) {
			if (navMarker.floor === floor) {
				for (let marker of markers) {
					if (marker.floor === floor) {
						if (navMarker.connected.hasOwnProperty(marker.id)) {
							lineList.push([
								[navMarker.y, navMarker.x],
								[marker.y, marker.x]
							]);
						}
					}
				}
				for (let secNavMarker of navMarkers) {
					if (secNavMarker.floor === floor) {
						if (navMarker.connected.hasOwnProperty(secNavMarker.id)) {
							lineList.push([
								[navMarker.y, navMarker.x],
								[secNavMarker.y, secNavMarker.x]
							]);
						}
					}
				}
			}
		}
		return lineList;
	}*/
	function drawPath(path: any, markers: any, navMarkers: any, floor: number) {
		let lineList: Array<Array<Array<string>>> = [];
		let floorLineList: Array<Array<string>> = [];
		let passedStairSplit: boolean = false;
		for (let pathPoint of path) {
			for (let marker of markers) {
				if (marker.id === pathPoint) {
					if (marker.floor === floor) floorLineList.push([marker.y, marker.x]);
				}
			}

			for (let navMarker of navMarkers) {
				if (String(navMarker.id) === pathPoint) {
					if (navMarker.floor === floor) {
						floorLineList.push([navMarker.y, navMarker.x]);
						if (
							(navMarker.special_type === 'stair_up' && passedStairSplit === true) ||
							(navMarker.special_type === 'stair_down' && passedStairSplit === true)
						) {
							lineList.push(floorLineList);
							floorLineList = [];
						}
						if (navMarker.special_type === 'stair_split') {
							passedStairSplit = true;
						} else {
							passedStairSplit = false;
						}
					}
				}
			}
		}
		lineList.push(floorLineList);

		return {
			pathList: lineList
		};
	}

	//Path display settings
	const pathColor = 'rgb(47, 60, 76)';
	const pathText = '        ►        ';
	const pathTextColor = 'rgb(253, 133, 73)';
	const pathTextSize = '25px';
	const pathTextOffset = 8;

	onMount(async () => {
		if (browser) {
			const L = await import('leaflet');
			const textPath = await import('leaflet-textpath');
			const markerIcons = getMarkerIcons(L, iconIdImage);
			fromMarkerFloor = markers.find((obj) => obj.id === from)?.floor ?? 1;

			const zeroFloorImg = L.imageOverlay(floor_0, [
				[0, 0],
				[2651, 10000]
			]);
			const firstFloorImg = L.imageOverlay(floor_1, [
				[0, 0],
				[3870, 10083]
			]);
			const secondFloorImg = L.imageOverlay(floor_2, [
				[0, 0],
				[3815, 8995]
			]);
			const thirdFloorImg = L.imageOverlay(floor_3, [
				[0, 0],
				[2605, 8868]
			]);
			const fourthFloorImg = L.imageOverlay(floor_4, [
				[0, 0],
				[1915, 8868]
			]);

			popup = L.popup();

			let markerList: any = [];
			let pathList: any = [];
			let canDrawPath: boolean = false;

			if (currentFoundPath[0] === from && currentFoundPath[currentFoundPath.length - 1] === to) {
				canDrawPath = true;
			}

			markerList = createMarkers(L, markers, 0, markerIcons, state, from);

			if (canDrawPath === true)
				({ pathList } = drawPath(currentFoundPath, markers, nav_markers, 0));
			let zeroFloor = L.layerGroup([
				// Map
				zeroFloorImg,
				// Markers
				...markerList,
				// Path
				//@ts-expect-error
				L.polyline(pathList, { color: pathColor }).setText(pathText, {
					repeat: true,
					offset: pathTextOffset,
					attributes: { fill: pathTextColor, 'font-size': pathTextSize }
				})
			]);

			markerList = createMarkers(L, markers, 1, markerIcons, state, from);
			if (canDrawPath === true)
				({ pathList } = drawPath(currentFoundPath, markers, nav_markers, 1));
			let firstFloor = L.layerGroup([
				firstFloorImg,
				...markerList,
				//@ts-expect-error
				L.polyline(pathList, { color: pathColor }).setText(pathText, {
					repeat: true,
					offset: pathTextOffset,
					attributes: { fill: pathTextColor, 'font-size': pathTextSize }
				})
			]);

			markerList = createMarkers(L, markers, 2, markerIcons, state, from);
			if (canDrawPath === true)
				({ pathList } = drawPath(currentFoundPath, markers, nav_markers, 2));
			let secondFloor = L.layerGroup([
				secondFloorImg,
				...markerList,
				//@ts-expect-error
				L.polyline(pathList, { color: pathColor }).setText(pathText, {
					repeat: true,
					offset: pathTextOffset,
					attributes: { fill: pathTextColor, 'font-size': pathTextSize }
				})
			]);

			markerList = createMarkers(L, markers, 3, markerIcons, state, from);
			if (canDrawPath === true)
				({ pathList } = drawPath(currentFoundPath, markers, nav_markers, 3));
			let thirdFloor = L.layerGroup([
				thirdFloorImg,
				...markerList,
				//@ts-expect-error
				L.polyline(pathList, { color: pathColor }).setText(pathText, {
					repeat: true,
					offset: pathTextOffset,
					attributes: { fill: pathTextColor, 'font-size': pathTextSize }
				})
			]);

			markerList = createMarkers(L, markers, 4, markerIcons, state, from);
			if (canDrawPath === true)
				({ pathList } = drawPath(currentFoundPath, markers, nav_markers, 4));
			let fourthFloor = L.layerGroup([
				fourthFloorImg,
				...markerList,
				//@ts-expect-error
				L.polyline(pathList, { color: pathColor }).setText(pathText, {
					repeat: true,
					offset: pathTextOffset,
					attributes: { fill: pathTextColor, 'font-size': pathTextSize }
				})
			]);
			markerList = [];
			pathList = [];
			let floors = {
				'1. PP': zeroFloor,
				'1. NP': firstFloor,
				'2. NP': secondFloor,
				'3. NP': thirdFloor,
				'4. NP': fourthFloor
			};
			map = L.map('map', {
				crs: L.CRS.Simple, // CRS.Simple, which represents a square grid:
				minZoom: -4,
				maxZoom: 0,
				layers: [Object.values(floors)[fromMarkerFloor]],
				maxBounds: L.latLngBounds(L.latLng(-1000, 11000), L.latLng(5000, -1000)),
				maxBoundsViscosity: 1.0
			});
			map.fitBounds([
				[0, 0],
				[3000, 10000]
			]);

			L.control.layers(floors).addTo(map);

			if (state === 'ready') {
				if (from === to && from !== undefined) {
					alert('Začátek a konec cesty nemůže být stejný');
					goto(`${base}/loading`).then(() => goto(`${base}/map/${from}`));
				} else if (
					currentFoundPath[0] !== from ||
					currentFoundPath[currentFoundPath.length - 1] !== to
				) {
					foundPath.update((n) => (n = ['']));
					const response = dijkstra(
						nav_markers,
						from,
						to,
						markers.find((obj) => obj.id === from)?.floor
					);
					if (response.status === 'OK') {
						foundPath.update((n) => (n = response.path));
						const data = await savePath(from, to, response.path);
						goto(`${base}/loading`).then(() => {
							goto(`${base}/map/${from}/${to}`);
						});
					}
				}
			}
		}
	});

	function onMapClick(e: any) {
		popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(map);
	}

	function resizeMap() {
		if (map) {
			map.invalidateSize();
		}
	}
</script>

<svelte:window on:resize={resizeMap} />

<main>
	<div class="space-y-5">
		<div class="max-lg:flex max-lg:justify-center lg:px-5">
			<PathSelection
				locations={markers}
				navFrom={from}
				navTo={to}
				showClearNavButton={true}
				{iconImageDisplayNames}
			/>
		</div>
		{#if error}
			<p class="error_msg">{errMsg}</p>
		{:else}
			<div id="map" class="max-sm:h-96 sm:h-[30rem]" bind:this={map} />
		{/if}
	</div>
</main>
<link
	rel="stylesheet"
	href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
	integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
	crossorigin=""
/>
