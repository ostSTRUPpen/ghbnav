<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data;
	//appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<Auth
	supabaseClient={data.supabase}
	view="magic_link"
	redirectTo={`${data.url}/auth/callback`}
	showLinks={false}
/>
