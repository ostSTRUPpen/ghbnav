export async function savePath(
	startNode: string,
	endNode: string,
	path: Array<string>
): Promise<object> {
	const response = await fetch('../../../../api/dynamic_paths', {
		method: 'POST',
		body: JSON.stringify({ startNode, endNode, path }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();
	return data;
}

export async function updatePathVisibility(id: string, hidden: boolean): Promise<object> {
	const response = await fetch('../../../../api/dynamic_paths', {
		method: 'PATCH',
		body: JSON.stringify({ id, hidden }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();
	return data;
}

export async function deletePath(id: string): Promise<object> {
	const response = await fetch('../../../../api/dynamic_paths', {
		method: 'DELETE',
		body: JSON.stringify({ id }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();
	return data;
}
