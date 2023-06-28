<!-- // src/routes/login/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;

	let displaySuccess: boolean = false;
	let displayError: boolean = false;
	let errorMessage: string = '';

	$: {
		if (form?.success === false) {
			displayError = true;
			displaySuccess = false;
			errorMessage = form?.message;
		} else if (form?.success === true) {
			displayError = false;
			displaySuccess = true;
			errorMessage = form?.message;
		}
	}
</script>

{#if displayError === true}
	<p class="login-error_display">{errorMessage}</p>
{:else if displaySuccess}
	<p class="login-success_display">Přihlášení bylo úspěšné</p>
{/if}

<form method="post" use:enhance>
	<input name="email" value={form?.email ?? ''} />
	<input type="password" name="password" />
	<button>Přihlásit se</button>
</form>
