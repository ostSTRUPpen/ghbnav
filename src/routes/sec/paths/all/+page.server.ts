import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data: markers, error: markers_error } = await supabase
		.from('markers')
		.select('id, display_name, can_nav, building_location, icon, floor, icons(position)')
		.eq('can_nav', true)
		.order('icons (position)', { ascending: true })
		.order('floor', { ascending: true })
		.order('display_name', { ascending: true });

	if (markers_error) console.error(markers_error);

	const { data: stored_paths, error: stored_paths_error } = await supabase
		.from('stored_paths')
		.select('id, start_node, end_node, count, hidden')
		.order('count', { ascending: false });
	if (stored_paths_error) console.error(stored_paths_error);

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
