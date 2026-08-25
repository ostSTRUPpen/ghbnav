import { readServerResponse } from '$lib/functions/serverResponse';
import type { ServerResponse } from '$lib/types/admin';

export async function updatePath(
	id: string,
	start_node: string,
	end_node: string,
	hidden: boolean
): Promise<ServerResponse> {
	const response = await fetch('../../../../api/preset_paths', {
		method: 'PATCH',
		body: JSON.stringify({ id, start_node, end_node, hidden }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return readServerResponse(response);
}
