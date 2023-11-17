export async function updateGroup(
	id: string,
	display_name: string,
	image: string,
	position: number
): Promise<object> {
	const response = await fetch('../../../../api/groups', {
		method: 'PATCH',
		body: JSON.stringify({ id, display_name, image, position }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();
	return data;
}
