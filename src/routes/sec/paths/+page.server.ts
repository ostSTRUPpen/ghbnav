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

	//Ukládané cesty
	const { data: stored_visible_paths, error: stored_visible_paths_error } = await supabase
		.from('stored_paths')
		.select('id, start_node, end_node, count, hidden')
		.eq('hidden', false)
		.order('count', { ascending: false })
		.limit(5);
	if (stored_visible_paths_error) console.error(stored_visible_paths_error);

	const { data: stored_hidden_paths, error: stored_hidden_paths_error } = await supabase
		.from('stored_paths')
		.select('id, start_node, end_node, count, hidden')
		.eq('hidden', true)
		.order('count', { ascending: false })
		.limit(50);
	if (stored_hidden_paths_error) console.error(stored_hidden_paths_error);

	const stored_paths_with_names = [];
	for (const path of stored_visible_paths ?? []) {
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
	for (const path of stored_hidden_paths ?? []) {
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

	//Přednastavené cesty
	const { data: preset_paths, error: preset_path_error } = await supabase
		.from('preset_paths')
		.select('id, start_node, end_node, position, hidden')
		.order('position', { ascending: true })
		.limit(5);
	if (preset_path_error) console.error(preset_path_error);

	const preset_paths_with_names = [];
	for (const path of preset_paths ?? []) {
		preset_paths_with_names.push({
			id: path.id,
			start_node: path.start_node,
			end_node: path.end_node,
			position: path.position,
			hidden: path.hidden,
			start_name: markers?.find((obj) => obj.id === path.start_node)?.display_name,
			end_name: markers?.find((obj) => obj.id === path.end_node)?.display_name
		});
	}

	//Ikony
	const { data: icons, error: iconError } = await supabase
		.from('icons')
		.select('id, display_name')
		.order('position', { ascending: true });
	if (iconError) console.error(iconError);

	const iconImageDisplayNames = new Object();
	for (const icon of icons ?? []) {
		iconImageDisplayNames[icon.id as keyof typeof iconImageDisplayNames] = icon.display_name;
	}

	return {
		locations: markers ?? [],
		stored_paths: stored_paths_with_names ?? [],
		preset_paths: preset_paths_with_names ?? [],
		iconImageDisplayNames: iconImageDisplayNames ?? []
	};
}
