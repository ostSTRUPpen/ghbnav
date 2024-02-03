<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	export let id: string;
	export let name: string;
	export let floor: string;
	export let settings: string = 'marker';

	const url_string: string = 'https://mapa.ghb.cz';

	onMount(() => {
		//@ts-ignore
		const qrcode = new QRCode(document.getElementById(`qr${id}`), {
			text: `${url_string}${base}/map/${id}`,
			width: 305,
			height: 305,
			colorDark: '#000000',
			colorLight: '#ffffff',
			//@ts-ignore
			correctLevel: QRCode.CorrectLevel.H
		});
	});
</script>

{#if settings == 'marker'}
	<table class="shell">
		<thead>
			<tr class="cut_text">
				<th class="cut_text">{name} - {floor}</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th class="flex justify-center qrcode_td"><div id={`qr${id}`} /></th>
			</tr>
			<tr><td class="link_text">{`${url_string}/map/${id}`}</td></tr>
			<tr><td class="link_text">{url_string}</td></tr>
		</tbody>
	</table>
{:else if settings == 'path'}
	<table class="no_cut_shell">
		<thead>
			<tr class="no_cut_text">
				<th class="no_cut_text">{name}</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th class="flex justify-center qrcode_td"><div id={`qr${id}`} /></th>
			</tr>
			<tr><td class="link_text">{url_string}</td></tr>
		</tbody>
	</table>
{:else}
	<p class="txt-error">Došlo k chybě - zkuste to prosím znovu.</p>
{/if}

<style>
	.shell {
		float: left;
		border: 1px black dashed;
		margin: 10px 10px 10px 10px;
	}

	.no_cut_shell {
		float: left;
		border: 1px black solid;
		margin: 10px 10px 10px 10px;
	}

	.qrcode_td {
		/*padding: 10px 10px 10px 10px;*/
		text-align: center;
		align-self: center;
		padding-left: 25px;
		padding-right: 25px;
		padding-top: 25px;
	}
	.cut_text {
		border-bottom: 1px black dashed;
		padding: 10px 10px 10px 10px;
	}
	.no_cut_text {
		border-bottom: 1px black solid;
		padding: 10px 10px 10px 10px;
	}
	.link_text {
		width: fit-content;
		text-align: center;
		text-decoration: none;
		font-style: normal;
		padding-top: 10px;
		padding-left: 10px;
		padding-right: 10px;
		padding-bottom: 25px;
	}
	@media print {
		.shell {
			color: black;
			float: left;
			border: 1px black dashed;
			margin: 5px 5px 5px 5px;
		}
		.no_cut_shell {
			color: black;
			float: left;
			border: 1px black solid;
			margin: 5px 5px 5px 5px;
		}
		#qrcode {
			width: 128px;
			height: 128px;
		}
		.qrcode_td {
			/*padding: 5px 5px 5px 5px;*/
			text-align: center;
			align-self: center;
			padding-left: 13px;
			padding-right: 13px;
			padding-top: 13px;
		}
		.cut_text {
			border-bottom: 1px black dashed;
			padding: 5px 5px 5px 5px;
		}
		.no_cut_text {
			border-bottom: 1px black solid;
			padding: 5px 5px 5px 5px;
		}
		.link_text {
			width: fit-content;
			text-align: center;
			text-decoration: none;
			font-style: normal;
			padding-top: 5px;
			padding-left: 5px;
			padding-right: 5px;
			padding-bottom: 13px;
		}
	}
</style>
