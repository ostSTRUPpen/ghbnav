import { fail, type Actions } from "@sveltejs/kit";
import bcrypt from 'bcrypt';
// <!-- TODO smazat tenhle URL endpoint, komplet-->
export const actions: Actions = {
	login: async ({ request, locals: { sql, cookies } }) => {
		const formData = await request.formData();
		const password = formData.get('password') as string;
		const hashedPassword = await bcrypt.hash(password, 10);
		return (hashedPassword)
	}
};
