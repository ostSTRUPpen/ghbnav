import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data } = await supabase
		.from('markers')
		.select('id, display_name, floor, icon, can_nav')
		.order('floor', { ascending: true });

	return {
		endingPoints: data ?? []
	};
}
