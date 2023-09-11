//import { supabase } from '$lib/supabaseClient.js';
import { redirect } from '@sveltejs/kit';

//FIXME
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export async function PATCH({ request, locals: { supabase, getSession } }): Promise<Response> {
	const session = await getSession();
	if (!session) {
		throw redirect(303, '/');
	}
	const { changedEndingPoints } = await request.json();

	try {
		for (const changedEndingPoint of changedEndingPoints) {
			switch (changedEndingPoint.change) {
				case 'both': {
					const { error } = await supabase
						.from('markers')
						.update({
							display_name: changedEndingPoint.display_name,
							icon: changedEndingPoint.icon
						})
						.eq('id', changedEndingPoint.id);
					if (error) {
						return new Response(JSON.stringify({ message: error.message }), {
							status: Number(error.code)
						});
					}
					break;
				}
				case 'icon': {
					const { error } = await supabase
						.from('markers')
						.update({
							icon: changedEndingPoint.icon
						})
						.eq('id', changedEndingPoint.id)
						.select();
					if (error) {
						return new Response(JSON.stringify({ message: error.message }), {
							status: Number(error.code)
						});
					}
					break;
				}
				case 'display name': {
					const { error } = await supabase
						.from('markers')
						.update({
							display_name: changedEndingPoint.display_name
						})
						.eq('id', changedEndingPoint.id);
					if (error) {
						return new Response(JSON.stringify({ message: error.message }), {
							status: Number(error.code)
						});
					}
					break;
				}
				default: {
					break;
				}
			}
		}
		return new Response(
			JSON.stringify({
				message: 'Markers updated successfully'
			}),
			{ status: 201 }
		);
		// FIXME
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		const errMessage = error.message
			? error.message
			: 'An error has occured while updating the user';
		return new Response(JSON.stringify({ message: errMessage }), {
			status: 400
		});
	}
}
