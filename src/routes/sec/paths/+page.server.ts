import { staticSettings } from '$lib/data/staticData.js';
import type { IconDisplayNames, Location } from '$lib/types/navigation';

export async function load({ locals }) {
	const { sql } = locals;
	let markers: Location[] = [];
	try {
		markers =
			(await sql`SELECT markers.id, markers.display_name, floor, can_nav, icon, building_location, icons.position
	FROM markers
	LEFT JOIN icons ON markers.icon = icons.id
	ORDER BY position ASC, floor ASC, display_name ASC;`) as unknown as Location[];
	} catch (error) {
		console.error(error);
	}

	//Ukládané cesty
	const stored_paths_with_names = [];
	if (staticSettings.storeDynamicPaths) {
		let stored_visible_paths;
		let stored_hidden_paths;
		try {
			stored_visible_paths =
				await sql`SELECT id, start_node, end_node, count, hidden FROM stored_paths WHERE hidden = false ORDER BY count DESC LIMIT 5;`;
		} catch (error) {
			console.error(error);
		}

		try {
			stored_hidden_paths =
				await sql`SELECT id, start_node, end_node, count, hidden FROM stored_paths WHERE hidden = true ORDER BY count DESC LIMIT 50;`;
		} catch (error) {
			console.error(error);
		}

		for (const path of stored_visible_paths ?? []) {
			stored_paths_with_names.push({
				id: path.id,
				start_node: path.start_node,
				end_node: path.end_node,
				count: path.count,
				hidden: path.hidden,
				start_name: markers?.find((obj) => obj.id === path.start_node)?.display_name,
				end_name: markers?.find((obj) => obj.id === path.end_node)?.display_name
			});
		}
		for (const path of stored_hidden_paths ?? []) {
			stored_paths_with_names.push({
				id: path.id,
				start_node: path.start_node,
				end_node: path.end_node,
				count: path.count,
				hidden: path.hidden,
				start_name: markers?.find((obj) => obj.id === path.start_node)?.display_name,
				end_name: markers?.find((obj) => obj.id === path.end_node)?.display_name
			});
		}
	}

	//Přednastavené cesty
	let preset_paths;
	try {
		preset_paths =
			await sql`SELECT id, start_node, end_node, position, hidden FROM preset_paths ORDER BY position ASC LIMIT 5;`;
	} catch (error) {
		console.error(error);
	}

	const preset_paths_with_names = [];
	for (const path of preset_paths ?? []) {
		preset_paths_with_names.push({
			id: path.id,
			start_node: path.start_node,
			end_node: path.end_node,
			position: path.position,
			hidden: path.hidden,
			start_name: markers?.find((obj) => obj.id === path.start_node)?.display_name,
			end_name: markers?.find((obj) => obj.id === path.end_node)?.display_name
		});
	}

	//Ikony
	let icons;
	try {
		icons = await sql`SELECT id, display_name FROM icons ORDER BY position ASC;`;
	} catch (error) {
		console.error(error);
	}

	const iconImageDisplayNames: IconDisplayNames = {};
	for (const icon of icons ?? []) {
		iconImageDisplayNames[String(icon.id)] = String(icon.display_name);
	}

	return {
		locations: markers,
		stored_paths: stored_paths_with_names ?? [],
		preset_paths: preset_paths_with_names ?? [],
		iconImageDisplayNames
	};
}
