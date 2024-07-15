<script>
	export let form;
</script>

<form method="POST" action="?/login">
	<label for="password" class="label">Prosím zadejte heslo pro GHBnav:</label>
	<input type="password" name="password" class="input input-bordered" />
	<br />

	<input type="submit" value="Potvrdit" class="btn" />
</form>

{#if form}
	<p class="text-success">
		Prosím pošlete mi tento text na můj email:
		<span class="text-black">{form}</span>
	</p>
{/if}
