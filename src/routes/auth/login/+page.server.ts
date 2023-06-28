import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.log(error);
			return fail(500, { message: 'Špatné přihlašovací údaje', success: false, email });
		}

		return {
			message: 'Přihlášení úspešné',
			success: true
		};
	}
};
