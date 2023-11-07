<script lang="ts">
	import SecureAnchor from '$lib/elements/SecureAnchor.svelte';
	import { deletePath } from '$lib/functions/dynamicPathManagementFunctions.js';

	export let data;
	let { locations, stored_paths } = data;
	$: ({ locations, stored_paths } = data);
</script>

<!--
	TODO
	přidat modal pro načítání a reload stránky po smazání údajů
	Přidat tabulku a formulář pro vytvoření nové předdefinované cesty
-->

<div class="space-y-5">
	<div class="px-5">
		<SecureAnchor page={''} text={'Zpět'} /> <br />
	</div>
	<div class="divider" />

	<div class="divider" />
	<div class="overflow-x-auto px-5">
		<h2 class="text-xl">Uložené často používané cesty</h2>
		<table class="table table-sm md:table-md">
			<thead>
				<tr class="text-md md:text-xl">
					<!--TODO přidat možnost vymazat tabulku cest do admin panelu-->
					<!-- TODO přidat ještě přednastavené cesty-->
					<th>Začátek cesty</th>
					<th>Konec cesty</th>
					<th>Použití</th>
					<th>Správa</th>
				</tr>
			</thead>
			<tbody>
				{#each stored_paths as path}
					<tr class="hover text-md md:text-xl">
						<td>{path.start_name}</td>
						<td>{path.end_name}</td>
						<td>{path.count}</td>
						<td
							><button class="btn btn-error" on:click={() => deletePath(path.id)}>Vymazat</button
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
<!-- TODO přidat tlačítko na vymazaní tabulky použitých cest-->

<!-- TODO umožnit vytváření nových preset cest-->
