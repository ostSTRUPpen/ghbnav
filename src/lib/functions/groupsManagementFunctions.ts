export async function updateGroup(
	id: string,
	display_name: string,
	image: string,
	position: number
): Promise<SerializedServerResponse> {
	const response = await fetch('../../../../api/groups', {
		method: 'PATCH',
		body: JSON.stringify({ id, display_name, image, position }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data: SerializedServerResponse = await response.json();
	return data ?? { message: 'Failed to JSON', code: '500' };
}
