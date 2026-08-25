import { invalidatePublicNavigationCache } from '$lib/server/publicNavigationCache';
import {
	invalidRequestResponse,
	isJsonObject,
	readJsonObject
} from '$lib/server/requestValidation';
import type { MarkerChange } from '$lib/types/admin';
import type { RequestHandler } from './$types';

function isMarkerChange(value: unknown): value is MarkerChange {
	return (
		isJsonObject(value) &&
		typeof value.id === 'string' &&
		typeof value.display_name === 'string' &&
		typeof value.icon === 'string' &&
		typeof value.can_nav === 'boolean' &&
		typeof value.building_location === 'string'
	);
}

export const PATCH: RequestHandler = async ({ request, locals: { sql } }) => {
	const body = await readJsonObject(request);
	if (
		!body ||
		!Array.isArray(body.changedEndingPoints) ||
		!body.changedEndingPoints.every(isMarkerChange)
	) {
		return invalidRequestResponse();
	}
	const changedEndingPoints = body.changedEndingPoints;

	try {
		for (const changedEndingPoint of changedEndingPoints) {
			await sql`UPDATE markers SET display_name = ${changedEndingPoint.display_name}, icon = ${changedEndingPoint.icon}, can_nav = ${changedEndingPoint.can_nav}, building_location = ${changedEndingPoint.building_location} WHERE id = ${changedEndingPoint.id};`;
		}
		await invalidatePublicNavigationCache();

		return new Response(
			JSON.stringify({
				message: 'Značky úspěšně upraveny!',
				code: '201'
			}),
			{ status: 201 }
		);
	} catch (error) {
		const errMessage =
			error instanceof Error && error.message
				? error.message
				: 'Při úpravě značek došlo k chybě! Zkuste to prosím později.';
		return new Response(JSON.stringify({ message: errMessage }), {
			status: 400
		});
	}
};
