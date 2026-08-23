import { readServerResponse } from '$lib/functions/serverResponse';
import type { MarkerChange, ServerResponse } from '$lib/types/admin';

export async function changeMarker(changedEndingPoints: MarkerChange[]): Promise<ServerResponse> {
	const response = await fetch('../../api/change_markers', {
		method: 'PATCH',
		body: JSON.stringify({ changedEndingPoints }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return readServerResponse(response);
}
