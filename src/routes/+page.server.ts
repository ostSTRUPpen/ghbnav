import { supabase } from '$lib/supabaseClient';

export async function load({ setHeaders }) {

    setHeaders({
      'Cache-Control': `max-age=${60}, s-maxage=${60}`,
    })


	const { data: markers, error: markers_error } = await supabase
		.from('markers')
		.select('id, display_name, floor, can_nav, icon, building_location, icons(position)')
        .eq('can_nav', true)
		.order('icons (position)', { ascending: true })
		.order('floor', { ascending: true })
		.order('display_name', { ascending: true });
	if (markers_error) console.error(markers_error);

	const { data: stored_paths, error: path_error } = await supabase
		.from('stored_paths')
		.select('start_node, end_node, count, hidden')
        .eq('hidden', false)
		.order('count', { ascending: false })
		.limit(5);
	if (path_error) console.error(path_error);

	const { data: preset_paths, error: preset_path_error } = await supabase
		.from('preset_paths')
		.select('id, start_node, end_node, hidden')
        .eq('hidden', false)
		.order('position', { ascending: true })
		.limit(5);
	if (preset_path_error) console.error(preset_path_error);

	const stored_paths_with_names = [];

	for (const path of stored_paths ?? []) {
		stored_paths_with_names.push({
			start_node: path.start_node,
			end_node: path.end_node,
			count: path.count,
			hidden: path.hidden,
			start_name: markers?.find((obj) => obj.id === path.start_node)?.display_name,
			end_name: markers?.find((obj) => obj.id === path.end_node)?.display_name
		});
	}

	const preset_paths_with_names = [];
	for (const path of preset_paths ?? []) {
		preset_paths_with_names.push({
			id: path.id,
			start_node: path.start_node,
			end_node: path.end_node,
			hidden: path.hidden,
			start_name: markers?.find((obj) => obj.id === path.start_node)?.display_name,
			end_name: markers?.find((obj) => obj.id === path.end_node)?.display_name
		});
	}

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
