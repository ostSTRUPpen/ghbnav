export async function load({ locals }) {
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
	try {
		stored_paths = await sql`SELECT id, start_node, end_node, count, hidden FROM stored_paths ORDER BY count DESC;`;
	} catch (error) {
		console.error(error);
	}

	const stored_paths_with_names = [];
	for (const path of stored_paths ?? []) {
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

	return {
		stored_paths: stored_paths_with_names ?? []
	};
}
