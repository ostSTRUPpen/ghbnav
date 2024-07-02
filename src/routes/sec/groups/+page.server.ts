export async function load({ locals }) {
	const { sql } = locals;

	let icons;
	try {
		icons = await sql`SELECT id, display_name, image, position FROM icons ORDER BY position ASC;`;
	} catch (error) {
		console.error(error);
	}
	const iconIdImageName = [];
	for (const icon of icons ?? []) {
		iconIdImageName.push({
			id: icon.id,
			image: icon.image,
			display_name: icon.display_name
		});
	}

	return {
		items: icons ?? [],
		iconIdImageName: iconIdImageName ?? []
	};
}
