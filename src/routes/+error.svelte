<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="text-center text-error py-24">
	<h2 class="font-bold text-5xl">{page?.status}</h2>
	<h3 class=" text-xl">{page?.error?.message}</h3>
</div>
