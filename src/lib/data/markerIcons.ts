/* eslint-disable @typescript-eslint/ban-ts-comment */

// floor plans
import floor_0 from '$lib/images/floor_0.jpg';
import floor_1 from '$lib/images/floor_1.jpg';
import floor_2 from '$lib/images/floor_2.jpg';
import floor_3 from '$lib/images/floor_3.jpg';
import floor_4 from '$lib/images/floor_4.jpg';

// icons
import administrace from '$lib/images/icons/markers/administrace.png';
import kmenove_ucebny from '$lib/images/icons/markers/kmenove_ucebny.png';
import jazykove_ucebny from '$lib/images/icons/markers/jazykove_ucebny.png';
import kabinety from '$lib/images/icons/markers/kabinety.png';
import ostatni from '$lib/images/icons/markers/ostatni.png';
import prostory from '$lib/images/icons/markers/prostory.png';
import sluzby from '$lib/images/icons/markers/sluzby.png';
import specializovane_ucebny from '$lib/images/icons/markers/specializovane_ucebny.png';
import telovychova from '$lib/images/icons/markers/telovychova.png';
import zachody from '$lib/images/icons/markers/zachody.png';

//@ts-ignore
export function getMarkerIcons(L) {
	const NavIcon = L.Icon.extend({
		options: {
			iconSize: [25, 25], // size of the icon
			iconAnchor: [12.5, 12.5], // point of the icon which will correspond to marker's location
			popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
		}
	});

	const markerIcons = {
		// NEW
		administrace: new NavIcon({ iconUrl: administrace }),
		jazykove_ucebny: new NavIcon({ iconUrl: jazykove_ucebny }),
		kabinety: new NavIcon({ iconUrl: kabinety }),
		kmenove_ucebny: new NavIcon({ iconUrl: kmenove_ucebny }),
		ostatni: new NavIcon({ iconUrl: ostatni }),
		prostory: new NavIcon({ iconUrl: prostory }),
		sluzby: new NavIcon({ iconUrl: sluzby }),
		specializovane_ucebny: new NavIcon({ iconUrl: specializovane_ucebny }),
		telovychova: new NavIcon({ iconUrl: telovychova }),
		zachody: new NavIcon({ iconUrl: zachody })
	};
	return markerIcons;
}
export { floor_0, floor_1, floor_2, floor_3, floor_4 };

export const iconImageList = [
	// NEW
	{
		name: 'administrace',
		image: administrace,
		displayname: 'Administrace'
	},
	{
		name: 'jazykove_ucebny',
		image: jazykove_ucebny,
		displayname: 'Jazykové učebny'
	},
	{
		name: 'kabinety',
		image: kabinety,
		displayname: 'Kabinety'
	},
	{
		name: 'kmenove_ucebny',
		image: kmenove_ucebny,
		displayname: 'Kmenové učebny'
	},
	{
		name: 'ostatni',
		image: ostatni,
		displayname: 'Ostatní'
	},
	{
		name: 'prostory',
		image: prostory,
		displayname: 'Prostory'
	},
	{
		name: 'sluzby',
		image: sluzby,
		displayname: 'Služby'
	},
	{
		name: 'specializovane_ucebny',
		image: specializovane_ucebny,
		displayname: 'Specializované učebny'
	},
	{
		name: 'telovychova',
		image: telovychova,
		displayname: 'Tělovýchova'
	},
	{
		name: 'zachody',
		image: zachody,
		displayname: 'Záchody'
	}
];

export const iconImageDisplayNames = {
	administrace: 'Administrace',
	jazykove_ucebny: 'Jazykové učebny',
	kabinety: 'Kabinety',
	kmenove_ucebny: 'Kmenové učebny',
	ostatni: 'Ostatní',
	prostory: 'Prostory',
	sluzby: 'Služby',
	specializovane_ucebny: 'Specializované učebny',
	telovychova: 'Tělovýchova',
	zachody: 'Záchody'
};
