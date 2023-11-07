<script lang="ts">
	//TODO test zda jsou oba údaje vyplněné
</script>

<div class="flex justify-center">
	<form method="POST" action="?/login" class="space-y-2">
		<h2 class="text-2xl">Přihlášení do rozhraní správce</h2>
		<label for="from" class="label">
			<span class="label-text text-lg">E-mail: </span>
		</label>
		<input
			type="email"
			name="email"
			placeholder="jmeno@ghb.cz"
			required
			class="input input-bordered"
		/>
		<br />
		<label for="to" class="label">
			<span class="label-text text-lg">Heslo: </span>
		</label>
		<input
			type="password"
			name="password"
			required
			placeholder="heslo123"
			class="input input-bordered"
		/>
		<br />
		<input type="submit" value="Přihlásit se" class="btn btn-primary text-base-100" />
	</form>
</div>
