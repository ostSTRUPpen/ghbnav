import type { ServerResponse } from '$lib/types/admin';

const INVALID_RESPONSE: ServerResponse = {
	message: 'Failed to JSON',
	code: '500'
};

export async function readServerResponse(response: Response): Promise<ServerResponse> {
	let data: unknown;
	try {
		data = await response.json();
	} catch {
		return INVALID_RESPONSE;
	}

	if (
		typeof data === 'object' &&
		data !== null &&
		'message' in data &&
		typeof data.message === 'string' &&
		'code' in data &&
		(typeof data.code === 'string' || typeof data.code === 'number')
	) {
		return {
			message: data.message,
			code: String(data.code)
		};
	}

	return INVALID_RESPONSE;
}
