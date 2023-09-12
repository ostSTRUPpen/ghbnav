export async function changeMarker(changedEndingPoints: object): Promise<object> {
	const response = await fetch('../../api/change_markers', {
		method: 'PATCH',
		body: JSON.stringify({ changedEndingPoints }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();
	return data;
}
