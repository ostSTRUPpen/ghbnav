import { supabase } from '$lib/supabaseClient';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST(requestEvent: RequestEvent): Promise<Response> {
	const { request } = requestEvent;
	const { startNode, endNode, path } = await request.json();
	//console.log('h');
	try {
		let canSave = true;
		let canUpdateCount = false;
		let UpdateCountRowID = '';
		let UpdateCountCountValue = 0;
		if (startNode && endNode && path.length > 1) {
			const { data: stored_paths } = await supabase
				.from('stored_paths')
				.select('id, starting_and_ending_point, count');
			if (stored_paths !== null) {
				for (const stored_path of stored_paths) {
					if (stored_path.starting_and_ending_point === `${startNode}-${endNode}`) {
						canSave = false;
						canUpdateCount = true;
						UpdateCountRowID = stored_path.id;
						UpdateCountCountValue = stored_path.count;
					}
				}
			}
			if (canSave && !canUpdateCount) {
				const { error } = await supabase
					.from('stored_paths')
					.insert([
						{
							start_node: startNode,
							end_node: endNode,
							path: path,
							starting_and_ending_point: `${startNode}-${endNode}`,
							count: 1
						}
					])
					.select();

				if (error) {
					//console.log(error);
					return new Response(JSON.stringify({ message: error.message }), {
						status: Number(error.code)
					});
				}
			} else if (!canSave && canUpdateCount) {
				console.log('here');
				UpdateCountCountValue++;
				const { error } = await supabase
					.from('stored_paths')
					.update({ count: UpdateCountCountValue })
					.eq('id', UpdateCountRowID);
				if (error) {
					//console.log(error);
					return new Response(JSON.stringify({ message: error.message }), {
						status: Number(error.code)
					});
				}
			}
		} else {
			//console.log('s');
			return new Response(JSON.stringify({ message: 'Data missing' }), {
				status: 400
			});
		}
		return new Response(
			JSON.stringify({
				message: 'Stored paths modified successfully'
			}),
			{ status: 201 }
		);
		// FIXME
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		const errMessage = error.message
			? error.message
			: 'An error has occurred while modifying stored paths';
		return new Response(JSON.stringify({ message: errMessage }), {
			status: 400
		});
	}
}
