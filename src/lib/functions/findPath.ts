import type { NavigationMarker, PathResult } from '$lib/types/navigation';

type NavigationGraph = Record<string, Record<string, number>>;

function buildGraph(data: NavigationMarker[], startNode: string, endNode: string): NavigationGraph {
	const graph: NavigationGraph = {};

	for (const navMarker of data) {
		const navMarkerId = String(navMarker.id);
		graph[navMarkerId] = navMarker.connected;

		if (Object.prototype.hasOwnProperty.call(navMarker.connected, startNode)) {
			(graph[startNode] ??= {})[navMarkerId] = navMarker.connected[startNode];
		}
		if (Object.prototype.hasOwnProperty.call(navMarker.connected, endNode)) {
			(graph[endNode] ??= {})[navMarkerId] = navMarker.connected[endNode];
		}
	}

	return graph;
}

function findLowestWeightNode(
	weights: Record<string, number>,
	processed: Set<string>
): string | null {
	let lowestNode: string | null = null;
	let lowestWeight = Number.POSITIVE_INFINITY;

	for (const [node, weight] of Object.entries(weights)) {
		if (!processed.has(node) && weight < lowestWeight) {
			lowestNode = node;
			lowestWeight = weight;
		}
	}

	return lowestNode;
}

export function dijkstra(
	rawGraph: NavigationMarker[],
	startNode: string,
	endNode: string,
	startNodeFloor: number
): PathResult {
	if (!startNode || !endNode || startNode === endNode) {
		return noPath(startNodeFloor);
	}

	const graph = buildGraph(rawGraph, startNode, endNode);
	if (!graph[startNode] || !graph[endNode]) {
		return noPath(startNodeFloor);
	}

	const weights: Record<string, number> = { [startNode]: 0 };
	const parents: Record<string, string | null> = { [startNode]: null };
	const processed = new Set<string>();
	let node: string | null = startNode;

	while (node) {
		const weight = weights[node];
		for (const [child, edgeWeight] of Object.entries(graph[node] ?? {})) {
			const newWeight = weight + edgeWeight;
			if (newWeight < (weights[child] ?? Number.POSITIVE_INFINITY)) {
				weights[child] = newWeight;
				parents[child] = node;
			}
		}

		processed.add(node);
		node = findLowestWeightNode(weights, processed);
	}

	if (!Number.isFinite(weights[endNode])) {
		return noPath(startNodeFloor);
	}

	const path = [endNode];
	let parent = parents[endNode];
	while (parent) {
		path.unshift(parent);
		parent = parents[parent];
	}

	if (path[0] !== startNode) {
		return noPath(startNodeFloor);
	}

	return {
		status: 'OK',
		distance: weights[endNode],
		path,
		startFloor: startNodeFloor
	};
}

function noPath(startFloor: number): PathResult {
	return {
		status: 'NO_PATH',
		distance: Number.POSITIVE_INFINITY,
		path: [],
		startFloor
	};
}
