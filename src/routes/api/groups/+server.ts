import { redirect } from '@sveltejs/kit';

export async function PATCH({ request, locals: { supabase, getSession } }): Promise<Response> {
	const session = await getSession();
	if (!session) {
		throw redirect(303, '/');
	}
	const { id, display_name, image, position } = await request.json();
	try {
		const { error } = await supabase
			.from('icons')
			.update({ display_name: display_name, image: image, position: position })
			.eq('id', id)
			.select();
		if (error) {
			console.error(`Error: ${error.code} v groups.\n ${error.message}\n---END OF ERROR---`);
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
					message: `Skupina upravena!`,
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
			: 'Při úpravě ikony došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
}
