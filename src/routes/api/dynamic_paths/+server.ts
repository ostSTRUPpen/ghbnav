import { staticSettings } from '$lib/data/staticData';
import { invalidatePublicNavigationCache } from '$lib/server/publicNavigationCache';
import {
	invalidRequestResponse,
	isDatabaseIdentifier,
	readJsonObject
} from '$lib/server/requestValidation';
import type { RequestHandler } from './$types';

interface StoredPathCountRow {
	id: string;
	starting_and_ending_point: string;
	count: number;
}

export const POST: RequestHandler = async ({ request, locals: { sql } }) => {
	if (!staticSettings.storeDynamicPaths) {
		return new Response(
			JSON.stringify({
				message: 'Ukládání cest bylo zakázáno!',
				code: '201'
			}),
			{ status: 201 }
		);
	}
	const body = await readJsonObject(request);
	if (
		!body ||
		typeof body.startNode !== 'string' ||
		typeof body.endNode !== 'string' ||
		!Array.isArray(body.path) ||
		!body.path.every((node): node is string => typeof node === 'string')
	) {
		return invalidRequestResponse();
	}
	const { startNode, endNode, path } = body;
	try {
		let canSave = true;
		let canUpdateCount = false;
		let UpdateCountRowID = '';
		let UpdateCountCountValue = 0;
		if (startNode && endNode && path.length > 1) {
			const stored_paths = await sql<StoredPathCountRow[]>`
				SELECT id, starting_and_ending_point, count::double precision AS count
				FROM stored_paths
			`;
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
				await sql`INSERT INTO stored_paths (start_node, end_node, starting_and_ending_point, hidden, count) VALUES (${startNode}, ${endNode}, ${`${startNode}-${endNode}`}, false, 1); `;
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
	} catch (error) {
		const errMessage =
			error instanceof Error && error.message
				? error.message
				: 'Při úpravě uložených cest došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
};

export const PATCH: RequestHandler = async ({ request, locals: { sql } }) => {
	const body = await readJsonObject(request);
	if (!body || !isDatabaseIdentifier(body.id) || typeof body.hidden !== 'boolean') {
		return invalidRequestResponse();
	}
	const { id, hidden } = body;
	try {
		await sql`UPDATE stored_paths SET hidden = ${hidden} WHERE id = ${id}`;
		await invalidatePublicNavigationCache();

		return new Response(
			JSON.stringify({
				message: `Cesta započtena!`,
				code: 201
			}),
			{ status: 201 }
		);
	} catch (error) {
		const errMessage =
			error instanceof Error && error.message
				? error.message
				: 'Při zápočtu cesty došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
};

export const DELETE: RequestHandler = async ({ request, locals: { sql } }) => {
	const body = await readJsonObject(request);
	if (!body || !isDatabaseIdentifier(body.id)) {
		return invalidRequestResponse();
	}
	const { id } = body;

	try {
		await sql`DELETE FROM stored_paths WHERE id = ${id};`;
		await invalidatePublicNavigationCache();

		return new Response(
			JSON.stringify({
				message: `Cesta smazána!`,
				code: '200'
			}),
			{ status: 200 }
		);
	} catch (error) {
		const errMessage =
			error instanceof Error && error.message
				? error.message
				: 'Při mazání cesty došlo k chybě! Zkuste to prosím později';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
};
