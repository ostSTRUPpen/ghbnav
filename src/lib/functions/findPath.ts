//FIXME
/* eslint-disable @typescript-eslint/ban-ts-comment */

const findLowestWeightNode = (weights: object, processed: Array<string>) => {
	const knownNodes = Object.keys(weights);

	const lowestWeightNode = knownNodes.reduce((lowest: null | never | string, node: string) => {
		if (lowest === null && !processed.includes(node)) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			lowest! = node;
		}
		if (
			weights[node as keyof typeof weights] < weights[lowest as keyof typeof weights] &&
			!processed.includes(node)
		) {
			lowest = node;
		}
		return lowest;
	}, null);

	return lowestWeightNode;
};
//FIXME
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function procesData(data: any, startNode: string, endNode: string) {
	const graph: App.GraphTypes['graphObject'] = {};
	for (const navMarker of data) {
		if (Object.prototype.hasOwnProperty.call(navMarker.connected, startNode)) {
			const additionToStartNode: Record<string, number> = {};
			additionToStartNode[navMarker.id] = navMarker.connected[startNode];
			graph[String(startNode)] = additionToStartNode;
		} else if (Object.prototype.hasOwnProperty.call(navMarker.connected, endNode)) {
			const additionToEndNode: Record<string, number> = {};
			additionToEndNode[navMarker.id] = navMarker.connected[endNode];
			graph[String(endNode)] = additionToEndNode;
		}
		graph[String(navMarker.id)] = navMarker.connected;
	}
	return graph;
}

export const dijkstra = (
	rawGraph: App.GraphTypes['rawGraphObject'],
	startNode: string,
	endNode: string
) => {
	const graph = procesData(rawGraph, startNode, endNode);

	// track lowest cost to reach each node
	const weights = Object.assign({ endNode: Infinity }, graph[startNode]);

	// track paths
	const parents = { endNode: null };
	for (const child in graph[startNode as keyof typeof graph]) {
		//FIXME
		//@ts-ignore
		parents[child] = startNode;
		//console.log(parents);
	}

	// track nodes that have already been processed
	const processed: Array<string> = [];
	//console.log(processed);
	//Next, we’ll set the initial value of the node being processed //using the lowestCostNode function. Then, we’ll begin a while loop, //which will continuously look for the cheapest node.
	let node = findLowestWeightNode(weights, processed);
	//console.log(node);

	while (node) {
		//Get the weight of the current node
		const weight = weights[node];
		//Get all the neighbors of current node
		const children: object = graph[node as keyof typeof graph];
		//console.log(graph[node]);
		//Loop through each of the children, and calculate the weight to reach that child node. We'll update the weight of that node in the weights object if it is lowest or the ONLY weight available
		for (const n in children) {
			//console.log(n);
			if (n === startNode) {
				//console.log(n);
				continue;
			}
			const newWeight = weight + children[n as keyof typeof children];
			//console.log(newWeight);
			if (!weights[n] || weights[n] > newWeight) {
				weights[n] = newWeight;
				//FIXME
				//@ts-ignore
				parents[n] = node;
				///console.log(parents);
			}
		}
		//push processed data into its data structure
		processed.push(node);
		// repeat until we processed all of our nodes.
		node = findLowestWeightNode(weights, processed);
	}
	const optimalPath = [endNode];
	let parent = parents[endNode as keyof typeof parents];
	//console.log(parents);
	while (parent) {
		optimalPath.unshift(parent);
		//console.log(optimalPath);
		parent = parents[parent]; // add parent to start of path array
	}
	//FIXME remove after buug fixing
	console.log(optimalPath);
	const results = {
		status: 'OK',
		distance: weights[endNode],
		path: optimalPath
	};
	return results;
};