import { supabase } from '$lib/supabaseClient';

export async function load({ locals: { getSession } }) {
	const { data: markers, error: markers_error } = await supabase
		.from('markers')
		.select('id, display_name, floor, can_nav, icon')
		.order('icon', { ascending: true })
		.order('floor', { ascending: true });
	if (markers_error) console.log(markers_error);
	const { data: stored_paths, error: path_error } = await supabase
		.from('stored_paths')
		.select('start_node, end_node, count')
		.order('count', { ascending: false })
		.limit(5);
	console.log(stored_paths);
	if (path_error) console.log(path_error);

	const stored_paths_with_names = [];

	for (const path of stored_paths ?? []) {
		stored_paths_with_names.push({
			start_node: path.start_node,
			end_node: path.end_node,
			count: path.count,
			start_name: markers?.find((obj) => obj.id === path.start_node)?.display_name,
			end_name: markers?.find((obj) => obj.id === path.end_node)?.display_name
		});
	}

	return {
		locations: markers ?? [],
		stored_paths: stored_paths_with_names ?? [],
		session: getSession()
	};
}
