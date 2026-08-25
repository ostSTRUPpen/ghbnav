<svelte:head>
	<title>Historie verzí | GHB nav</title>
	<meta
		name="description"
		content="Stručný přehled hlavních verzí a změn ve školní navigaci GHB nav."
	/>
</svelte:head>

<main class="mx-auto max-w-4xl px-5 pb-16">
	<header class="border-b-2 border-primary pb-6">
		<p class="mb-1 text-sm font-semibold uppercase tracking-wider text-primary">Vývoj projektu</p>
		<h1 class="mb-3 text-4xl font-bold">Historie verzí</h1>
	</header>

	<ol class="version-timeline mt-10">
		<li class="relative pb-12 pl-8">
			<span class="version-arrow absolute left-0 top-0" aria-hidden="true"></span>
			<article>
				<header class="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
					<h2 class="text-3xl font-bold text-primary">5.0.0</h2>
					<span class="badge badge-primary">Aktuální</span>
					<time datetime="2026-08" class="text-sm font-medium text-base-content/70 sm:ml-auto">
						srpen 2026
					</time>
				</header>
				<ul class="list-disc space-y-2 pl-5 marker:text-primary">
					<li>Rychlejší načítání veřejných stránek, mapy a navigačních dat.</li>
					<li>Změna začátku nebo cíle cesty bez opětovného načtení celé mapy.</li>
					<li>Spolehlivější generování a tisk QR kódů pro jednotlivá místa i celé trasy.</li>
					<li>Přehlednější výběr bodů, lepší tmavý režim a nová historie verzí.</li>
					<li>Modernizace vnitřní části aplikace pro spolehlivější další provoz.</li>
				</ul>
			</article>
		</li>

		<li class="relative pb-12 pl-8">
			<span class="version-arrow absolute left-0 top-0" aria-hidden="true"></span>
			<article>
				<header class="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
					<h2 class="text-3xl font-bold text-primary">4.0.2</h2>
					<time datetime="2025-08" class="text-sm font-medium text-base-content/70 sm:ml-auto">
						srpen 2025
					</time>
				</header>
				<ul class="list-disc space-y-2 pl-5 marker:text-primary">
					<li>Dokončená migrace aplikace na Svelte 5.</li>
					<li>Přehlednější seskupené výběry začátku a cíle navigace.</li>
					<li>Opravy URL a tisku QR kódů včetně chybějícího loga a dělení při tisku.</li>
					<li>Opravy tmavého režimu, načítání mapy a okrajových stavů navigace.</li>
				</ul>
			</article>
		</li>

		<li class="relative pb-12 pl-8">
			<span class="version-arrow absolute left-0 top-0" aria-hidden="true"></span>
			<article>
				<header class="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
					<h2 class="text-3xl font-bold text-primary">3.0.0</h2>
					<time datetime="2024-07" class="text-sm font-medium text-base-content/70 sm:ml-auto">
						červenec 2024
					</time>
				</header>
				<ul class="list-disc space-y-2 pl-5 marker:text-primary">
					<li>Supabase bylo nahrazeno přímým připojením k PostgreSQL.</li>
					<li>Databázové dotazy a datové typy byly přepsány pro nové úložiště.</li>
					<li>Přesun provozu na Vercel a doplnění měření rychlosti aplikace.</li>
				</ul>
			</article>
		</li>

		<li class="relative pb-12 pl-8">
			<span class="version-arrow absolute left-0 top-0" aria-hidden="true"></span>
			<article>
				<header class="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
					<h2 class="text-3xl font-bold text-primary">2.0.0</h2>
					<time datetime="2024-05" class="text-sm font-medium text-base-content/70 sm:ml-auto">
						květen 2024
					</time>
				</header>
				<ul class="list-disc space-y-2 pl-5 marker:text-primary">
					<li>Generování QR kódů pro celé trasy, nejen pro jednotlivé body.</li>
					<li>Lepší navigace mezi patry a budovami včetně ovládání schodišť.</li>
					<li>Menší půdorysy ve formátu WebP a další úpravy výkonu mapy.</li>
					<li>Možnost omezit volitelné funkce pro úspornější provoz serveru.</li>
				</ul>
			</article>
		</li>

		<li class="relative pl-8">
			<span class="version-arrow absolute left-0 top-0" aria-hidden="true"></span>
			<article>
				<header class="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
					<h2 class="text-3xl font-bold text-primary">1.0.0</h2>
					<time datetime="2023" class="text-sm font-medium text-base-content/70 sm:ml-auto">
						prosinec 2023
					</time>
				</header>
				<ul class="list-disc space-y-2 pl-5 marker:text-primary">
					<li>První interaktivní mapa školy s místnostmi a speciálními ikonami.</li>
					<li>Výpočet a vykreslení cesty mezi navigačními body.</li>
					<li>Rozhraní správce pro úpravu bodů, ikon a cest.</li>
					<li>Responzivní vzhled, tmavý režim a první tiskové QR kódy.</li>
				</ul>
			</article>
		</li>
	</ol>
</main>

<style>
	.version-timeline {
		position: relative;
	}

	.version-timeline::before {
		position: absolute;
		inset-block: 0;
		left: 0;
		width: 2px;
		content: '';
		background: var(--color-secondary);
		transform: translateX(-50%);
	}

	.version-arrow {
		z-index: 1;
		width: 22px;
		height: 18px;
		background: var(--color-primary);
		clip-path: polygon(50% 0, 100% 100%, 0 100%);
		transform: translateX(-50%);
	}
</style>
