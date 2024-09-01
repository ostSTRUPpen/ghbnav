<script lang="ts">
	//https://svelte-put.vnphanquang.com/docs/qr
	import QR from '@svelte-put/qr/img/QR.svelte';
	const dev = import.meta.env.DEV;

	export let id: string;
	export let name: string;
	export let floor: string;
	export let settings: string = 'marker';

	const url_string: string = 'https://mapa.ghb.cz';
	let url: string = '';

	if (dev) {
		url = 'http://localhost:5173';
	} else {
		url = url_string;
	}
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
				<td class="flex justify-center qrcode_td">
					<QR
						data={`${url_string}/map/${id}`}
						logo={`${url}/qr_icon.svg`}
						shape="square"
						backgroundFill="white"
						let:src
					>
						<img {src} alt="qr" width="400" />
					</QR>
				</td>
			</tr>
			<tr><td class="link_text text-sm">{`${url_string}/map/${id}`}</td></tr>
			<tr><td class="link_text text-lg">{url_string}</td></tr>
		</tbody>
	</table>
{:else if settings == 'path'}
	<table class="no_cut_shell">
		<thead>
			<tr class="no_cut_text">
				<th class="no_cut_text text-2xl">{name}</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="flex justify-center qrcode_td">
					<QR
						data={`${url_string}/map/${id}`}
						logo={`${url}/qr_icon.svg`}
						shape="square"
						backgroundFill="white"
						let:src
					>
						<img {src} alt="qr" width="300" />
					</QR>
				</td>
			</tr>
			<tr><td class="link_text text-lg">{url_string}</td></tr>
		</tbody>
	</table>
{:else}
	<p class="text-error text-xl flex justify-center">Došlo k chybě - zkuste to prosím znovu.</p>
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
