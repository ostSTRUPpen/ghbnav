import { supabase } from '$lib/supabaseClient';

//FIXME
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export async function POST(requestEvent: RequestEvent): Promise<Response> {
	const { request } = requestEvent;
	const { startNode, endNode, path } = await request.json();
	//console.log('h');
	try {
		let canSave = true;
		if (startNode && endNode && path.length > 1) {
			const { data: stored_paths } = await supabase
				.from('stored_paths')
				.select('starting_and_ending_point');
			if (stored_paths !== null) {
				for (const stored_path of stored_paths) {
					if (stored_path.starting_and_ending_point === `${startNode}-${endNode}`) {
						canSave = false;
					}
				}
			}
			if (canSave) {
				const { error } = await supabase
					.from('stored_paths')
					.insert([
						{
							start_node: startNode,
							end_node: endNode,
							path: path,
							starting_and_ending_point: `${startNode}-${endNode}`
						}
					])
					.select();

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
				message: 'Path added successfully'
			}),
			{ status: 201 }
		);
		// FIXME
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		const errMessage = error.message
			? error.message
			: 'An error has occured while updating the user';
		return new Response(JSON.stringify({ message: errMessage }), {
			status: 400
		});
	}
}
