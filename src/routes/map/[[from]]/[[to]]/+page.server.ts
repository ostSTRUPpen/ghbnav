import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data: markers, error } = await supabase
		.from('markers')
		.select('id, x, y, display_name, floor, icon, can_nav')
		.order('icon', { ascending: true })
		.order('floor', { ascending: true });
	if (error) console.log(error);
	const { data: nav_markers, error: navError } = await supabase
		.from('nav_markers')
		.select('id, x, y, floor, connected, special_type')
		.order('floor', { ascending: true })
		.order('id', { ascending: true });
	if (navError) console.log(navError);

	return {
		markers: markers ?? [],
		nav_markers: nav_markers ?? []
	};
}
