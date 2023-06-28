<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};
</script>

<p>a</p>
<button on:click={handleSignOut}>Sign out</button>
