export async function PATCH({ request, locals: { sql } }): Promise<Response> {
	const { id, start_node, end_node, hidden } = await request.json();
	try {
		await sql`UPDATE preset_paths SET hidden = ${hidden}, start_node = ${start_node}, end_node = ${end_node} WHERE id = ${id}`;

		return new Response(
			JSON.stringify({
				message: `Cesta upravena!`,
				code: '200'
			}),
			{ status: 200 }
		);
	} catch (error: any) {
		console.error(error)
		const errMessage = error.message
			? error.message
			: 'Při úpravě cesty došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
}
