import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data } = await supabase.from('markers').select('id, display_name');

	//console.log(data);
	return {
		endingPoints: data ?? []
	};
}
