import { staticSettings } from '$lib/data/staticData.js';
import { queryRowsOrEmpty } from '$lib/server/queryRows';
import type { IconDisplayNames, Location, PublicPath } from '$lib/types/navigation';
import type { PageServerLoad } from './$types';

interface IconRow {
	id: string;
	display_name: string;
}

export const load: PageServerLoad = async ({ setHeaders, locals: { sql } }) => {
	setHeaders({
		'Cache-Control': `max-age=${60}, s-maxage=${60}`
	});

	const storedPathsPromise = staticSettings.storeDynamicPaths
		? queryRowsOrEmpty<PublicPath>(
				'časté cesty',
				sql<PublicPath[]>`
					SELECT
						path.start_node,
						path.end_node,
						path.count,
						path.hidden,
						start_marker.display_name AS start_name,
						end_marker.display_name AS end_name
					FROM stored_paths AS path
					JOIN markers AS start_marker ON start_marker.id = path.start_node
					JOIN markers AS end_marker ON end_marker.id = path.end_node
					WHERE path.hidden = false
					ORDER BY path.count DESC
					LIMIT 5
				`
			)
		: Promise.resolve([]);

	const [locations, presetPaths, storedPaths, icons] = await Promise.all([
		queryRowsOrEmpty<Location>(
			'navigovatelné body',
			sql<Location[]>`
				SELECT
					marker.id,
					marker.display_name,
					marker.floor,
					marker.can_nav,
					marker.icon,
					marker.building_location
				FROM markers AS marker
				LEFT JOIN icons AS icon ON icon.id = marker.icon
				WHERE marker.can_nav = true
				ORDER BY icon.position, marker.floor, marker.display_name
			`
		),
		queryRowsOrEmpty<PublicPath>(
			'přednastavené cesty',
			sql<PublicPath[]>`
				SELECT
					path.start_node,
					path.end_node,
					path.hidden,
					start_marker.display_name AS start_name,
					end_marker.display_name AS end_name
				FROM preset_paths AS path
				JOIN markers AS start_marker ON start_marker.id = path.start_node
				JOIN markers AS end_marker ON end_marker.id = path.end_node
				WHERE path.hidden = false
				ORDER BY path.position
				LIMIT 5
			`
		),
		storedPathsPromise,
		queryRowsOrEmpty<IconRow>(
			'popisky ikon',
			sql<IconRow[]>`SELECT id, display_name FROM icons ORDER BY position`
		)
	]);

	const iconImageDisplayNames: IconDisplayNames = Object.fromEntries(
		icons.map((icon) => [icon.id, icon.display_name])
	);

	return {
		locations,
		stored_paths: storedPaths,
		preset_paths: presetPaths,
		iconImageDisplayNames
	};
};
