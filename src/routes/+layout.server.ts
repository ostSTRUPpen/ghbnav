import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals: { validateLogin } }) => {
	const theme: 'ghb_light' | 'ghb_dark' =
		cookies.get('theme') === 'ghb_dark' ? 'ghb_dark' : 'ghb_light';

	return {
		loggedIn: await validateLogin(),
		theme
	};
};
