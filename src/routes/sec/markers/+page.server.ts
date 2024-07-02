export async function load({ locals }) {
	const { sql } = locals;
	let markers;
	try {
		markers = await sql`SELECT markers.id, markers.display_name, floor, can_nav, icon, building_location, icons.position 
	FROM markers
	LEFT JOIN icons ON markers.icon = icons.id
	ORDER BY position ASC, floor ASC, display_name ASC;`;
	} catch (error) {
		console.error(error);
	}

	let icons;
	try {
		icons = await sql`SELECT id, image, display_name FROM icons ORDER BY position ASC;`;
	} catch (error) {
		console.error(error);
	}

	const iconList = [];
	for (const icon of icons ?? []) {
		iconList.push({
			name: icon.id,
			image: icon.image as string,
			displayname: icon.display_name
		});
	}
	return {
		markers: markers ?? [],
		iconList: iconList ?? []
	};
}
