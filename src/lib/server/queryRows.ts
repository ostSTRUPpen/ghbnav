export async function queryRowsOrEmpty<T>(
	label: string,
	query: PromiseLike<Iterable<T>>
): Promise<T[]> {
	try {
		return Array.from(await query);
	} catch (error) {
		console.error(`Nepodařilo se načíst ${label}.`, error);
		return [];
	}
}
