<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	export let id: string;
	export let name: string;
	export let floor: string;

	//TODO zadat aktuální adresu
	const url_string: string = '';

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

<table class="shell">
	<thead>
		<tr class="cut_text">
			<th class="cut_text">{name} - {floor}</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th class="qrcode_td"><div id={`qr${id}`} /></th>
		</tr>
		<tr><td class="link_text">{`${base}/map/${id}`}</td></tr>
	</tbody>
</table>

<style>
	.shell {
		float: left;
		border: 1px black dashed;
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
			float: left;
			border: 1px black dashed;
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
