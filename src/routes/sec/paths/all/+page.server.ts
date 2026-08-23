import { queryRowsOrEmpty } from '$lib/server/queryRows';
import type { StoredPath } from '$lib/types/admin';
import type { Location } from '$lib/types/navigation';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { sql } }) => {
	const [markers, storedPaths] = await Promise.all([
		queryRowsOrEmpty<Location>(
			'body pro přehled uložených cest',
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
				WHERE marker.can_nav = true
				ORDER BY icon.position, marker.floor, marker.display_name
			`
		),
		queryRowsOrEmpty<StoredPath>(
			'uložené cesty',
			sql<StoredPath[]>`
				SELECT id, start_node, end_node, count::double precision AS count, hidden
				FROM stored_paths
				ORDER BY count DESC
			`
		)
	]);
	const markerNames = new Map(markers.map((marker) => [marker.id, marker.display_name]));
	const storedPathsWithNames: StoredPath[] = storedPaths.map((path) => ({
		...path,
		start_name: markerNames.get(path.start_node),
		end_name: markerNames.get(path.end_node)
	}));

	return {
		stored_paths: storedPathsWithNames
	};
};
