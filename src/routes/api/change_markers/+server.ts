//import { supabase } from '$lib/supabaseClient.js';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

//FIXME
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export async function PATCH({ request, locals: { supabase, getSession } }): Promise<Response> {
	const session = await getSession();
	if (!session) {
		throw redirect(303, '/');
	}
	const { changedEndingPoints } = await request.json();

	try {
		for (const changedEndingPoint of changedEndingPoints) {
			switch (changedEndingPoint.change) {
				case 'both': {
					const { error } = await supabase
						.from('markers')
						.update({
							display_name: changedEndingPoint.display_name,
							icon: changedEndingPoint.icon
						})
						.eq('id', changedEndingPoint.id);
					if (error) {
						return new Response(JSON.stringify({ message: error.message }), {
							status: Number(error.code)
						});
					}
					break;
				}
				case 'icon': {
					const { data, error } = await supabase
						.from('markers')
						.update({
							icon: changedEndingPoint.icon
						})
						.eq('id', changedEndingPoint.id)
						.select();
					if (error) {
						return new Response(JSON.stringify({ message: error.message }), {
							status: Number(error.code)
						});
					}
					break;
				}
				case 'display name': {
					const { error } = await supabase
						.from('markers')
						.update({
							display_name: changedEndingPoint.display_name
						})
						.eq('id', changedEndingPoint.id);
					if (error) {
						return new Response(JSON.stringify({ message: error.message }), {
							status: Number(error.code)
						});
					}
					break;
				}
				default: {
					break;
				}
			}
		}
		return new Response(
			JSON.stringify({
				message: 'Markers updated successfully'
			}),
			{ status: 201 }
		);
		// FIXME
	} catch (error: any) {
		const errMessage = error.message ?? 'An error has occured while updating the user';
		return new Response(JSON.stringify({ message: errMessage }), {
			status: 400
		});
	}
}
/*
export async function PATCH(requestEvent): Promise<Response> {
	const { request } = requestEvent;
	const { id, username, password, role } = await request.json();
	const userToUpdate: any = await User.findById(id).exec();

	if (!userToUpdate) {
		return new Response(JSON.stringify({ message: `User not found!`, success: false }), {
			status: 400
		});
	}

	try {
		const foundUser = await User.findOne({ username })
			.collation({ locale: 'cs', strength: 2 })
			.lean()
			.exec();
		if (foundUser && foundUser._id.toString() !== id) {
			return new Response(
				JSON.stringify({ message: `Username (${username}) is already taken!`, success: false }),
				{
					status: 400
				}
			);
		}
		userToUpdate.username = username;
		if (password.length !== 0) userToUpdate.password = await bcrypt.hash(password, 10);
		userToUpdate.role = role;
		const updatedUser = await userToUpdate.save();
		return new Response(
			JSON.stringify({
				message: `User ${updatedUser.username} updated successfully`,
				success: true
			}),
			{ status: 201 }
		);
	} catch (error: any) {
		const errMessage = error.message ?? 'An error has occured while updating the user';
		return new Response(JSON.stringify({ message: errMessage, success: false }), { status: 400 });
	}
}
*/
