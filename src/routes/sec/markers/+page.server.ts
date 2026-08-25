import { queryRowsOrEmpty } from '$lib/server/queryRows';
import type { MarkerIconChoice } from '$lib/types/admin';
import type { Location } from '$lib/types/navigation';
import type { PageServerLoad } from './$types';

interface MarkerIconRow {
	id: string;
	image: string;
	display_name: string;
}

export const load: PageServerLoad = async ({ locals: { sql } }) => {
	const [markers, icons] = await Promise.all([
		queryRowsOrEmpty<Location>(
			'body pro správu značek',
			sql<Location[]>`
				SELECT
					marker.id,
					marker.display_name,
					marker.floor,
					marker.can_nav,
					marker.icon,
					marker.building_location,
					icon.position
				FROM markers AS marker
				LEFT JOIN icons AS icon ON marker.icon = icon.id
				ORDER BY icon.position, marker.floor, marker.display_name
			`
		),
		queryRowsOrEmpty<MarkerIconRow>(
			'ikony pro správu značek',
			sql<MarkerIconRow[]>`
				SELECT id, image, display_name
				FROM icons
				ORDER BY position
			`
		)
	]);
	const iconList: MarkerIconChoice[] = icons.map(({ id, image, display_name }) => ({
		name: id,
		image,
		displayname: display_name
	}));

	return {
		markers,
		iconList
	};
};
