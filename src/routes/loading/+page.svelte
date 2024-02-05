<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Loading from '$lib/elements/Loading.svelte';
	import { onMount } from 'svelte';

    onMount(()=> {
        setTimeout(() => {goto(`${base}/`, { replaceState: true });}, 5000);
    })
</script>

<Loading />
