<script lang="ts">
	import SecureAnchor from '$lib/elements/SecureAnchor.svelte';
	import { changeMarker } from '../../../lib/functions/markerManagemetnFunctions.js';
	// svelte stuff
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { iconImageList } from '$lib/data/markerIcons.js';
	const iconList = iconImageList;
	// TODO - seřadit podle množství změn (nejvíc třídy a potom podle celkového počtu I guess)
	// TODO přidat všechny ikony (už chybí jen 2 X (1. PP a 1. NP))
	/*const iconList = [
		{
			name: 'wc',
			image: wc,
			displayname: 'WC'
		},
		{
			name: 'kabinet',
			image: teachers_room,
			displayname: 'Kabinet'
		},
		{
			name: 'kmen_trida',
			image: main_classroom,
			displayname: 'Kmenová třída'
		},
		{
			name: 'poslucharna',
			image: special_classroom,
			displayname: 'Posluchárna'
		},
		{
			name: 'telocvicna',
			image: gym,
			displayname: 'Tělocvična'
		},
		{
			name: 'satna',
			image: closet_room,
			displayname: 'Šatna se skříňkami'
		},
		{
			name: 'reditelna',
			image: director,
			displayname: 'Ředitelna'
		},
		{
			name: 'kancelar',
			image: office,
			displayname: 'Kancelář'
		},
		{
			name: 'vstup',
			image: entry,
			displayname: 'Vstupní prostor'
		},
		{
			name: 'tv_satna',
			image: gym_dress_room,
			displayname: 'Šatna (u tělocvičny)'
		},
		{
			name: 'it_ucebna',
			image: it_classroom,
			displayname: 'UVT'
		},
		{
			name: 'laborator',
			image: labs,
			displayname: 'Laboratoř (CH,FY,BI)'
		},
		{
			name: 'schodiste',
			image: staircase,
			displayname: 'Schodiště'
		},
		{
			name: 'posilovna',
			image: workout_room,
			displayname: 'Posilovna'
		},
		{
			name: 'badatelna',
			image: explore,
			displayname: 'Badatelské centrum'
		},
		{
			name: 'jazykovka',
			image: language_rooms,
			displayname: 'Jazyková učebna'
		},
		{
			name: 'hudebka',
			image: singing,
			displayname: 'HV'
		},
		{
			name: 'sklad',
			image: storage,
			displayname: 'Sklad/Půda'
		},
		{
			name: 'archiv',
			image: archive,
			displayname: 'Archiv'
		},
		{
			name: 'atelier',
			image: art,
			displayname: 'Ateliér'
		},
		{
			name: 'zastupci_reditele',
			image: deputies,
			displayname: 'Zástupci ředitele'
		},
		{
			name: 'knihovna',
			image: library,
			displayname: 'Knihovna'
		},
		{
			name: 'citarna',
			image: read,
			displayname: 'Čítárna'
		},
		{
			name: 'sborovna',
			image: teachers_common_room,
			displayname: 'Sborovna'
		},
		{
			name: 'vahovna',
			image: weight,
			displayname: 'Váhovna'
		},
		{
			name: 'kotelna',
			image: boiler_room,
			displayname: 'Kotelna'
		},
		{
			name: 'bufet',
			image: bufet,
			displayname: 'Bufet'
		},
		{
			name: 'psycholog',
			image: psychiatrist,
			displayname: 'Psycholog'
		},
		{
			name: 'spinkarna',
			image: sleep,
			displayname: 'Spinkárna'
		},
		{
			name: 'uta',
			image: uta,
			displayname: 'UTA'
		},
		{
			name: 'umyvarna',
			image: washroom,
			displayname: 'Umývárna'
		},
		{
			name: 'dilna',
			image: workshop,
			displayname: 'Dílna'
		},
		{
			name: 'skolnik',
			image: janitor,
			displayname: 'Školník'
		},
		{
			name: 'byt_skolnika',
			image: janitor_flat,
			displayname: 'Byt školníka'
		}
	];*/

	export let data;
	let { endingPoints } = data;
	$: ({ endingPoints } = data);

	// TODO seznam všech ikon a jejich displayname názvů
	// TODO možnost vygenerovat QR kód (kdyby se nějaký rozbil)

	for (let endingPoint of endingPoints) {
		// FIXME zprovoznit datové typy
		// FIXME
		//@ts-ignore
		endingPoint['new_display_name'] = endingPoint.display_name;
		//@ts-ignore
		endingPoint['new_icon'] = endingPoint.icon;
		//@ts-ignore
		endingPoint['new_can_nav'] = endingPoint.can_nav;
	}

	async function saveChanges() {
		let changedEndingPoints = [];
		for (let endingPoint of endingPoints) {
			// FIXME
			//@ts-ignore
			if (
				//@ts-ignore
				endingPoint.new_display_name !== '' ||
				//@ts-ignore
				endingPoint.new_icon !== endingPoint.icon ||
				//@ts-ignore
				endingPoint.new_can_nav !== endingPoint.can_nav
			) {
				changedEndingPoints.push({
					id: endingPoint.id,
					//@ts-ignore
					display_name: endingPoint.new_display_name,
					//@ts-ignore
					icon: endingPoint.new_icon,
					//@ts-ignore
					can_nav: endingPoint.new_can_nav
				});
				//@ts-ignore
			}
		}
		if (changedEndingPoints.length > 0) {
			await changeMarker(changedEndingPoints);
			dialog['showModal']();
		}
	}
	let dialog: any;
	onMount(() => {
		dialog = document.getElementById('deletion-dialog');
	});

	function cancelChanges() {
		goto('/sec', { replaceState: true });
	}
</script>

<SecureAnchor page={''} text={'Zpět'} />

<dialog id="deletion-dialog">
	<h1>Značky úspěšně upraveny</h1>
	<button
		on:click={() => {
			dialog.close();
			goto('/sec', { replaceState: true });
		}}>Ok</button
	>
</dialog>
<!-- TODO přidat ukázku všech dostupnýc ikon-->
<!-- TODO Víc graficky rozlišit patra a vylepšit grafiku tabulky-->
<table>
	<thead>
		<tr>
			<th>Patro</th>
			<th>Název značky</th>
			<th>Ikona</th>
			<th>Navigovatelný</th>
		</tr>
	</thead>
	<tbody>
		{#each endingPoints as endPoint}
			<tr>
				<td>{endPoint.floor}</td>
				<td><input type="text" maxlength="50" bind:value={endPoint.new_display_name} /></td>
				<td>
					<select id="icon" bind:value={endPoint.new_icon}>
						{#each iconList as icon}
							{#if endPoint.icon === icon['name']}
								<option value={icon['name']} selected>{icon.displayname}</option>
							{:else}
								<option value={icon['name']}>{icon.displayname}</option>
							{/if}
						{/each}
					</select>
				</td>
				<td>
					<input type="checkbox" bind:checked={endPoint.new_can_nav} />
				</td>
			</tr>
		{/each}
	</tbody>
	<tfoot>
		<tr>
			<td colspan="2"><button on:click={saveChanges}>Uložit změny</button> </td><td colspan="2"
				><button on:click={cancelChanges}>Zrušit změny</button>
			</td></tr
		>
	</tfoot>
</table>
