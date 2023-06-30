<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	// floorplans
	import floor_0 from '$lib/images/floor_0.jpg';
	import floor_1 from '$lib/images/floor_1.jpg';
	import floor_2 from '$lib/images/floor_2.jpg';
	import floor_3 from '$lib/images/floor_3.jpg';
	import floor_4 from '$lib/images/floor_4.jpg';
	// icons
	import closet_room from '$lib/images/icons/closet_room.png';
	import director from '$lib/images/icons/director.png';
	import gym from '$lib/images/icons/gym.png';
	import main_classroom from '$lib/images/icons/main_classroom.png';
	import office from '$lib/images/icons/office.png';
	import teachers_room from '$lib/images/icons/teachers_room.png';
	import wc from '$lib/images/icons/wc.png';
	import special_classroom from '$lib/images/icons/special_classroom.png';
	import entry from '$lib/images/icons/entry.png';
	import gym_dress_room from '$lib/images/icons/gym_dress_room.png';
	import it_classroom from '$lib/images/icons/it_classroom.png';
	import labs from '$lib/images/icons/labs.png';
	import staircase from '$lib/images/icons/staircase.png';
	import workout_room from '$lib/images/icons/workout_room.png';
	import explore from '$lib/images/icons/explore.png';
	import language_rooms from '$lib/images/icons/language_rooms.png';
	import singing from '$lib/images/icons/singing.png';
	import storage from '$lib/images/icons/storage.png';
	import archive from '$lib/images/icons/archive.png';
	import art from '$lib/images/icons/art.png';
	import read from '$lib/images/icons/read.png';
	import teachers_common_room from '$lib/images/icons/teachers_common_room.png';
	import weight from '$lib/images/icons/weight.png';
	import deputies from '$lib/images/icons/deputies.png';
	import library from '$lib/images/icons/library.png';
	import boiler_room from '$lib/images/icons/boiler_room.png';
	import bufet from '$lib/images/icons/bufet.png';
	import psychiatrist from '$lib/images/icons/psychiatrist.png';
	import sleep from '$lib/images/icons/sleep.png';
	import uta from '$lib/images/icons/uta.png';
	import washroom from '$lib/images/icons/washroom.png';
	import workshop from '$lib/images/icons/workshop.png';
	import janitor from '$lib/images/icons/janitor.png';
	import janitor_flat from '$lib/images/icons/janitor_flat.png';
	// marker text popup
	import MarkerPopup from '$lib/elements/MarkerPopup.svelte';

	export let data;

	let { markers } = data;
	$: ({ markers } = data);

	let error = false;
	let errMsg: string = '';

	let map: any;
	let popup: any;

	function createMarkers(L: any, markers: any, floor: number, iconList: any) {
		let marker_list = [];
		for (let marker of markers) {
			if (marker.floor === floor) {
				// If this if statement fails, the whole pageload fails - so I double check it
				if (marker.icon !== '' && marker.icon in iconList) {
					marker_list.push(
						// All cords are YX... its not my fault
						L.marker([marker.y, marker.x], { icon: iconList[marker.icon] })
							.bindPopup(() => {
								let container = L.DomUtil.create('div');
								let c = new MarkerPopup({
									target: container,
									props: { text: marker.display_name, id: marker.id }
								});
								return container;
							})
							.openPopup()
					);
				} else {
					marker_list.push(
						// All cords are YX... its not my fault
						L.marker([marker.y, marker.x])
							.bindPopup(() => {
								let container = L.DomUtil.create('div');
								let c = new MarkerPopup({
									target: container,
									props: { text: marker.display_name, id: marker.id }
								});
								return container;
							})
							.openPopup()
					);
				}
			}
		}
		return marker_list;
	}

	onMount(async () => {
		if (browser) {
			// TODO - vložit sem loading screen dokud se všechno nenačte
			const L = await import('leaflet');

			const NavIcon = L.Icon.extend({
				options: {
					iconSize: [25, 25], // size of the icon
					iconAnchor: [12.5, 12.5], // point of the icon which will correspond to marker's location
					popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
				}
			});

			// const x = new NavIcon({ iconUrl: wc });
			// TODO přidat všechny ikony (už chybí jen 2 X (1. PP a 1. NP))
			const markerIcons = {
				// FIXME https://docs.maptiler.com/leaflet/ts-get-started/
				//@ts-ignore
				wc: new NavIcon({ iconUrl: wc }),
				//@ts-ignore
				kabinet: new NavIcon({ iconUrl: teachers_room }),
				//@ts-ignore
				kmen_trida: new NavIcon({ iconUrl: main_classroom }),
				//@ts-ignore
				poslucharna: new NavIcon({ iconUrl: special_classroom }),
				//@ts-ignore
				telocvicna: new NavIcon({ iconUrl: gym }),
				//@ts-ignore
				satna: new NavIcon({ iconUrl: closet_room }),
				//@ts-ignore
				reditelna: new NavIcon({ iconUrl: director }),
				//@ts-ignore
				kancelar: new NavIcon({ iconUrl: office }),
				//@ts-ignore
				vstup: new NavIcon({ iconUrl: entry }),
				//@ts-ignore
				tv_satna: new NavIcon({ iconUrl: gym_dress_room }),
				//@ts-ignore
				it_ucebna: new NavIcon({ iconUrl: it_classroom }),
				//@ts-ignore
				laborator: new NavIcon({ iconUrl: labs }),
				//@ts-ignore
				schodiste: new NavIcon({ iconUrl: staircase }),
				//@ts-ignore
				posilovna: new NavIcon({ iconUrl: workout_room }),
				//@ts-ignore
				badatelna: new NavIcon({ iconUrl: explore }),
				//@ts-ignore
				jazykovka: new NavIcon({ iconUrl: language_rooms }),
				//@ts-ignore
				hudebka: new NavIcon({ iconUrl: singing }),
				//@ts-ignore
				sklad: new NavIcon({ iconUrl: storage }),
				//@ts-ignore
				archiv: new NavIcon({ iconUrl: archive }),
				//@ts-ignore
				atelier: new NavIcon({ iconUrl: art }),
				//@ts-ignore
				zastupci_reditele: new NavIcon({ iconUrl: deputies }),
				//@ts-ignore
				knihovna: new NavIcon({ iconUrl: library }),
				//@ts-ignore
				citarna: new NavIcon({ iconUrl: read }),
				//@ts-ignore
				sborovna: new NavIcon({ iconUrl: teachers_common_room }),
				//@ts-ignore
				vahovna: new NavIcon({ iconUrl: weight }),
				//@ts-ignore
				kotelna: new NavIcon({ iconUrl: boiler_room }),
				//@ts-ignore
				bufet: new NavIcon({ iconUrl: bufet }),
				//@ts-ignore
				psycholog: new NavIcon({ iconUrl: psychiatrist }),
				//@ts-ignore
				spinkarna: new NavIcon({ iconUrl: sleep }),
				//@ts-ignore
				uta: new NavIcon({ iconUrl: uta }),
				//@ts-ignore
				umyvarna: new NavIcon({ iconUrl: washroom }),
				//@ts-ignore
				dilna: new NavIcon({ iconUrl: workshop }),
				//@ts-ignore
				skolnik: new NavIcon({ iconUrl: janitor }),
				//@ts-ignore
				byt_skolnika: new NavIcon({ iconUrl: janitor_flat })
			};

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

			// TO-DONE Až bude příslušná infrastruktura (databáze a tak, tak vytvořím markery pomocí foreach loopu) DONE
			/*
			L.marker([y, x], icon)
					.bindPopup(() => {
						let container = L.DomUtil.create('div');
						let c = new MarkerPopup({
							target: container,
							props: {
								text: name,
								id: id
							}
						});
						return container;
					})
					.openPopup(),
			*/
			// TO-DONE Je potřeba vyřešit, aby byl v markeru čudlík/odkaz, který umožňí nechat se na něj navigovat DONE
			// TODO Určit jaké WC je jaké -> WC(M, Ž, U) / WC(M, Ž) / WC(M) (M = muži, Ž = ženy, U = učitelé)
			// TODO zjistit co jsou X (1. PP a 1. NP)

			// TODO navigace z A do B (navigační markery a tak - hlavně konzultace s ferenczem)
			// TODO přidat import from a to z url
			// TODO zobrazit from a to na stránce
			// TODO Nakreslit všechny ikony
			let marker_list: any = [];
			marker_list = createMarkers(L, markers, 0, markerIcons);
			let zeroFloor = L.layerGroup([
				zeroFloorImg,
				...marker_list

				/**
					*	// Old building (All cords are YX... its not my fault)
					*	L.marker([2016, 496])
					*		.bindPopup(() => {
					*			let container = L.DomUtil.create('div');
					*			let c = new MarkerPopup({
					*				target: container,
					*				props: {
					*					text: 'Malá tělocvična',
					*					id: 'xyz'
					*				}
					*			});
					*			return container;
					*		})
					*		.openPopup()
				/**
					* L.marker([2064, 976]).bindPopup('Kabinet TV').openPopup(),
					* L.marker([1720, 1032]).bindPopup('WC').openPopup(),
					* L.marker([1104, 312]).bindPopup('Šatny').openPopup(),
					* L.marker([312, 432]).bindPopup('Posilovna').openPopup(),
					* L.marker([1070, 950]).bindPopup('Schodiště B').openPopup(),
					* L.marker([1056, 1416]).bindPopup('Bufet').openPopup(),
					* L.marker([1008, 2008]).bindPopup('X').openPopup(),
					* L.marker([968, 2720]).bindPopup('Dílna').openPopup(),
					* // New building
					* L.marker([1048, 3456]).bindPopup('Kotelna').openPopup(),
					* L.marker([1080, 3992]).bindPopup('Sklad učebnic').openPopup(),
					* L.marker([1168, 4360]).bindPopup('Schodiště C').openPopup(),
					* L.marker([1040, 5160]).bindPopup('Šatny C').openPopup(),
					* L.marker([600, 5800]).bindPopup('Studentský vchod').openPopup(),
					* L.marker([928, 6648]).bindPopup('Šatny D').openPopup(),
					* L.marker([1112, 7360]).bindPopup('Schodiště D').openPopup(),
					* L.marker([1160, 8168]).bindPopup('Byt školníka').openPopup(),
					* L.marker([592, 8584]).bindPopup('Umývárna').openPopup(),
					* L.marker([1480, 9472]).bindPopup('Velká tělocvična').openPopup(),
					* L.marker([240, 9152]).bindPopup('Kabinet TV').openPopup(),
					* L.marker([344, 9768]).bindPopup('Nářaďovna').openPopup(),
					* //L.marker([]).bindPopup('A').openPopup()
					* 
					* // nav markers
					* L.marker(
					* 	[1448, 936] /*, /*{
					* 	/*icon: L.divIcon({
					* 		className: 'leaflet-mouse-marker',
					* 		iconAnchor: [1, 1],
					* 		iconSize: [1, 1]
					* 	}),
					* 	opacity: 100
					* }/
					* ),
					* L.polyline([
					* 	[1448, 936],
					* 	[1448, 736],
					* 	[1000, 736]
					* ])
					*/
			]);
			marker_list = createMarkers(L, markers, 1, markerIcons);
			let firstFloor = L.layerGroup([
				// Map image
				firstFloorImg,
				...marker_list
				/**
				 * // Markers
				 * // Old building (All cords are YX... its not my fault)
				 * L.marker([3560, 968]).bindPopup('Spinkárna').openPopup(),
				 * L.marker([3544, 288]).bindPopup('X').openPopup(),
				 * L.marker([2880, 280]).bindPopup('J6').openPopup(),
				 * L.marker([3040, 928]).bindPopup('Schodiště A').openPopup(),
				 * L.marker([3080, 1296]).bindPopup('Psycholog').openPopup(),
				 * L.marker([2080, 1048]).bindPopup('WC').openPopup(),
				 * L.marker([1328, 312]).bindPopup('Kabinet CH').openPopup(),
				 * L.marker([968, 328]).bindPopup('Váhovna').openPopup(),
				 * L.marker([368, 312]).bindPopup('laboratoř CH').openPopup(),
				 * L.marker([232, 744]).bindPopup('WC').openPopup(),
				 * L.marker([968, 984]).bindPopup('Schodiště B').openPopup(),
				 * L.marker([992, 1504]).bindPopup('Posluchárna CH').openPopup(),
				 * L.marker([1088, 2304]).bindPopup('Třída').openPopup(),
				 * L.marker([992, 2928]).bindPopup('Školník').openPopup(),
				 * // New building
				 * L.marker([1168, 3280]).bindPopup('WC').openPopup(),
				 * L.marker([1136, 3856]).bindPopup('Třída').openPopup(),
				 * L.marker([1112, 4408]).bindPopup('Schodiště C').openPopup(),
				 * L.marker([240, 4200]).bindPopup('Vestibul').openPopup(),
				 * L.marker([1200, 4976]).bindPopup('Třída').openPopup(),
				 * L.marker([1192, 5760]).bindPopup('Třída').openPopup(),
				 * L.marker([1144, 6344]).bindPopup('WC').openPopup(),
				 * L.marker([1128, 6856]).bindPopup('Posluchárna FY').openPopup(),
				 * L.marker([1080, 7448]).bindPopup('Schodiště D').openPopup(),
				 * L.marker([1072, 7768]).bindPopup('Kabinet ČJ').openPopup(),
				 * L.marker([1072, 8096]).bindPopup('Kabinet FY').openPopup(),
				 * L.marker([1088, 8608]).bindPopup('Laboratoř FY').openPopup(),
				 * L.marker([288, 9104]).bindPopup('Šatna').openPopup(),
				 * L.marker([344, 9616]).bindPopup('WC').openPopup(),
				 * L.marker([328, 9944]).bindPopup('Šatna').openPopup()
				 */ //L.marker([]).bindPopup('A').openPopup(),
			]);
			marker_list = createMarkers(L, markers, 2, markerIcons);
			let secondFloor = L.layerGroup([
				// Map image
				secondFloorImg,
				...marker_list

				// Markers (All cords are YX... its not my fault)
				// Old building
				/**
				 *	L.marker([3504, 552]).bindPopup('Knihovna').openPopup(),
				 *	L.marker([2760, 248]).bindPopup('Čítárna').openPopup(),
				 *	L.marker([3152, 952]).bindPopup('Schodiště A').openPopup(),
				 *	L.marker([2240, 464]).bindPopup('Sborovna').openPopup(),
				 *	L.marker([1744, 336]).bindPopup('Zástupci ředitele').openPopup(),
				 *	L.marker([1336, 320]).bindPopup('Ředitelna').openPopup(),
				 *	L.marker([968, 336]).bindPopup('Kancelář').openPopup(),
				 *	L.marker([368, 304]).bindPopup('Třída').openPopup(),
				 *	L.marker([1728, 1000]).bindPopup('WC').openPopup(),
				 *	L.marker([1464, 1000]).bindPopup('Archiv').openPopup(),
				 *	L.marker([1000, 992]).bindPopup('Schodiště B').openPopup(),
				 *	L.marker([248, 712]).bindPopup('WC').openPopup(),
				 *	L.marker([1064, 1496]).bindPopup('Třída').openPopup(),
				 *	L.marker([1000, 2328]).bindPopup('Třída').openPopup(),
				 *	L.marker([1024, 2912]).bindPopup('Třída').openPopup(),
				// New building
				/**
				 *	L.marker([1184, 3328]).bindPopup('WC').openPopup(),
				 *	L.marker([1160, 3800]).bindPopup('Třída').openPopup(),
				 *	L.marker([1112, 4416]).bindPopup('Schodiště C').openPopup(),
				 *	L.marker([1104, 4872]).bindPopup('J1').openPopup(),
				 *	L.marker([1064, 5272]).bindPopup('Kabinet AJ').openPopup(),
				 *	L.marker([1128, 5584]).bindPopup('Kabinet NJ').openPopup(),
				 *	L.marker([1120, 5976]).bindPopup('J2').openPopup(),
				 *	L.marker([1072, 6352]).bindPopup('WC').openPopup(),
				 *	L.marker([1088, 6856]).bindPopup('Třída').openPopup(),
				 *	L.marker([1088, 7496]).bindPopup('Schodiště D').openPopup(),
				 *	L.marker([1048, 7896]).bindPopup('Laboratoř BI').openPopup(),
				 *	L.marker([1048, 8528]).bindPopup('Posluchárna B').openPopup(),
				 *	L.marker([656, 8752]).bindPopup('Kabinet BI').openPopup()
				//L.marker([]).bindPopup('A').openPopup(),
				*/
			]);
			marker_list = createMarkers(L, markers, 3, markerIcons);
			let thirdFloor = L.layerGroup([
				// Map image
				thirdFloorImg,
				...marker_list

				// Markers (All cords are YX... its not my fault)
				// Old building
				/**
				 *	L.marker([2224, 376]).bindPopup('UVT 1').openPopup(),
				 *	L.marker([2112, 728]).bindPopup('Kabinet ICT').openPopup(),
				 *	L.marker([1776, 328]).bindPopup('Kabinet ICT').openPopup(),
				 *	L.marker([1232, 312]).bindPopup('UVT 2').openPopup(),
				 *	L.marker([352, 336]).bindPopup('Třída').openPopup(),
				 *	L.marker([1520, 1000]).bindPopup('WC').openPopup(),
				 *	L.marker([1048, 976]).bindPopup('Schodiště B').openPopup(),
				 *	L.marker([288, 736]).bindPopup('WC').openPopup(),
				 *	L.marker([288, 736]).bindPopup('Třída').openPopup(),
				 *	L.marker([1056, 1512]).bindPopup('Třída').openPopup(),
				 *	L.marker([1040, 2232]).bindPopup('Třída').openPopup(),
				 *	L.marker([1048, 2872]).bindPopup('Kabinet MA').openPopup(),
				 *	// New building
				 *	L.marker([1168, 3240]).bindPopup('WC').openPopup(),
				 *	L.marker([1128, 3800]).bindPopup('Třída').openPopup(),
				 *	L.marker([1144, 4376]).bindPopup('Schodiště C').openPopup(),
				 *	L.marker([1192, 4872]).bindPopup('Třída').openPopup(),
				 *	L.marker([1176, 5712]).bindPopup('UTA').openPopup(),
				 *	L.marker([1104, 6296]).bindPopup('WC').openPopup(),
				 *	L.marker([1096, 6800]).bindPopup('Třída').openPopup(),
				 *	L.marker([1120, 7392]).bindPopup('Schodiště D').openPopup(),
				 *	L.marker([1096, 7768]).bindPopup('J4').openPopup(),
				 *	L.marker([1120, 8424]).bindPopup('Posluchárna ZE').openPopup(),
				 *	L.marker([656, 8640]).bindPopup('Kabinet ZE').openPopup()
				 */
				//L.marker([]).bindPopup('A').openPopup(),
			]);
			marker_list = createMarkers(L, markers, 4, markerIcons);
			let fourthFloor = L.layerGroup([
				// Map image
				fourthFloorImg,
				...marker_list

				// Markers (All cords are YX... its not my fault)
				// Old building
				/**
					*	L.marker([896, 416]).bindPopup('Půda').openPopup(),
					*	L.marker([1040, 984]).bindPopup('Schodiště B').openPopup(),
					*	L.marker([920, 2040]).bindPopup('Badatelské centrum').openPopup(),	
					*	// New building
					*	L.marker([1200, 3264]).bindPopup('SKlad VV').openPopup(),
					*	L.marker([1152, 3816]).bindPopup('Ateliér').openPopup(),
					*	L.marker([1096, 4248]).bindPopup('Schodiště C').openPopup(),
					*	L.marker([1096, 4512]).bindPopup('Kabinet VV').openPopup(),
					*	L.marker([1088, 6272]).bindPopup('WC').openPopup(),
					*	L.marker([1064, 6800]).bindPopup('Třída').openPopup(),
					*	L.marker([1072, 7416]).bindPopup('Schodiště D').openPopup(),
					*	L.marker([1088, 7712]).bindPopup('HV 2').openPopup(),
					*	L.marker([1064, 8320]).bindPopup('HV 1').openPopup(),
					*	L.marker([1040, 8760]).bindPopup('Kabinet HV').openPopup(),
					*	L.marker([640, 8608]).bindPopup('Kabinet DE a RJ').openPopup()

				//L.marker([]).bindPopup('A').openPopup(),
				*/
			]);
			marker_list = [];
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
			L.marker([0, 0], { icon: markerIcons['wc'] }).bindPopup('Kabinet TV').openPopup().addTo(map);
		}
	});
	// FIXME odstraenit až nebude třeba vypisovat souřadnice kliknutí
	function onMapClick(e: any) {
		popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(map);
	}
</script>

<main>
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
	main div {
		height: 700px;
	}
</style>
