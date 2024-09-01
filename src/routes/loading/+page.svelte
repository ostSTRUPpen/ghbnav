<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Loading from '$lib/elements/Loading.svelte';
	import { onDestroy, onMount } from 'svelte';

    let returnToHomePage: boolean;
    onMount(()=> {
        returnToHomePage = true;
        setTimeout(() => {
            if(returnToHomePage) {
                goto(`${base}/`, { replaceState: true });
            }
        }, 10000);
    })

    onDestroy(() => {
        returnToHomePage = false
    })
</script>

<Loading />
