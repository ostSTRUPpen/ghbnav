export async function changeMarker(changedEndingPoints: object): Promise<SerializedServerResponse> {
	const response = await fetch('../../api/change_markers', {
		method: 'PATCH',
		body: JSON.stringify({ changedEndingPoints }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data: SerializedServerResponse = await response.json();
	return data ?? { message: 'Failed to JSON', code: '500' };
}
