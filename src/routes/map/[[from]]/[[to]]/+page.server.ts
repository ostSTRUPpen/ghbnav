import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data } = await supabase.from('markers').select('*').order('floor', { ascending: true });

	return {
		markers: data ?? []
	};
}
