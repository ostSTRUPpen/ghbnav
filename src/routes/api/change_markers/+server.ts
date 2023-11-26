import { redirect } from '@sveltejs/kit';

export async function PATCH({ request, locals: { supabase, getSession } }): Promise<Response> {
	const session = await getSession();
	if (!session) {
		throw redirect(303, '/');
	}
	const { changedEndingPoints } = await request.json();

	try {
		for (const changedEndingPoint of changedEndingPoints) {
			const { error } = await supabase
				.from('markers')
				.update({
					display_name: changedEndingPoint.display_name,
					icon: changedEndingPoint.icon,
					can_nav: changedEndingPoint.can_nav
				})
				.eq('id', changedEndingPoint.id);
			if (error) {
				console.error(
					`Error: ${error.code} v change_markers.\n ${error.message}\n---END OF ERROR---`
				);
				return new Response(
					JSON.stringify({
						message: 'Databáze odmítla požadavek! Zkuste to prosím později.',
						code: error.code
					}),
					{
						status: Number(error.code)
					}
				);
			}
		}

		return new Response(
			JSON.stringify({
				message: 'Značky úspěšně upraveny!',
				code: '201'
			}),
			{ status: 201 }
		);
		// FIXME ts
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		const errMessage = error.message
			? error.message
			: 'Při úpravě značek došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage }), {
			status: 400
		});
	}
}
