import type {
	IconDisplayNames,
	LocationMarker,
	MarkerIconDefinition,
	NavigationMarker
} from '$lib/types/navigation';

export async function load({ setHeaders, locals }) {
	setHeaders({
		'Cache-Control': `max-age=${60}, s-maxage=${60}`
	});
	const { sql } = locals;

	let markers: LocationMarker[] = [];
	try {
		markers =
			(await sql`SELECT markers.id, markers.display_name, x, y, floor, can_nav, icon, building_location, icons.position
	FROM markers
	LEFT JOIN icons ON markers.icon = icons.id
	ORDER BY position ASC, floor ASC, display_name ASC;`) as unknown as LocationMarker[];
	} catch (error) {
		console.error(error);
	}

	let nav_markers: NavigationMarker[] = [];
	try {
		nav_markers =
			(await sql`SELECT nav_markers.id, x, y, floor, connected, special_type FROM nav_markers ORDER BY floor ASC, id ASC;`) as unknown as NavigationMarker[];
	} catch (error) {
		console.error(error);
	}

	let icons;
	try {
		icons = await sql`SELECT id, display_name, image FROM icons ORDER BY position ASC;`;
	} catch (error) {
		console.error(error);
	}

	const iconImageDisplayNames: IconDisplayNames = {};
	for (const icon of icons ?? []) {
		iconImageDisplayNames[String(icon.id)] = String(icon.display_name);
	}
	const iconIdImage: MarkerIconDefinition[] = [];
	for (const icon of icons ?? []) {
		iconIdImage.push({
			id: icon.id,
			image: icon.image
		});
	}

	return {
		markers,
		nav_markers,
		iconImageDisplayNames,
		iconIdImage
	};
}
