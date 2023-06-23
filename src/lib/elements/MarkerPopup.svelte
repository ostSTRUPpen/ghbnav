<script lang="ts">
	export let text;
	export let id;

	function navTo() {
		alert(id);
	}
</script>

<div>
	<p class="marker-paragraph">{text}</p>
	<button class="navigate-button" on:click={navTo}>Navigovat</button>
</div>

<style>
	button {
		text-decoration: underline;
		color: blue;
	}
</style>
