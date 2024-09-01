export async function PATCH({ request, locals: { sql } }): Promise<Response> {
	const { changedEndingPoints } = await request.json();

	try {
		for (const changedEndingPoint of changedEndingPoints) {
			await sql`UPDATE markers SET display_name = ${changedEndingPoint.display_name}, icon = ${changedEndingPoint.icon}, can_nav = ${changedEndingPoint.can_nav}, building_location = ${changedEndingPoint.building_location} WHERE id = ${changedEndingPoint.id};`;
		}

		return new Response(
			JSON.stringify({
				message: 'Značky úspěšně upraveny!',
				code: '201'
			}),
			{ status: 201 }
		);
	} catch (error: any) {
		const errMessage = error.message
			? error.message
			: 'Při úpravě značek došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage }), {
			status: 400
		});
	}
}
