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
		typeof body.display_name !== 'string' ||
		typeof body.image !== 'string' ||
		typeof body.position !== 'number' ||
		!Number.isInteger(body.position)
	) {
		return invalidRequestResponse();
	}
	const { id, display_name, image, position } = body;
	try {
		await sql`UPDATE icons SET display_name = ${display_name}, image = ${image}, position = ${position} WHERE id = ${id}`;
		await invalidatePublicNavigationCache();

		return new Response(
			JSON.stringify({
				message: `Skupina upravena!`,
				code: '200'
			}),
			{ status: 200 }
		);
	} catch (error) {
		const errMessage =
			error instanceof Error && error.message
				? error.message
				: 'Při úpravě ikony došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage, code: '400' }), {
			status: 400
		});
	}
};
