import { readServerResponse } from '$lib/functions/serverResponse';
import type { ServerResponse } from '$lib/types/admin';

export async function updateGroup(
	id: string,
	display_name: string,
	image: string,
	position: number
): Promise<ServerResponse> {
	const response = await fetch('../../../../api/groups', {
		method: 'PATCH',
		body: JSON.stringify({ id, display_name, image, position }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return readServerResponse(response);
}
