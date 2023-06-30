import { supabase } from '$lib/supabaseClient';
import type { LayoutServerLoad } from './$types';

export async function load({ locals: { getSession } }) {
	const { data } = await supabase
		.from('markers')
		.select('id, display_name, floor')
		.order('floor', { ascending: true });

	return {
		endingPoints: data ?? [],
		session: getSession()
	};
}
