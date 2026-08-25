import { queryRowsOrEmpty } from '$lib/server/queryRows';
import type { IconChoice, IconGroup } from '$lib/types/admin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { sql } }) => {
	const icons = await queryRowsOrEmpty<IconGroup>(
		'skupiny značek',
		sql<IconGroup[]>`
			SELECT id, display_name, image, position
			FROM icons
			ORDER BY position
		`
	);
	const iconIdImageName: IconChoice[] = icons.map(({ id, image, display_name }) => ({
		id,
		image,
		display_name
	}));

	return {
		items: icons,
		iconIdImageName
	};
};
