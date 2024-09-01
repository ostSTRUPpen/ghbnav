export async function PATCH({ request, locals: { sql } }): Promise<Response> {
	const { id, display_name, image, position } = await request.json();
	try {
		await sql`UPDATE icons SET display_name = ${display_name}, image = ${image}, position = ${position} WHERE id = ${id}`;


		return new Response(
			JSON.stringify({
				message: `Skupina upravena!`,
				code: '200'
			}),
			{ status: 200 }
		);
	} catch (error: any) {
		const errMessage = error.message
			? error.message
			: 'Při úpravě ikony došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
}
