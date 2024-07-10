import { staticSettings } from "$lib/data/staticData";

export async function POST({ request, locals: { sql } }): Promise<Response> {
	if (!staticSettings.storeDynamicPaths) {
		return new Response(
			JSON.stringify({
				message: 'Ukládání cest bylo zakázáno!',
				code: '201'
			}),
			{ status: 201 }
		);
	}
	const { startNode, endNode, path } = await request.json();
	try {
		let canSave = true;
		let canUpdateCount = false;
		let UpdateCountRowID = '';
		let UpdateCountCountValue = 0;
		if (startNode && endNode && path.length > 1) {
			const stored_paths = await sql`SELECT id, starting_and_ending_point, count FROM stored_paths;`;
			if (stored_paths !== null) {
				for (const stored_path of stored_paths) {
					if (stored_path.starting_and_ending_point === `${startNode}-${endNode}`) {
						canSave = false;
						canUpdateCount = true;
						UpdateCountRowID = stored_path.id;
						UpdateCountCountValue = stored_path.count;
					}
				}
			}
			if (canSave && !canUpdateCount) {
				await sql`INSERT INTO stored_paths (start_node, end_node, starting_and_ending_point, hidden, count) VALUES (${startNode}, ${endNode}, ${`${startNode}-${endNode}`}, false, 1); `
			} else if (!canSave && canUpdateCount) {
				UpdateCountCountValue++;
				await sql`UPDATE stored_paths SET count = ${UpdateCountCountValue} WHERE id = ${UpdateCountRowID};`;
			}
		} else {
			return new Response(
				JSON.stringify({ message: 'Chybí potřebné údaje. Zkuste to prosím znovu', code: '400' }),
				{
					status: 400
				}
			);
		}
		return new Response(
			JSON.stringify({
				message: 'Uložené cesty, úspěšně upraveny!',
				code: '201'
			}),
			{ status: 201 }
		);
		// FIXME ts
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		const errMessage = error.message
			? error.message
			: 'Při úpravě uložených cest došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
}

export async function PATCH({ request, locals: { sql } }): Promise<Response> {
	const { id, hidden } = await request.json();
	try {
		await sql`UPDATE stored_paths SET hidden = ${hidden} WHERE id = ${id}`;

		return new Response(
			JSON.stringify({
				message: `Cesta započtena!`,
				code: 201
			}),
			{ status: 201 }
		);


		// FIXME ts
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		const errMessage = error.message
			? error.message
			: 'Při zápočtu cesty došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
}

export async function DELETE({ request, locals: { sql } }): Promise<Response> {
	const { id } = await request.json();

	try {
		await sql`DELETE FROM stored_paths WHERE id = ${id};`;

		return new Response(
			JSON.stringify({
				message: `Cesta smazána!`,
				code: '200'
			}),
			{ status: 200 }
		);

		// FIXME ts
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		const errMessage = error.message
			? error.message
			: 'Při mazání cesty došlo k chybě! Zkuste to prosím později';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
}
