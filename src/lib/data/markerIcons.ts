/* eslint-disable @typescript-eslint/ban-ts-comment */

// floor plans
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

//FIXME
//@ts-ignore
export function getMarkerIcons(L) {
	const NavIcon = L.Icon.extend({
		options: {
			iconSize: [25, 25], // size of the icon
			iconAnchor: [12.5, 12.5], // point of the icon which will correspond to marker's location
			popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
		}
	});

	// const x = new NavIcon({ iconUrl: wc });
	// TODO Omezit počet ikon jen na pár nejdůležitějších (wc, třída, posluchárna, laboratoř, kabinet) (a přidat možnost vytvářet vlastní?)
	const markerIcons = {
		// FIXME https://docs.maptiler.com/leaflet/ts-get-started/

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
	return markerIcons;
}
export { floor_0, floor_1, floor_2, floor_3, floor_4 };
