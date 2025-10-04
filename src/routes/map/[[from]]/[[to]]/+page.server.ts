export async function load({ setHeaders, locals }) {
	setHeaders({
		'Cache-Control': `max-age=${60}, s-maxage=${60}`
	});
	const { sql } = locals;

	let markers;
	try {
		markers =
			await sql`SELECT markers.id, markers.display_name, x, y, floor, can_nav, icon, building_location, icons.position 
	FROM markers
	LEFT JOIN icons ON markers.icon = icons.id
	ORDER BY position ASC, floor ASC, display_name ASC;`;
	} catch (error) {
		console.error(error);
	}

	let nav_markers;
	try {
		nav_markers =
			await sql`SELECT nav_markers.id, x, y, floor, connected, special_type FROM nav_markers ORDER BY floor ASC, id ASC;`;
	} catch (error) {
		console.error(error);
	}

	let icons;
	try {
		icons = await sql`SELECT id, display_name, image FROM icons ORDER BY position ASC;`;
	} catch (error) {
		console.error(error);
	}

	const iconImageDisplayNames = new Object();
	for (const icon of icons ?? []) {
		iconImageDisplayNames[icon.id as keyof typeof iconImageDisplayNames] = icon.display_name;
	}
	const iconIdImage = [];
	for (const icon of icons ?? []) {
		iconIdImage.push({
			id: icon.id,
			image: icon.image
		});
	}

	return {
		markers: markers ?? [],
		nav_markers: nav_markers ?? [],
		iconImageDisplayNames: iconImageDisplayNames ?? [],
		iconIdImage: iconIdImage ?? []
	};
}
