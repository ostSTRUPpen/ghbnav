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
	import { savePath } from '$lib/functions/pathSavingFunctions.js';
	import { base } from '$app/paths';
	export let data;

	let { markers, nav_markers } = data;
	$: ({ markers, nav_markers } = data);

	let from: string = '',
		to: string = '',
		navFrom: string = '',
		navTo: string = '';

	from = $page.params.from;
	to = $page.params.to;

	navFrom = from;
	navTo = to;

	/**
	 * TODO přidat další navmarkery
	 * TODO přidat ukládání do databáze |startingPoint|endingPoint|path|amountOfUsage
	 * TODO zprovoznit QRkódy a zobrazení nejpoužívanějších cest
	 */
	let currentFoundPath = [''];
	foundPath.subscribe((value) => {
		currentFoundPath = value;
		//console.log(currentFoundPath);
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
				// If this if statement fails, the whole pageload fails - so I double check it
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
										//FIXME upravit až nebude potřeba
										text: `${marker.display_name} Y: ${marker.y}, X: ${marker.x}`,
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
	// TODO odstranit, až budou všechny navmarekry správně
	//FIXME odstranit až nebude potřeba
	function createNavMarkers(markers: any, navMarkers: any, floor: number) {
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
	}
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

	onMount(async () => {
		if (browser) {
			const L = await import('leaflet');
			const markerIcons = getMarkerIcons(L);

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

			// FIXME odstraenit až nebude třeba vypisovat souřadnice kliknutí
			popup = L.popup();

			// TODO Určit jaké WC je jaké -> WC(M, Ž, U) / WC(M, Ž) / WC(M) (M = muži, Ž = ženy, U = učitelé)
			// TODO zjistit co jsou X (1. PP a 1. NP)

			let markerList: any = [];
			//FIXME odstranit až nebude potřeba
			let navMarkerList = [];
			let pathList: any = [];
			let canDrawPath: boolean = false;

			if (currentFoundPath[0] === from && currentFoundPath[currentFoundPath.length - 1] === to) {
				canDrawPath = true;
			}

			markerList = createMarkers(L, markers, 0, markerIcons, state, from);
			//FIXME odstranit až nebude potřeba
			navMarkerList = createNavMarkers(markers, nav_markers, 0);
			if (canDrawPath === true)
				({ pathList } = drawPath(currentFoundPath, markers, nav_markers, 0));
			let zeroFloor = L.layerGroup([
				zeroFloorImg,
				...markerList,
				L.polyline(pathList)
				//@ts-ignore
				//L.polyline(navMarkerList)
			]);

			markerList = createMarkers(L, markers, 1, markerIcons, state, from);
			//FIXME odstranit až nebude potřeba
			navMarkerList = createNavMarkers(markers, nav_markers, 1);
			if (canDrawPath === true)
				({ pathList } = drawPath(currentFoundPath, markers, nav_markers, 1));
			let firstFloor = L.layerGroup([
				// Map image
				firstFloorImg,
				...markerList,
				L.polyline(pathList)
				//FIXME odstranit až nebude potřeba
				//@ts-ignore
				//L.polyline(navMarkerList)
			]);

			markerList = createMarkers(L, markers, 2, markerIcons, state, from);
			//FIXME odstranit až nebude potřeba
			navMarkerList = createNavMarkers(markers, nav_markers, 2);
			if (canDrawPath === true)
				({ pathList } = drawPath(currentFoundPath, markers, nav_markers, 2));
			let secondFloor = L.layerGroup([
				// Map image
				secondFloorImg,
				...markerList,
				L.polyline(pathList)
				//FIXME odstranit až nebude potřeba
				//@ts-ignore
				//L.polyline(navMarkerList)
			]);

			markerList = createMarkers(L, markers, 3, markerIcons, state, from);
			//FIXME odstranit až nebude potřeba
			navMarkerList = createNavMarkers(markers, nav_markers, 3);
			if (canDrawPath === true)
				({ pathList } = drawPath(currentFoundPath, markers, nav_markers, 3));
			let thirdFloor = L.layerGroup([
				// Map image
				thirdFloorImg,
				...markerList,
				L.polyline(pathList)
				//FIXME odstranit až nebude potřeba
				//@ts-ignore
				//L.polyline(navMarkerList)
			]);

			markerList = createMarkers(L, markers, 4, markerIcons, state, from);
			//FIXME odstranit až nebude potřeba
			navMarkerList = createNavMarkers(markers, nav_markers, 4);
			if (canDrawPath === true)
				({ pathList } = drawPath(currentFoundPath, markers, nav_markers, 4));
			let fourthFloor = L.layerGroup([
				// Map image
				fourthFloorImg,
				...markerList,
				L.polyline(pathList)
				//FIXME odstranit až nebude potřeba
				//@ts-ignore
				//L.polyline(navMarkerList)
			]);
			markerList = [];
			//FIXME odstranit až nebude potřeba
			navMarkerList = [];
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
				minZoom: -5,
				maxZoom: 0,
				layers: [zeroFloor]
			});
			map.fitBounds([
				[0, 0],
				[3000, 10000]
			]);

			L.control.layers(floors).addTo(map);
			// FIXME odstraenit až nebude třeba vypisovat souřadnice kliknutí
			map.on('click', onMapClick);

			if (state === 'ready') {
				if (from === to && from !== undefined) {
					alert('Začátek a konec cesty nemůže být stejný');
					goto(`${base}/loading`).then(() => goto(`${base}/map/${from}`));
				} else if (
					currentFoundPath[0] !== from ||
					currentFoundPath[currentFoundPath.length - 1] !== to
				) {
					foundPath.update((n) => (n = ['']));
					const response = dijkstra(nav_markers, from, to);
					//console.log(response.path);
					if (response.status === 'OK') {
						//console.log('h');
						//if (response.path.length > 1) {
						foundPath.update((n) => (n = response.path));
						//console.log('h');
						const data = await savePath(from, to, response.path);
						//console.log('h');
						goto(`${base}/loading`).then(() => {
							goto(`${base}/map/${from}/${to}`);
						});
						//}
					}
				}
			}
		}
	});

	// FIXME odstraenit až nebude třeba vypisovat souřadnice kliknutí
	function onMapClick(e: any) {
		popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(map);
	}

	// Nav selection under the map element
	let isDisabled: boolean = true;

	function navFromTo() {
		//console.log(navFrom + ' -> ' + navTo);
		goto(`${base}/loading`).then(() => goto(`${base}/map/${navFrom}/${navTo}`));
	}
	function clearNav() {
		foundPath.update((n) => (n = ['']));
		goto(`${base}/loading`).then(() => {
			goto(`${base}/map`);
		});
	}

	$: {
		if (navFrom === '0' || navTo === '0' || navFrom === navTo) {
			isDisabled = true;
		} else {
			isDisabled = false;
		}
	}
	function resizeMap() {
		if (map) {
			map.invalidateSize();
		}
	}
</script>

<svelte:window on:resize={resizeMap} />

<main>
	<div id="selection">
		<!-- TODO viz main page-->
		<label for="from">Odkud:</label>
		<select id="from" name="from" bind:value={navFrom}>
			<option value="0">--Prosím vyberte začátek cesty--</option>
			{#each markers as marker}
				{#if marker.can_nav !== false}
					<option value={marker.id}>{marker.display_name} (Patro: {marker.floor})</option>
				{/if}
			{/each}
		</select>
		<br />
		<label for="to">Kam:</label>
		<select id="to" name="to" bind:value={navTo}>
			<option value="0">--Prosím vyberte konec cesty--</option>
			{#each markers as marker}
				{#if marker.can_nav !== false}
					<option value={marker.id}>{marker.display_name} (Patro: {marker.floor})</option>
				{/if}
			{/each}
		</select>
		<br />
		<button on:click={navFromTo} disabled={isDisabled}>Navigovat</button>
		<button on:click={clearNav}>Vymazat navigaci</button>
	</div>
	{#if error}
		<p class="error_msg">{errMsg}</p>
	{:else}
		<div id="map" bind:this={map} />
	{/if}
</main>
<link
	rel="stylesheet"
	href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
	integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
	crossorigin=""
/>

<style>
	#selection {
		margin-bottom: 1em;
	}
	#map {
		height: 700px;
	}
</style>
