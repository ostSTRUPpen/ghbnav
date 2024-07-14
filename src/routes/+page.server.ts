import { staticSettings } from '$lib/data/staticData.js';

export async function load({ setHeaders, locals }) {
	setHeaders({
		'Cache-Control': `max-age=${60}, s-maxage=${60}`
	});

	const { sql } = locals;

	let markers;
	try {
		markers = await sql`SELECT markers.id, markers.display_name, floor, can_nav, icon, building_location, icons.position 
	FROM markers
	LEFT JOIN icons ON markers.icon = icons.id
	WHERE can_nav = true 
	ORDER BY position ASC, floor ASC, display_name ASC;`;
	} catch (error) {
		console.error(error);
	}

	let stored_paths;
	const stored_paths_with_names = [];
	if (staticSettings.storeDynamicPaths) {
		try {
			stored_paths = await sql`SELECT id, start_node, end_node, count, hidden FROM stored_paths WHERE hidden = false ORDER BY count DESC LIMIT 5;`;
		} catch (error) {
			console.error(error);
		}

		for (const path of stored_paths ?? []) {
			stored_paths_with_names.push({
				start_node: path.start_node,
				end_node: path.end_node,
				count: path.count,
				hidden: path.hidden,
				start_name: markers?.find((obj) => obj.id === path.start_node)?.display_name,
				end_name: markers?.find((obj) => obj.id === path.end_node)?.display_name
			});
		}
	}

	let preset_paths;
	try {
		preset_paths = await sql`SELECT id, start_node, end_node, position, hidden FROM preset_paths WHERE hidden = false ORDER BY position ASC LIMIT 5;`;
	} catch (error) {
		console.error(error);
	}

	const preset_paths_with_names = [];
	for (const path of preset_paths ?? []) {
		preset_paths_with_names.push({
			id: path.id,
			start_node: path.start_node,
			end_node: path.end_node,
			hidden: path.hidden,
			start_name: markers?.find((obj) => obj.id === path.start_node)?.display_name,
			end_name: markers?.find((obj) => obj.id === path.end_node)?.display_name
		});
	}

	let icons;
	try {
		icons = await sql`SELECT id, display_name FROM icons ORDER BY position ASC;`;
	} catch (error) {
		console.error(error);
	}

	const iconImageDisplayNames = new Object();
	for (const icon of icons ?? []) {
		iconImageDisplayNames[icon.id as keyof typeof iconImageDisplayNames] = icon.display_name;
	}

	return {
		locations: markers ?? [],
		stored_paths: stored_paths_with_names ?? [],
		preset_paths: preset_paths_with_names ?? [],
		iconImageDisplayNames: iconImageDisplayNames ?? []
	};
}
