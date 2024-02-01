<script lang="ts">
	import SecureAnchor from '$lib/elements/SecureAnchor.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { iconImages } from '$lib/data/markerIcons';
	import { updateGroup } from '$lib/functions/groupsManagementFunctions.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	export let data;
	let { items, iconIdImageName } = data;

	let successDialog: any;
	let loadingDialog: any;
	let errorDialog: any;
	let errors: SerializedServerResponse[] = [];

	onMount(() => {
		successDialog = document.getElementById('success-dialog');
		loadingDialog = document.getElementById('loading-dialog');
		errorDialog = document.getElementById('error-dialog');
	});

	const flipDurationMs = 200;

	function recountItemPosition(items: Array<any>) {
		for (let i = 0; i < items.length; i++) {
			items[i].position = i + 1;
		}
	}
	function handleSort(e: any) {
		items = e.detail.items;
		recountItemPosition(items);
	}

	async function saveChanges() {
		loadingDialog['showModal']();
		recountItemPosition(items);
		for (const item of items) {
			const response = await updateGroup(item.id, item.display_name, item.image, item.position);
			if (response.code !== '200' && response.code !== '201') {
				errors.push(response);
			}
		}
		errors = errors;
		loadingDialog.close();
		if (errors.length > 0) {
			errorDialog['showModal']();
		} else {
			successDialog['showModal']();
		}
	}

	function cancelChanges() {
		goto(`${base}/sec`, { replaceState: true });
	}
</script>

<dialog id="loading-dialog" class="modal">
	<div class="modal-box flex justify-center">
		<span class="loading loading-dots loading-lg text-info" />
	</div>
</dialog>

<dialog id="success-dialog" class="modal">
	<div class="modal-box">
		<p class="font-bold text-lg text-success">Hotovo!</p>
		<p class="text-lg py-4">Skupiny úspěšně upraveny.</p>
		<button
			on:click={() => {
				successDialog.close();
				goto(`${base}/sec`, { replaceState: true });
			}}
			class="modal-action btn btn-info">Ok</button
		>
	</div>
</dialog>

<dialog id="error-dialog" class="modal">
	<div class="modal-box">
		<p class="font-bold text-lg text-error">Došlo k chybě!</p>
		<ul>
			{#each errors as error}
				<li class="text-error">
					<span class="font-bold">{error.code}</span> - <span>{error.message}</span>
				</li>
			{/each}
		</ul>
		<button
			on:click={() => {
				errorDialog.close();
				goto(`${base}/sec`, { replaceState: true });
			}}
			class="modal-action btn btn-info">Ok</button
		>
	</div>
</dialog>

<div class="space-y-5">
	<div class="px-5">
		<SecureAnchor page={''} text={'Zpět'} /> <br />
	</div>
	<div class="divider" />
	<div class="overflow-x-auto px-5">
		<h2 class="text-xl">Skupiny značek</h2>
		<table class="table table-sm md:table-md table-pin-rows">
			<thead>
				<tr class="text-md md:text-xl">
					<th>Název skupiny</th>
					<th>Ikona skupiny</th>
					<th>Pozice skupiny v pořadí</th>
				</tr>
			</thead>
			<tbody
				use:dndzone={{ items, flipDurationMs }}
				on:consider={handleSort}
				on:finalize={handleSort}
				class="w-full text-md md:text-xl"
			>
				{#each items as item (item.id)}
					<tr
						animate:flip={{ duration: flipDurationMs }}
						class="h-25 w-full mx-1 my-1 px-5 py-5 select-none text-md md:text-xl"
					>
						<td class="text-md md:text-xl"
							><input
								type="text"
								bind:value={item.display_name}
								maxlength="50"
								class="input input-bordered"
							/></td
						>
						<td class="text-md md:text-xl">
							<select
								id="icon"
								bind:value={item.image}
								class="select select-bordered w-full max-w-xs"
							>
								{#each iconIdImageName as icon}
									<option value={icon.id}>{icon.display_name} </option>{/each}
							</select>
							<img
								src={iconImages[item.image]}
								alt={item.display_name}
								class="bg-white px-1 py-1"
							/>
						</td>
						<td class="text-md md:text-xl">{item.position}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan="2"
						><button on:click={saveChanges} class="btn btn-success">Uložit změny</button>
					</td><td colspan="2"
						><button on:click={cancelChanges} class="btn btn-error">Zrušit změny</button>
					</td></tr
				>
			</tfoot>
		</table>
	</div>
</div>
