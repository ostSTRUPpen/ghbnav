<svelte:head>
	<script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
</svelte:head>
<header class="noPrintPdf">
	<a href="/">Domů</a>
	<a href="/map">Mapa</a>
	<a href="/sec">Zabezpečená část</a>
	<form method="POST" action="../auth?/logout"><input type="submit" value="Odhlásit se" /></form>
</header>
<hr class="noPrintPdf" />
<main>
	<slot />
</main>

<style>
	@media print {
		.noPrintPdf {
			display: none;
		}
	}
</style>
