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
			console.error(error);
			return new Response(JSON.stringify({ message: error.message }), {
				status: Number(error.code)
			});
		} else {
			return new Response(
				JSON.stringify({
					message: `Icon updated successfully`,
					success: true
				}),
				{ status: 201 }
			);
		}

		// FIXME ts
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		const errMessage = error.message ? error.message : 'An error has occurred while updating icon';
		return new Response(JSON.stringify({ message: errMessage }), {
			status: 400
		});
	}
}
