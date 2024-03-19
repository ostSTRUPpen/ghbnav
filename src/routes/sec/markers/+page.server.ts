import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data, error } = await supabase
		.from('markers')
		.select('id, display_name, floor, icon, can_nav, building_location ,icons(position)')
		.order('icons (position)', { ascending: true })
		.order('floor', { ascending: true })
		.order('display_name', { ascending: true });
	if (error) console.error(error);

	const { data: icons, error: iconError } = await supabase
		.from('icons')
		.select('id, image, display_name')
		.order('position', { ascending: true });
	if (iconError) console.error(iconError);
	const iconList = [];
	for (const icon of icons ?? []) {
		iconList.push({
			name: icon.id,
			image: icon.image as string,
			displayname: icon.display_name
		});
	}
	return {
		markers: data ?? [],
		iconList: iconList ?? []
	};
}
/*
export const iconList = [
	// NEW
	{
		name: 'administrace',
		image: administrace,
		displayname: 'Administrace'
	},
	{
		name: 'jazykove_ucebny',
		image: jazykove_ucebny,
		displayname: 'Jazykové učebny'
	},
	{
		name: 'kabinety',
		image: kabinety,
		displayname: 'Kabinety'
	},
	{
		name: 'kmenove_ucebny',
		image: kmenove_ucebny,
		displayname: 'Kmenové učebny'
	},
	{
		name: 'ostatni',
		image: ostatni,
		displayname: 'Ostatní'
	},
	{
		name: 'prostory',
		image: prostory,
		displayname: 'Prostory'
	},
	{
		name: 'sluzby',
		image: sluzby,
		displayname: 'Služby'
	},
	{
		name: 'specializovane_ucebny',
		image: specializovane_ucebny,
		displayname: 'Specializované učebny'
	},
	{
		name: 'telovychova',
		image: telovychova,
		displayname: 'Tělovýchova'
	},
	{
		name: 'zachody',
		image: zachody,
		displayname: 'Záchody'
	}
];
*/
