import { staticSettings } from "$lib/data/staticData";

export async function savePath(
	startNode: string,
	endNode: string,
	path: Array<string>
): Promise<SerializedServerResponse> {
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
	const data: SerializedServerResponse = await response.json();
	return data ?? { message: 'Failed to JSON', code: '500' };
}

export async function updatePathVisibility(
	id: string,
	hidden: boolean
): Promise<SerializedServerResponse> {
	const response = await fetch('../../../../api/dynamic_paths', {
		method: 'PATCH',
		body: JSON.stringify({ id, hidden }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data: SerializedServerResponse = await response.json();
	return data ?? { message: 'Failed to JSON', code: '500' };
}

export async function deletePath(id: string): Promise<SerializedServerResponse> {
	const response = await fetch('../../../../api/dynamic_paths', {
		method: 'DELETE',
		body: JSON.stringify({ id }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data: SerializedServerResponse = await response.json();
	return data ?? { message: 'Failed to JSON', code: '500' };
}
