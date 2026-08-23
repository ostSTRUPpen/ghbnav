import { staticSettings } from '$lib/data/staticData.js';
import { queryRowsOrEmpty } from '$lib/server/queryRows';
import type { PresetPath, StoredPath } from '$lib/types/admin';
import type { IconDisplayNames, Location } from '$lib/types/navigation';
import type { PageServerLoad } from './$types';

interface IconRow {
	id: string;
	display_name: string;
}

function addPathNames<T extends PresetPath | StoredPath>(
	paths: T[],
	markerNames: Map<string, string>
): T[] {
	return paths.map((path) => ({
		...path,
		start_name: markerNames.get(path.start_node),
		end_name: markerNames.get(path.end_node)
	}));
}

export const load: PageServerLoad = async ({ locals: { sql } }) => {
	const visibleStoredPathsPromise = staticSettings.storeDynamicPaths
		? queryRowsOrEmpty<StoredPath>(
				'viditelné uložené cesty',
				sql<StoredPath[]>`
					SELECT id, start_node, end_node, count::double precision AS count, hidden
					FROM stored_paths
					WHERE hidden = false
					ORDER BY count DESC
					LIMIT 5
				`
			)
		: Promise.resolve([]);
	const hiddenStoredPathsPromise = staticSettings.storeDynamicPaths
		? queryRowsOrEmpty<StoredPath>(
				'skryté uložené cesty',
				sql<StoredPath[]>`
					SELECT id, start_node, end_node, count::double precision AS count, hidden
					FROM stored_paths
					WHERE hidden = true
					ORDER BY count DESC
					LIMIT 50
				`
			)
		: Promise.resolve([]);

	const [markers, visibleStoredPaths, hiddenStoredPaths, presetPaths, icons] = await Promise.all([
		queryRowsOrEmpty<Location>(
			'body pro správu cest',
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
		visibleStoredPathsPromise,
		hiddenStoredPathsPromise,
		queryRowsOrEmpty<PresetPath>(
			'přednastavené cesty pro správu',
			sql<PresetPath[]>`
				SELECT id, start_node, end_node, position, hidden
				FROM preset_paths
				ORDER BY position
				LIMIT 5
			`
		),
		queryRowsOrEmpty<IconRow>(
			'ikony pro správu cest',
			sql<IconRow[]>`SELECT id, display_name FROM icons ORDER BY position`
		)
	]);

	const markerNames = new Map(markers.map((marker) => [marker.id, marker.display_name]));
	const storedPaths = addPathNames([...visibleStoredPaths, ...hiddenStoredPaths], markerNames);
	const presetPathsWithNames = addPathNames(presetPaths, markerNames);
	const iconImageDisplayNames: IconDisplayNames = Object.fromEntries(
		icons.map((icon) => [icon.id, icon.display_name])
	);

	return {
		locations: markers,
		stored_paths: storedPaths,
		preset_paths: presetPathsWithNames,
		iconImageDisplayNames
	};
};
