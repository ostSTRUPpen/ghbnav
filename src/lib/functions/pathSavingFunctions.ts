export async function savePath(
	startNode: string,
	endNode: string,
	path: Array<string>
): Promise<object> {
	//console.log('h');
	const response = await fetch('../../../../api/add_path', {
		method: 'POST',
		body: JSON.stringify({ startNode, endNode, path }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();
	return data;
}
