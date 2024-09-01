import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { loginUser, logoutUser } from '$lib/functions/userLoginsManagement.server';


export const actions: Actions = {
	login: async ({ request, locals: { sql, cookies } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || email.length > 22 || !email.match(/^.+@.+\..+$/)) {
			return fail(400, {
				error: 'Špatně zadané přihlašovací údaje',
				values: {
					email
				}
			});
		}
		if (!password || password.length > 50) {
			return fail(400, {
				error: 'Špatně zadané přihlašovací údaje',
				values: {
					email
				}
			});
		}
		const error = await loginUser(sql, email, password, cookies);

		if (error) {
			console.error('Invalid login');
			if (error === '400') {
				return fail(400, {
					error: 'Špatně zadané přihlašovací údaje',
					values: {
						email
					}
				});
			}
			return fail(500, {
				error: 'Server error. Try again later.',
				values: {
					email
				}
			});
		}
		throw redirect(302, '/sec');
	},

	logout: async ({ locals: { sql, cookies } }) => {
		await logoutUser(sql, cookies)
		throw redirect(302, '/');
	}
};
