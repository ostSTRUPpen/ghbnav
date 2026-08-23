import { invalidatePublicNavigationCache } from '$lib/server/publicNavigationCache';
import {
	invalidRequestResponse,
	isDatabaseIdentifier,
	readJsonObject
} from '$lib/server/requestValidation';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, locals: { sql } }) => {
	const body = await readJsonObject(request);
	if (
		!body ||
		!isDatabaseIdentifier(body.id) ||
		typeof body.start_node !== 'string' ||
		typeof body.end_node !== 'string' ||
		typeof body.hidden !== 'boolean'
	) {
		return invalidRequestResponse();
	}
	const { id, start_node, end_node, hidden } = body;
	try {
		await sql`UPDATE preset_paths SET hidden = ${hidden}, start_node = ${start_node}, end_node = ${end_node} WHERE id = ${id}`;
		await invalidatePublicNavigationCache();

		return new Response(
			JSON.stringify({
				message: `Cesta upravena!`,
				code: '200'
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		const errMessage =
			error instanceof Error && error.message
				? error.message
				: 'Při úpravě cesty došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
};
