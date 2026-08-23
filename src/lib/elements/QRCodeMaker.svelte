<script lang="ts">
	import { createQrSvgDataUrl } from '@svelte-put/qr';
	import { PUBLIC_QR_CODE_URL } from '$env/static/public';
	import qrIconDataUrl from '$lib/images/qr_icon.png?inline';

	interface Props {
		id: string;
		name: string;
		floor: string;
		settings?: string;
	}

	let { id, name, floor, settings = 'marker' }: Props = $props();
	let qrUrl = $derived(`${PUBLIC_QR_CODE_URL}/map/${id}`);
	let qrSource = $derived(
		createQrSvgDataUrl({
			data: qrUrl,
			logo: qrIconDataUrl,
			shape: 'square',
			moduleFill: 'black',
			anchorInnerFill: 'black',
			anchorOuterFill: 'black',
			width: 400,
			height: 400
		})
	);
</script>

{#if settings == 'marker'}
	<div class="print_wrapper">
		<table class="shell">
			<thead>
				<tr class="cut_text">
					<th class="cut_text">{name} - {floor}</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="flex justify-center qrcode_td">
						<img
							src={qrSource}
							alt={`QR kód pro ${name}`}
							width="400"
							height="400"
							decoding="sync"
							style="display: block; background: white;"
						/>
					</td>
				</tr>
				<tr><td class="link_text text-sm">{qrUrl}</td></tr>
				<tr><td class="link_text text-lg">{PUBLIC_QR_CODE_URL}</td></tr>
			</tbody>
		</table>
	</div>
{:else if settings == 'path'}
	<div class="print_wrapper">
		<table class="no_cut_shell">
			<thead>
				<tr class="no_cut_text">
					<th class="no_cut_text text-2xl">{name}</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="flex justify-center qrcode_td">
						<img
							src={qrSource}
							alt={`QR kód pro ${name}`}
							width="400"
							height="400"
							decoding="sync"
							style="display: block; background: white;"
						/>
					</td>
				</tr>
				<tr><td class="link_text text-lg">{PUBLIC_QR_CODE_URL}</td></tr>
			</tbody>
		</table>
	</div>
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
		.print_wrapper {
			break-inside: avoid;
			page-break-inside: avoid;
			break-inside: avoid-page;
			padding: 10px 10px 10px 10px;
		}

		.shell {
			color: black;
			float: left;
			border: 2px black dashed;
			margin: 5px 5px 5px 5px;
		}
		.no_cut_shell {
			color: black;
			float: left;
			border: 2px black solid;
			margin: 5px 5px 5px 5px;
		}
		.qrcode_td {
			text-align: center;
			align-self: center;
			padding-left: 13px;
			padding-right: 13px;
			padding-top: 13px;
		}
		.cut_text {
			border-bottom: 2px black dashed;
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
