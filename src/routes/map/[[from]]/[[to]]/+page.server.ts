import { supabase } from '$lib/supabaseClient';

async function getMarkers() {
	const { data, error } = await supabase
		.from('markers')
		.select('*')
		.order('floor', { ascending: true });
	if (error) console.log(error);
	return data;
}
async function getNavMarkers() {
	const { data, error } = await supabase
		.from('nav_markers')
		.select('*')
		.order('floor', { ascending: true })
		.order('id', { ascending: true });
	if (error) console.log(error);
	return data;
}

export async function load() {
	return {
		markers: (await getMarkers()) ?? [],
		nav_markers: (await getNavMarkers()) ?? []
	};
}
