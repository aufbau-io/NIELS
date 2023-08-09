<script>
	export let error = {};
	export let status;
</script>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<div class="center">
	<h1>Error {status}</h1>
	<p>{error.message}</p>
</div>

<style>
	.center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
