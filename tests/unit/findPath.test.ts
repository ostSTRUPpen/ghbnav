import { describe, expect, it } from 'vitest';
import { dijkstra } from '../../src/lib/functions/findPath';
import type { NavigationMarker } from '../../src/lib/types/navigation';

const START = '11111111-1111-4111-8111-111111111111';
const END = '22222222-2222-4222-8222-222222222222';

function marker(id: number, connected: Record<string, number>, floor = 1): NavigationMarker {
	return {
		id,
		x: id * 10,
		y: id * 20,
		floor,
		connected,
		special_type: null
	};
}

describe('dijkstra', () => {
	it('finds the lowest-weight route between location endpoints', () => {
		const graph = [
			marker(1, { '2': 2, '3': 20, [START]: 4 }),
			marker(2, { '1': 2, '3': 3 }),
			marker(3, { '1': 20, '2': 3, [END]: 1 })
		];

		expect(dijkstra(graph, START, END, 2)).toEqual({
			status: 'OK',
			distance: 10,
			path: [START, '1', '2', '3', END],
			startFloor: 2
		});
	});

	it('supports navigation in the opposite direction', () => {
		const graph = [marker(1, { '2': 2, [START]: 4 }), marker(2, { '1': 2, [END]: 1 }, 3)];

		expect(dijkstra(graph, END, START, 3)).toEqual({
			status: 'OK',
			distance: 7,
			path: [END, '2', '1', START],
			startFloor: 3
		});
	});

	it.each([
		['empty start', '', END],
		['empty end', START, ''],
		['identical endpoints', START, START],
		['unknown start', 'missing', END],
		['unknown end', START, 'missing']
	])('returns NO_PATH for %s', (_case, start, end) => {
		const result = dijkstra([marker(1, { [START]: 1 }), marker(2, { [END]: 1 })], start, end, 4);

		expect(result).toEqual({
			status: 'NO_PATH',
			distance: Number.POSITIVE_INFINITY,
			path: [],
			startFloor: 4
		});
	});

	it('returns NO_PATH when both endpoints exist but their graph parts are disconnected', () => {
		const graph = [marker(1, { [START]: 1 }), marker(2, { [END]: 1 })];

		expect(dijkstra(graph, START, END, 1).status).toBe('NO_PATH');
	});

	it('does not mutate the navigation data', () => {
		const graph = [marker(1, { '2': 1, [START]: 1 }), marker(2, { '1': 1, [END]: 1 })];
		const original = structuredClone(graph);

		dijkstra(graph, START, END, 1);

		expect(graph).toEqual(original);
	});
});
