import { supabase } from '$lib/supabaseClient';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(requestEvent: RequestEvent) {
	const { params } = requestEvent;
	const { neededData } = params;
	const { data: icons, error } = await supabase.from('icons').select(neededData);
	if (error) console.error(error);
	return new Response(JSON.stringify(icons ?? []));
}
