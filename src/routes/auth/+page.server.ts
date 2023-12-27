import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { AuthApiError } from '@supabase/supabase-js';

/**
 * Making auth work was a pain in the ass because SvelteKit, Supabase auth helpers documentation sucks and changes all the time
 * This works with: "@supabase/auth-helpers-sveltekit": "^0.10.1", "@supabase/supabase-js": "^2.26.0", (28. 06. 2023)
 * Following the documentation (https://github.com/supabase/auth-helpers/tree/main/packages/sveltekit) works until "Saving and deleting the session" step
 * There is not enough information. So this is how you should fix it
 *
 * 1. copy the step in "+page.server.ts" next to "+page.svelte"
 * +page.svelte:
 * 							(this needs to match the action name in +page.server.ts)
 * >
 * <form method="POST" action="?/login">
 * 		<input name="email" />
 * 		<input type="password" name="password" />
 * 		<input type="submit" />
 * </form>
 * <
 *
 * 2. Inside "+layout.svelte" in your protected path add this:
 * 								(relative path to the "+page.server.ts" file with the "logout" action)
 * >
 *	<form method="POST" action="../auth?/logout"><input type="submit" value="Odhlásit se" /></form>
 * <
 *
 * 3. After watching (https://www.youtube.com/watch?v=UbhhJWV3bmI) I have created a SecureAnchor component
 * >
 * 	<script lang="ts">
 * 		import { goto } from '$app/navigation';
 *
 * 		export let page: string;
 * 		export let text: string;
 *
 * 		function anchor() {
 * 			goto(`/sec${page}`, { replaceState: true });
 * 		}
 * 	</script>
 * 	<a href="#" on:click={anchor}>{text}</a>
 * <
 * You can use is like this:
 * >
 * <script lang="ts">
 * 		import SecureAnchor from '$lib/elements/SecureAnchor.svelte';
 * </script>
 * 					// (relative url from /sec) (link text)
 * <SecureAnchor page={'/markers'} text={'Značky'} />
 * <
 */

export const actions: Actions = {
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.error(error);
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					error: 'Invalid credentials.',
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

	logout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		throw redirect(302, '/');
	}
};
