/* eslint-disable @typescript-eslint/ban-ts-comment */

// floor plans
import floor_0 from '$lib/images/floors/webp/floor_0.webp';
import floor_1 from '$lib/images/floors/webp/floor_1.webp';
import floor_2 from '$lib/images/floors/webp/floor_2.webp';
import floor_3 from '$lib/images/floors/webp/floor_3.webp';
import floor_4 from '$lib/images/floors/webp/floor_4.webp';

// icons
import administrace from '$lib/images/icons/markers/webp/administrace.webp';
import kmenove_ucebny from '$lib/images/icons/markers/webp/kmenove_ucebny.webp';
import jazykove_ucebny from '$lib/images/icons/markers/webp/jazykove_ucebny.webp';
import kabinety from '$lib/images/icons/markers/webp/kabinety.webp';
import ostatni from '$lib/images/icons/markers/webp/ostatni.webp';
import prostory from '$lib/images/icons/markers/webp/prostory.webp';
import sluzby from '$lib/images/icons/markers/webp/sluzby.webp';
import specializovane_ucebny from '$lib/images/icons/markers/webp/specializovane_ucebny.webp';
import telovychova from '$lib/images/icons/markers/webp/telovychova.webp';
import zachody from '$lib/images/icons/markers/webp/zachody.webp';
import satny from '$lib/images/icons/markers/webp/satny.webp';
import schody from '$lib/images/icons/markers/webp/schody.webp';
import vv_a_hv from '$lib/images/icons/markers/webp/vv_a_hv.webp';

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
