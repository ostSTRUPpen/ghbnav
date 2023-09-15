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
	import { foundpath } from '$lib/data/store.js';
	import { savePath } from '$lib/functions/pathSavingFunctions.js';
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
	foundpath.subscribe((value) => {
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
		buttonType: string,
		fromNodeId: string
	) {
		let markerList = [];
		for (let marker of markers) {
			if (marker.floor === floor) {
				// If this if statement fails, the whole pageload fails - so I double check it
				if (marker.icon !== '' && marker.icon in iconList) {
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
										buttonType: buttonType,
										fromNodeId
									}
								});
								return container;
							})
							.openPopup()
					);
				} else {
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
										buttonType: buttonType,
										fromNodeId
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
	function drawPath(
		path: any,
		markers: any,
		navMarkers: any,
		floor: number,
		changedFloorsBefore: boolean
	) {
		let lineList: Array<Array<Array<string>>> = [];
		let floorLineList: Array<Array<string>> = [];
		let changedFloors = changedFloorsBefore;
		console.log(changedFloors);
		console.log(path);
		//console.log(navMarkers);
		for (let pathPoint of path) {
			//console.log(pathPoint);
			for (let marker of markers) {
				//console.log('h');
				if (marker.id === pathPoint) {
					if (marker.floor === floor) floorLineList.push([marker.y, marker.x]);
				}
			}

			for (let navMarker of navMarkers) {
				if (String(navMarker.id) === pathPoint) {
					//console.log('h');
					if (navMarker.floor === floor) {
						floorLineList.push([navMarker.y, navMarker.x]);
						// TODO pořád to nefunguje... už to neskipne vždy, ale pořád ne ideální - je potřeba rozlišovat splitLine a changedFloors:
						// skipLine = rozděl line (platí pouze pro patro)
						// changedFloors = říká, že na dalším patře se začne stair_up nebo stair_down markerem...

						//console.log(navMarker.id);
						//console.log(changedFloors);
						//console.log(navMarker.special_type + '   ' + navMarker.floor + '   ' + navMarker.id);
						if (
							(navMarker.special_type === 'stair_up' && changedFloors === false) ||
							(navMarker.special_type === 'stair_down' && changedFloors === false)
						) {
							//if (changedFloors === false) {
							// TODO //FIXME //IMPORTANT //!!!! nefunguje přepínání čili i vykreslování cesty na jiném než startovním patře
							lineList.push(floorLineList);
							console.log(floorLineList);
							floorLineList = [];
							changedFloors = true;
							console.log('clearer');
							//}
						} else {
							changedFloors = false;
						}
						console.log(changedFloors);
						console.log('---');
					}
				}
			}
			//console.log(lineList);
		}
		lineList.push(floorLineList);
		//console.log(lineList);
		//console.log(lineList)
		return {
			pathList: lineList,
			prevState: changedFloors
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
			// TODO zjistit, zda je průchozí "tělocvična D->umývárny"
			// TODO zjistit co jsou X (1. PP a 1. NP)

			let markerList: any = [];
			//FIXME odstranit až nebude potřeba
			let navMarkerList = [];
			let pathList: any = [];
			let canDrawPath: boolean = false;
			let prevState: boolean = false;

			if (currentFoundPath[0] === from && currentFoundPath[currentFoundPath.length - 1] === to) {
				canDrawPath = true;
			}

			markerList = createMarkers(L, markers, 0, markerIcons, state, from);
			//FIXME odstranit až nebude potřeba
			navMarkerList = createNavMarkers(markers, nav_markers, 0);
			if (canDrawPath === true)
				({ pathList, prevState } = drawPath(currentFoundPath, markers, nav_markers, 0, prevState));
			let zeroFloor = L.layerGroup([
				zeroFloorImg,
				...markerList,
				//L.polyline(pathList)
				//@ts-ignore
				L.polyline(navMarkerList)
			]);
			console.log(prevState);

			markerList = createMarkers(L, markers, 1, markerIcons, state, from);
			//FIXME odstranit až nebude potřeba
			navMarkerList = createNavMarkers(markers, nav_markers, 1);
			if (canDrawPath === true)
				({ pathList, prevState } = drawPath(currentFoundPath, markers, nav_markers, 1, prevState));
			let firstFloor = L.layerGroup([
				// Map image
				firstFloorImg,
				...markerList,
				//L.polyline(pathList)
				//FIXME odstranit až nebude potřeba
				//@ts-ignore
				L.polyline(navMarkerList)
			]);
			console.log(prevState);

			markerList = createMarkers(L, markers, 2, markerIcons, state, from);
			//FIXME odstranit až nebude potřeba
			navMarkerList = createNavMarkers(markers, nav_markers, 2);
			if (canDrawPath === true)
				({ pathList, prevState } = drawPath(currentFoundPath, markers, nav_markers, 2, prevState));
			let secondFloor = L.layerGroup([
				// Map image
				secondFloorImg,
				...markerList,
				//L.polyline(pathList)
				//FIXME odstranit až nebude potřeba
				//@ts-ignore
				L.polyline(navMarkerList)
			]);

			markerList = createMarkers(L, markers, 3, markerIcons, state, from);
			//FIXME odstranit až nebude potřeba
			navMarkerList = createNavMarkers(markers, nav_markers, 3);
			if (canDrawPath === true)
				({ pathList, prevState } = drawPath(currentFoundPath, markers, nav_markers, 3, prevState));
			let thirdFloor = L.layerGroup([
				// Map image
				thirdFloorImg,
				...markerList,
				//L.polyline(pathList)
				//FIXME odstranit až nebude potřeba
				//@ts-ignore
				L.polyline(navMarkerList)
			]);

			markerList = createMarkers(L, markers, 4, markerIcons, state, from);
			//FIXME odstranit až nebude potřeba
			navMarkerList = createNavMarkers(markers, nav_markers, 4);
			if (canDrawPath === true)
				({ pathList, prevState } = drawPath(currentFoundPath, markers, nav_markers, 4, prevState));
			let fourthFloor = L.layerGroup([
				// Map image
				fourthFloorImg,
				...markerList,
				//L.polyline(pathList)
				//FIXME odstranit až nebude potřeba
				//@ts-ignore
				L.polyline(navMarkerList)
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
					goto('/loading').then(() => goto(`/map/${from}`));
				} else if (
					currentFoundPath[0] !== from ||
					currentFoundPath[currentFoundPath.length - 1] !== to
				) {
					foundpath.update((n) => (n = ['']));
					const response = dijkstra(nav_markers, from, to);
					//console.log(response.path);
					if (response.status === 'OK') {
						//console.log('h');
						//if (response.path.length > 1) {
						foundpath.update((n) => (n = response.path));
						//console.log('h');
						const data = await savePath(from, to, response.path);
						//console.log('h');
						goto('/loading').then(() => {
							goto(`/map/${from}/${to}`);
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
		goto('/loading').then(() => goto(`/map/${navFrom}/${navTo}`));
	}
	function clearNav() {
		foundpath.update((n) => (n = ['']));
		goto('/loading').then(() => {
			goto(`/map`);
		});
	}

	$: {
		if (navFrom === '0' || navTo === '0' || navFrom === navTo) {
			isDisabled = true;
		} else {
			isDisabled = false;
		}
	}
</script>

<main>
	{#if error}
		<p class="error_msg">{errMsg}</p>
	{:else}
		<div id="map" bind:this={map} />
	{/if}

	<div>
		<!-- TODO viz main page-->
		<label for="from">Odkud:</label>
		<select id="from" name="from" bind:value={navFrom}>
			<option value="0">--Prosím vyberte začátek cesty--</option>
			{#each markers as marker}
				<option value={marker.id}>{marker.display_name} (Patro: {marker.floor})</option>
			{/each}
		</select>
		<label for="to">Kam:</label>
		<select id="to" name="to" bind:value={navTo}>
			<option value="0">--Prosím vyberte konec cesty--</option>
			{#each markers as marker}
				<option value={marker.id}>{marker.display_name} (Patro: {marker.floor})</option>
			{/each}
		</select>
		<button on:click={navFromTo} disabled={isDisabled}>Navigovat</button>
		<button on:click={clearNav}>Vymazat navigaci</button>
	</div>
</main>
<link
	rel="stylesheet"
	href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
	integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
	crossorigin=""
/>

<style>
	main div {
		height: 700px;
	}
</style>
