import { staticSettings } from '$lib/data/staticData';
import { readServerResponse } from '$lib/functions/serverResponse';
import type { ServerResponse } from '$lib/types/admin';

export async function savePath(
	startNode: string,
	endNode: string,
	path: Array<string>
): Promise<ServerResponse> {
	if (!staticSettings.storeDynamicPaths) {
		return { message: 'Path saving is disabled', code: '201' };
	}
	const response = await fetch('../../../../api/dynamic_paths', {
		method: 'POST',
		body: JSON.stringify({ startNode, endNode, path }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return readServerResponse(response);
}

export async function updatePathVisibility(id: string, hidden: boolean): Promise<ServerResponse> {
	const response = await fetch('../../../../api/dynamic_paths', {
		method: 'PATCH',
		body: JSON.stringify({ id, hidden }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return readServerResponse(response);
}

export async function deletePath(id: string): Promise<ServerResponse> {
	const response = await fetch('../../../../api/dynamic_paths', {
		method: 'DELETE',
		body: JSON.stringify({ id }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return readServerResponse(response);
}
