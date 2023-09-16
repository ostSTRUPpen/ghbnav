import { supabase } from '$lib/supabaseClient';

export async function load({ locals: { getSession } }) {
	const { data } = await supabase
		.from('markers')
		.select('id, display_name, floor, can_nav')
		.order('floor', { ascending: true });

	return {
		locations: data ?? [],
		session: getSession()
	};
}
