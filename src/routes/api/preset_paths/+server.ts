import { redirect } from '@sveltejs/kit';

export async function PATCH({ request, locals: { supabase, getSession } }): Promise<Response> {
	const session = await getSession();
	if (!session) {
		throw redirect(303, '/');
	}
	const { id, start_node, end_node, hidden } = await request.json();
	try {
		const { error } = await supabase
			.from('preset_paths')
			.update({ hidden: hidden, start_node: start_node, end_node: end_node })
			.eq('id', id)
			.select();
		if (error) {
			console.error(`Error: ${error.code} v preset_paths.\n ${error.message}\n---END OF ERROR---`);
			return new Response(
				JSON.stringify({
					message: 'Databáze odmítla požadavek! Zkuste to prosím později.',
					code: error.code
				}),
				{
					status: Number(error.code)
				}
			);
		} else {
			return new Response(
				JSON.stringify({
					message: `Cesta upravena!`,
					code: '200'
				}),
				{ status: 200 }
			);
		}

		// FIXME ts
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		const errMessage = error.message
			? error.message
			: 'Při úpravě cesty došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
}
