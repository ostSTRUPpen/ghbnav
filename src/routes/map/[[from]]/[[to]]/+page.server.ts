import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data } = await supabase.from('markers').select("*");

	//console.log(data);
	return {
		markers: data ?? []
	};
}
