export async function updatePath(
	id: string,
	start_node: string,
	end_node: string,
	hidden: boolean
): Promise<object> {
	const response = await fetch('../../../../api/preset_paths', {
		method: 'PATCH',
		body: JSON.stringify({ id, start_node, end_node, hidden }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();
	return data;
}
