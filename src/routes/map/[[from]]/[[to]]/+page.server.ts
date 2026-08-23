import { queryRowsOrEmpty } from '$lib/server/queryRows';
import { setPublicNavigationCacheHeaders } from '$lib/server/publicNavigationCache';
import type {
	IconDisplayNames,
	LocationMarker,
	MarkerIconDefinition,
	NavigationMarker
} from '$lib/types/navigation';
import type { PageServerLoad } from './$types';

interface IconRow extends MarkerIconDefinition {
	display_name: string;
}

export const load: PageServerLoad = async ({ request, setHeaders, locals: { sql } }) => {
	setPublicNavigationCacheHeaders({ request, setHeaders });

	const [markers, navigationMarkers, icons] = await Promise.all([
		queryRowsOrEmpty<LocationMarker>(
			'body mapy',
			sql<LocationMarker[]>`
				SELECT
					marker.id,
					marker.display_name,
					marker.x::double precision AS x,
					marker.y::double precision AS y,
					marker.floor,
					marker.can_nav,
					marker.icon,
					marker.building_location
				FROM markers AS marker
				LEFT JOIN icons AS icon ON icon.id = marker.icon
				ORDER BY icon.position, marker.floor, marker.display_name
			`
		),
		queryRowsOrEmpty<NavigationMarker>(
			'navigační graf',
			sql<NavigationMarker[]>`
				SELECT
					id,
					x::double precision AS x,
					y::double precision AS y,
					floor,
					connected,
					special_type
				FROM nav_markers
				ORDER BY floor, id
			`
		),
		queryRowsOrEmpty<IconRow>(
			'ikony mapy',
			sql<IconRow[]>`SELECT id, display_name, image FROM icons ORDER BY position`
		)
	]);

	const iconImageDisplayNames: IconDisplayNames = Object.fromEntries(
		icons.map((icon) => [icon.id, icon.display_name])
	);
	const iconIdImage: MarkerIconDefinition[] = icons.map(({ id, image }) => ({ id, image }));

	return {
		markers,
		nav_markers: navigationMarkers,
		iconImageDisplayNames,
		iconIdImage
	};
};
