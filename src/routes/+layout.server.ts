import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { validateLogin } }) => {

	return {
		loggedIn: await validateLogin()
	};
};
