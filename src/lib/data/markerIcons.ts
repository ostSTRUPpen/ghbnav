/* eslint-disable @typescript-eslint/ban-ts-comment */

// floor plans
import floor_0 from '$lib/images/floors/floor_0.jpg';
import floor_1 from '$lib/images/floors/floor_1.jpg';
import floor_2 from '$lib/images/floors/floor_2.jpg';
import floor_3 from '$lib/images/floors/floor_3.jpg';
import floor_4 from '$lib/images/floors/floor_4.jpg';

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
import satny from '$lib/images/icons/markers/satny.png';
import schody from '$lib/images/icons/markers/schody.png';
import vv_a_hv from '$lib/images/icons/markers/vv_a_hv.png';

export const iconImages: Record<string, string> = {
	administrace: administrace,
	kmenove_ucebny: kmenove_ucebny,
	jazykove_ucebny: jazykove_ucebny,
	kabinety: kabinety,
	ostatni: ostatni,
	prostory: prostory,
	sluzby: sluzby,
	specializovane_ucebny: specializovane_ucebny,
	vv_a_hv: vv_a_hv,
	telovychova: telovychova,
	zachody: zachody,
	satny: satny,
	schody: schody
};

export { floor_0, floor_1, floor_2, floor_3, floor_4 };

//@ts-expect-error
export function getMarkerIcons(L, icons) {
	const NavIcon = L.Icon.extend({
		options: {
			iconSize: [30, 30], // size of the icon
			iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
			popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
		}
	});

	const markerIcons = new Object();
	for (const icon of icons) {
		markerIcons[icon.id as keyof typeof markerIcons] = new NavIcon({
			iconUrl: iconImages[icon.image as keyof typeof iconImages]
		});
	}
	return markerIcons;
}
