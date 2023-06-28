<script lang="ts">
	import { supabase } from '@supabase/auth-ui-shared';

	const { data, error } = await supabase.auth.signUp({
		email: 'example@email.com',
		password: 'example-password'
	});
</script>

<div>
	<form>
		<label for="emai">E-mail:</label>
		<input name="email" type="email" /> <br />
		<label for="password">Heslo:</label>
		<input name="password" type="password" />
	</form>
</div>
