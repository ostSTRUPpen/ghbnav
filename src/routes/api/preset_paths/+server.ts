import { redirect } from '@sveltejs/kit';

export async function PATCH({ request, locals: { supabase, getSession } }): Promise<Response> {
	const session = await getSession();
	if (!session) {
		throw redirect(303, '/');
	}
	const { id, start_node, end_node, hidden } = await request.json();
	try {
		const { error } = await supabase
			// RLS error FIXME
			// Pokud vypnu RLS, tak vše funguje, jak má
			// Pokud zapnu RLS, tak i když je UPDATE public, tak to nefunguje
			.from('preset_paths')
			.update({ hidden: hidden, start_node: start_node, end_node: end_node })
			.eq('id', id)
			.select();
		if (error) {
			console.error(error);
			return new Response(JSON.stringify({ message: error.message }), {
				status: Number(error.code)
			});
		} else {
			return new Response(
				JSON.stringify({
					message: `Path updated successfully`,
					success: true
				}),
				{ status: 201 }
			);
		}

		// FIXME ts
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		const errMessage = error.message
			? error.message
			: 'An error has occurred while deleting stored path';
		return new Response(JSON.stringify({ message: errMessage }), {
			status: 400
		});
	}
}
