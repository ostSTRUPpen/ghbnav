import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data: icons, error: iconError } = await supabase
		.from('icons')
		.select('id, display_name, image, position')
		.order('position', { ascending: true });
	if (iconError) console.error(iconError);

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
