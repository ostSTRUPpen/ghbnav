import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data: markers, error } = await supabase
		.from('markers')
		.select('id, x, y, display_name, floor, icon, can_nav, icons(position)')
		.order('icons (position)', { ascending: true })
		.order('floor', { ascending: true })
		.order('display_name', { ascending: true });
	if (error) console.error(error);
	const { data: nav_markers, error: navError } = await supabase
		.from('nav_markers')
		.select('id, x, y, floor, connected, special_type')
		.order('floor', { ascending: true })
		.order('id', { ascending: true });
	if (navError) console.error(navError);

	const { data: icons, error: iconError } = await supabase
		.from('icons')
		.select('id, display_name, image')
		.order('position', { ascending: true });
	if (iconError) console.error(iconError);
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
