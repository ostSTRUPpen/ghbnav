import { staticSettings } from '$lib/data/staticData.js';
import { supabase as unAuthenticatedSupabase } from '$lib/supabaseClient.js';
import { redirect, type RequestEvent } from '@sveltejs/kit';

export async function POST(requestEvent: RequestEvent): Promise<Response> {
	if (!staticSettings.storeDynamicPaths) {
		return new Response(
			JSON.stringify({
				message: 'Ukládání cest bylo zakázáno!',
				code: '201'
			}),
			{ status: 201 }
		);
	}
	const { request } = requestEvent;
	const { startNode, endNode, path } = await request.json();
	try {
		let canSave = true;
		let canUpdateCount = false;
		let UpdateCountRowID = '';
		let UpdateCountCountValue = 0;
		if (startNode && endNode && path.length > 1) {
			const { data: stored_paths } = await unAuthenticatedSupabase
				.from('stored_paths')
				.select('id, starting_and_ending_point, count');
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
				const { error } = await unAuthenticatedSupabase
					.from('stored_paths')
					.insert([
						{
							start_node: startNode,
							end_node: endNode,
							starting_and_ending_point: `${startNode}-${endNode}`,
							hidden: false,
							count: 1
						}
					])
					.select();
				if (error) {
					console.error(
						`Error: ${error.code} v dynamic_paths.\n ${error.message}\n---END OF ERROR---`
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
			} else if (!canSave && canUpdateCount) {
				UpdateCountCountValue++;
				const { error } = await unAuthenticatedSupabase
					.from('stored_paths')
					.update({ count: UpdateCountCountValue })
					.eq('id', UpdateCountRowID)
					.select();
				if (error) {
					console.error(
						`Error: ${error.code} v dynamic_paths.\n ${error.message}\n---END OF ERROR---`
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

export async function PATCH({ request, locals: { supabase, getSession } }): Promise<Response> {
	const session = await getSession();
	if (!session) {
		throw redirect(303, '/');
	}
	const { id, hidden } = await request.json();
	try {
		const { error } = await supabase
			.from('stored_paths')
			.update({ hidden: hidden })
			.eq('id', id)
			.select();

		if (error) {
			console.error(`Error: ${error.code} v dynamic_paths.\n ${error.message}\n---END OF ERROR---`);
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
					message: `Cesta započtena!`,
					code: 201
				}),
				{ status: 201 }
			);
		}

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

export async function DELETE({ request, locals: { supabase, getSession } }): Promise<Response> {
	const session = await getSession();
	if (!session) {
		throw redirect(303, '/');
	}
	const { id } = await request.json();

	try {
		const { error } = await supabase.from('stored_paths').delete().eq('id', id);

		if (error) {
			console.error(`Error: ${error.code} v dynamic_paths.\n ${error.message}\n---END OF ERROR---`);
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
					message: `Cesta smazána!`,
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
			: 'Při mazání cesty došlo k chybě! Zkuste to prosím později';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
}
