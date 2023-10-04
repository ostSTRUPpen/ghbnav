<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	export let page: string;
	export let text: string;

	function anchor() {
		goto(`${base}/sec${page}`, { replaceState: true });
	}
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="#" on:click={anchor}>{text}</a>
