export function isJsonObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isDatabaseIdentifier(value: unknown): value is string | number {
	return typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
	try {
		const value: unknown = await request.json();
		return isJsonObject(value) ? value : null;
	} catch {
		return null;
	}
}

export function invalidRequestResponse(): Response {
	return new Response(
		JSON.stringify({ message: 'Chybí nebo jsou neplatné potřebné údaje.', code: '400' }),
		{
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		}
	);
}
